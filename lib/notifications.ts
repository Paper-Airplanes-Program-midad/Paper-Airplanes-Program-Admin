"use client";

import { useMemo } from "react";

import { send, useApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { Application } from "@/lib/applications";
import type { Incident, User } from "@/lib/types";

type ApplicationRow = { application: Application; user: User };

export type NotificationKind = "homework" | "grade" | "lesson" | "incident" | "person";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string;
  whenUtc: string | null;
  read: boolean;
};

export function useNotifications() {
  const { t } = useI18n();
  const { data: overview } = useApi<{ incidents: Incident[] }>("/api/overview");
  const { data: applications } = useApi<ApplicationRow[]>("/api/applications");
  const { data: read, refresh } = useApi<string[]>("/api/notifications/read");

  const items = useMemo(() => {
    const list: Omit<Notification, "read">[] = [];

    for (const row of applications ?? []) {
      if (row.application.status !== "pending") continue;
      list.push({
        id: `application-${row.user.id}`,
        kind: "person",
        title: t("notif.application"),
        body: `${row.user.name} · ${t(`role.${row.user.role}`)}`,
        href: "/accounts",
        whenUtc: row.application.submittedUtc,
      });
    }

    for (const incident of overview?.incidents ?? []) {
      if (incident.status === "resolved") continue;
      list.push({
        id: `incident-${incident.id}`,
        kind: "incident",
        title: t("notif.incident"),
        body: `${incident.reference} · ${incident.pair}`,
        href: "/overview",
        whenUtc: incident.createdUtc,
      });
    }

    const seen = new Set(read ?? []);
    return list
      .map((item) => ({ ...item, read: seen.has(item.id) }))
      .sort((a, b) => (b.whenUtc ?? "").localeCompare(a.whenUtc ?? ""));
  }, [overview, applications, read, t]);

  const markAllRead = async () => {
    const ids = items.filter((item) => !item.read).map((item) => item.id);
    if (!ids.length) return;
    await send("/api/notifications/read", "POST", { ids });
    refresh();
  };

  return { items, markAllRead };
}
