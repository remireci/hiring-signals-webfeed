import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import AutoRefresh from "@/app/components/AutoRefresh";
import SignalNotifications from "@/app/components/SignalNotifications";
import NotificationPermission from "@/app/components/NotificationPermission";
import UsageInstructionsModal from "@/app/components/UsageInstructionsModal";
import { getTargetProfileLabel } from "@/config/targetProfileLabels";

interface HiringSignal {
  signal_id: string;
  company_name: string;
  company_domain?: string;
  jobs_page_url?: string;
  company_job_url?: string;
  target_profile_id: string;
  detected_roles: string[];
  location_city?: string;
  contract_type?: string;
  intensity?: string;
  total_active_count?: number;
  historical_titles_30d?: string[];
  detected_at?: string | Date;
  source?: string;
  source_url?: string;
}

export interface Customer {
  _id?: ObjectId;
  name: string;
  email: string;
  feed_token: string;

  status: string;
  trial_ends_at: Date;

  target_profiles: string[];

  notifications: {
    email: boolean;
    slack: boolean;
  };

  created_at: Date;
  updated_at: Date;
}

interface NotificationSignal {
  signal_id: string;
  company_name: string;
  target_profile_id: string;
}

export default async function TrialPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await clientPromise;
  const db = client.db("vdab_lead_generation");

  const customer = await db.collection<Customer>("agencies").findOne({
    feed_token: token,
  });

  if (!customer) {
    notFound();
  }

  // Optional: enforce trial expiration
  if (customer.trial_ends_at && new Date(customer.trial_ends_at) < new Date()) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">Your trial has ended</h1>
          <p className="text-gray-600">
            Contact us if you would like to continue receiving hiring signals.
          </p>
        </div>
      </main>
    );
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const signals = await db
    .collection<HiringSignal>("hiring_signals")
    .find(
      {
        target_profile_id: { $in: customer.target_profiles },
        detected_at: {
          $gte: thirtyDaysAgo,
        },
      },
      {
        projection: { _id: 0 },
      },
    )
    .sort({ detected_at: -1 })
    .limit(100)
    .toArray();

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const signalsWithStatus = signals.map((signal) => ({
    signal,
    isNew:
      signal.detected_at !== undefined &&
      new Date(signal.detected_at) >= oneHourAgo,
  }));

  const newSignals = signalsWithStatus.filter((item) => item.isNew);
  const olderSignals = signalsWithStatus.filter((item) => !item.isNew);

  const notificationSignals: NotificationSignal[] = signals.map((signal) => ({
    signal_id: signal.signal_id,
    company_name: signal.company_name,
    target_profile_id: signal.target_profile_id,
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <AutoRefresh />
      <SignalNotifications signals={notificationSignals} />
      <div className="max-w-4xl mx-auto px-5 py-10">
        <header className="mb-8">
          <div className="text-sm font-medium text-blue-600 mb-2">
            HIRING SIGNALS
            <UsageInstructionsModal />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {customer.name}
          </h1>

          <NotificationPermission />

          <p className="text-gray-500 mt-2">
            Direct-employer hiring signals detected for your recruitment focus.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-400">
            {/* {newSignals.length} new signals */}
          </h2>

          <span className="text-sm text-gray-500">Updated automatically</span>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">
              {newSignals.length > 0 ? ` 🆕` : "✓"}
            </span>

            <h2
              className={`text-sm font-bold uppercase tracking-wider ${
                newSignals.length > 0 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {newSignals.length > 0
                ? `${newSignals.length} New Signals`
                : "No New Signals"}
            </h2>

            <span className="text-xs font-medium text-gray-400">Last hour</span>
          </div>

          {newSignals.length > 0 ? (
            <div className="space-y-5">
              {newSignals.map(({ signal }) => (
                <SignalCard key={signal.signal_id} signal={signal} isNew />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-sm text-gray-500">
              No new hiring signals were detected during the last hour.
            </div>
          )}
        </section>

        {olderSignals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                🗂️ Earlier Signals
              </h2>

              <span className="text-xs text-gray-400">Last 30 days</span>
            </div>

            <div className="space-y-5">
              {olderSignals.map(({ signal }) => (
                <SignalCard key={signal.signal_id} signal={signal} />
              ))}
            </div>
          </section>
        )}

        {/* {signals.length === 0 && (
          <div className="bg-white rounded-xl border p-10 text-center">
            <h2 className="font-semibold text-lg text-gray-400">
              No signals yet
            </h2>
            <p className="text-gray-500 mt-2">
              New matching hiring signals will appear here automatically.
            </p>
          </div>
        )} */}
      </div>
    </main>
  );
}

function SignalCard({
  signal,
  isNew = false,
}: {
  signal: HiringSignal;
  isNew?: boolean;
}) {
  const actionLink = signal.jobs_page_url
    ? {
        url: signal.jobs_page_url,
        label: "View employer careers →",
      }
    : signal.company_job_url
      ? {
          url: signal.company_job_url,
          label: "View specific job →",
        }
      : signal.source_url
        ? {
            url: signal.source_url,
            label: "View vacancy →",
          }
        : signal.company_domain
          ? {
              url: signal.company_domain.startsWith("http")
                ? signal.company_domain
                : `https://${signal.company_domain}`,
              label: "Visit employer website →",
            }
          : null;

  const targetProfile = getTargetProfileLabel(signal.target_profile_id);

  return (
    <article
      className={`rounded-xl border p-6 shadow-sm ${
        isNew
          ? "border-blue-200 bg-white ring-1 ring-blue-100"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-semibold text-gray-600">
              {signal.company_name}
            </h3>

            {isNew && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                New
              </span>
            )}
          </div>

          {signal.location_city && (
            <div>
              <p className="text-sm text-gray-500 mt-1">
                📍 {signal.location_city}
              </p>

              <p className="text-sm text-gray-500 mt-1">{targetProfile}</p>
            </div>
          )}
        </div>

        {signal.intensity && signal.intensity !== "LOW" && (
          <span className="text-xs font-semibold uppercase tracking-wide text-red-300">
            {signal.intensity}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500 mb-2">Hiring for</p>

        <ul className="space-y-1">
          {signal.detected_roles.map((role) => (
            <li key={role} className="font-medium text-gray-700">
              {role}
            </li>
          ))}
        </ul>
      </div>

      {signal.contract_type && (
        <p className="mt-4 text-sm text-gray-600">
          ℹ️ {signal.contract_type.replace(/^ℹ️\s*/, "")}
        </p>
      )}

      <div className="mt-6">
        {actionLink && (
          <a
            href={actionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            {actionLink.label}
          </a>
        )}
      </div>
      {signal.detected_at && (
        <p className="mt-4 text-xs text-gray-400">
          Detected{" "}
          {new Date(signal.detected_at).toLocaleString("en-BE", {
            timeZone: "Europe/Brussels",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </article>
  );
}
