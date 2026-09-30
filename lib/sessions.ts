import type { L } from "@/lib/i18n";
import type { Session } from "@/lib/types";

const MINUTE = 60_000;

export const JOIN_EARLY = 15 * MINUTE;

export type SessionState = "cancelled" | "upcoming" | "open" | "ended";

export function sessionState(session: Session, now: number): SessionState {
  if (session.status === "cancelled") return "cancelled";
  if (now > Date.parse(session.endUtc)) return "ended";
  if (now >= Date.parse(session.startUtc) - JOIN_EARLY) return "open";
  return "upcoming";
}

export function plannedMinutes(session: Session): number {
  return Math.round((Date.parse(session.endUtc) - Date.parse(session.startUtc)) / MINUTE);
}

export function sessionTitle(session: Session, t: (key: string) => string, tv: (value: L) => string) {
  return tv(session.topic) || t(session.makeup ? "sched.makeup" : "sched.weekly");
}

export function weekPlan(sessions: Session[], now: number) {
  const active = sessions.filter((session) => session.status !== "cancelled");
  const ended = active.filter((session) => Date.parse(session.endUtc) <= now);
  const pending = active
    .filter((session) => Date.parse(session.endUtc) > now)
    .sort((a, b) => b.endUtc.localeCompare(a.endUtc))[0];

  return {
    scheduled: sessions.length,
    opensAt: pending?.endUtc ?? null,
    held: ended.length > 0,
    minutes: ended.reduce((sum, session) => sum + (session.minutes ?? plannedMinutes(session)), 0),
  };
}
