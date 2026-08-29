"use client";

import { useState } from "react";

export default function NotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setPermission("denied");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
  }

  if (permission === "granted") {
    return (
      <span className="text-sm text-green-600">🔔 Notifications enabled</span>
    );
  }

  if (permission === "denied") {
    return <span className="text-sm text-gray-400">Notifications blocked</span>;
  }

  return (
    <button
      onClick={enableNotifications}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      🔔 Enable notifications
    </button>
  );
}
