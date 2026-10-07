"use client";

import { AlertTriangle, CalendarCheck } from "lucide-react";

import { AppShell } from "@/components/portal/app-shell";
import { TrendChart } from "@/components/portal/charts";
import {
  Loading,
  Row,
  SectionCard,
  StatCard,
  StatusPill,
  statusTone,
} from "@/components/portal/kit";
import { useApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { Analytics, Incident, Pair } from "@/lib/types";
import { adminNav } from "@/lib/nav";

export function OverviewView() {
  const { t, tv } = useI18n();
  const { data } = useApi<{
    pairs: Pair[];
    incidents: Incident[];
    analytics: Analytics;
  }>("/api/overview");

  if (!data) {
    return (
      <AppShell nav={adminNav} title={t("nav.overview")} description={t("common.loading")}>
        <Loading rows={4} />
      </AppShell>
    );
  }

  const { pairs, incidents } = data;
  const attendanceTrend = data.analytics.attendanceTrend;

  const avg = pairs.length
    ? Math.round(pairs.reduce((total, pair) => total + pair.attendanceRate, 0) / pairs.length)
    : 0;
  const open = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <AppShell nav={adminNav} title={t("nav.overview")} description={t("app.name")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t("admin.avgattendance")}
          value={`${avg}%`}
          icon={CalendarCheck}
          accent="var(--accent-mint)"
        />
        <StatCard
          label={t("admin.openincidents")}
          value={open}
          icon={AlertTriangle}
          accent="var(--accent)"
          delay={80}
        />
      </div>

      <SectionCard title={t("admin.trend")}>
        <TrendChart
          data={attendanceTrend.map((week) => ({ label: week.week, value: week.rate }))}
          accent="var(--accent-cool)"
        />
      </SectionCard>

      <SectionCard title={t("nav.incidents")} delay={80}>
        <ul className="flex flex-col gap-3">
          {incidents.map((incident) => (
            <Row key={incident.id}>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-fg">
                  {incident.reference} · {incident.type}
                </p>
                <p className="truncate text-[11.5px] text-fg-subtle">
                  {tv(incident.summary)}
                </p>
              </div>
              <StatusPill tone={statusTone(incident.status)}>{incident.status}</StatusPill>
            </Row>
          ))}
        </ul>
      </SectionCard>
    </AppShell>
  );
}
