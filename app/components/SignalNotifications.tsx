"use client";

import { useEffect, useRef } from "react";
// import { getTargetProfileLabel } from "@/config/targetProfileLabels";

interface NotificationSignal {
  signal_id: string;
  company_name: string;
  target_profile_id: string;
}

interface SignalNotificationsProps {
  signals: NotificationSignal[];
}

export default function SignalNotifications({
  signals,
}: SignalNotificationsProps) {
  const seenSignalIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    // On the first load, mark all currently existing signals as seen.
    // We don't want 5 notifications firing when the recruiter opens
    // the feed for the first time.
    if (!initialized.current) {
      signals.forEach((signal) => {
        seenSignalIds.current.add(signal.signal_id);
      });

      initialized.current = true;
      return;
    }

    // Subsequent refreshes: look for signals we haven't seen yet.
    const newSignals = signals.filter(
      (signal) => !seenSignalIds.current.has(signal.signal_id),
    );

    if (newSignals.length > 0) {
      notifyNewSignals(newSignals);

      // THIS is where we add them to the Set.
      newSignals.forEach((signal) => {
        seenSignalIds.current.add(signal.signal_id);
      });
    }
  }, [signals]);

  return null;
}

function notifyNewSignals(signals: NotificationSignal[]) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  //   const title =
  //     signals.length === 1
  //       ? "New hiring signal"
  //       : `${signals.length} new hiring signals`;

  //   const body = signals.map((signal) => signal.company_name).join(" · ");

  //   const targetProfile = getTargetProfileLabel(signals[0].target_profile_id);

  //   const body =
  //     signals.length === 1
  //       ? `${signals[0].company_name} — ${targetProfile}`
  //       : signals
  //           .map(
  //             (signal) =>
  //               `${signal.company_name} — ${getTargetProfileLabel(signal.target_profile_id)}`,
  //           )
  //           .join("\n");

  //   const notification = new Notification(title, {
  //     body,
  //     tag: signals[0].signal_id,
  //   });

  const title =
    signals.length === 1
      ? `🔥 New hiring signal — ${signals[0].company_name}`
      : `🔥 ${signals.length} new hiring signals`;

  const notification = new Notification(title, {
    requireInteraction: true,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}
