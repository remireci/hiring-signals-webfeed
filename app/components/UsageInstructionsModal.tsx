"use client";

import { useState } from "react";

export default function UsageInstructionsModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-3 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs font-semibold text-gray-500 transition-colors hover:border-blue-600 hover:bg-blue-200 hover:text-blue-800"
        aria-label="How Hiring Signals works"
        title="How Hiring Signals works"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                How Hiring Signals works
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-xl leading-none text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900">🆕 New Signals</h3>
                <p className="mt-1">
                  New signals are vacancies detected during the last hour. If
                  you see &quot;0 new signals&quot;, check the Earlier Signals
                  below — the feed may simply not have detected a new vacancy in
                  the last hour. Our engine runs from 8am to 6pm.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  🗂️ Earlier Signals
                </h3>
                <p className="mt-1">
                  Earlier relevant signals remain available for 30 days. The
                  detection time is shown for every signal.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  🔔 Notifications
                </h3>
                <p className="mt-1">
                  Enable browser notifications to receive an alert when a new
                  hiring signal is detected.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">🎯 What you see</h3>
                <p className="mt-1">
                  Signals are filtered according to your recruitment focus and
                  are based on vacancies posted directly by employers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  📊 Hiring intensity
                </h3>
                <p className="mt-1">
                  The intensity indicates the strength of the hiring signal,
                  based on the number of relevant positions detected for the
                  same employer.
                </p>
                <p className="mt-2">
                  <span className="font-semibold">HIGH 🚀</span> — strong hiring
                  activity
                  <br />
                  <span className="font-semibold">MEDIUM 📈</span> — notable
                  hiring activity
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
