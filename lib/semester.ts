import type {
  AbsenceReason,
  CheckIn,
  Semester,
  SemesterWeek,
  StoredSemester,
} from "@/lib/types";

const DAY = 86_400_000;
export const MAX_WEEKS = 52;
const MAX_NOTE = 1000;

function isoDay(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

export function buildWeeks(start: string, end: string): SemesterWeek[] {
  const first = Date.parse(start);
  const last = Date.parse(end);
  if (Number.isNaN(first) || Number.isNaN(last) || last < first) return [];

  const weeks: SemesterWeek[] = [];
  for (let from = first; from <= last && weeks.length < MAX_WEEKS; from += 7 * DAY) {
    weeks.push({
      week: weeks.length + 1,
      start: isoDay(from),
      end: isoDay(Math.min(from + 6 * DAY, last)),
    });
  }
  return weeks;
}

export function currentWeek(weeks: SemesterWeek[], today = isoDay(Date.now())): number {
  let current = 0;
  for (const entry of weeks) if (entry.start <= today) current = entry.week;
  return current;
}

export function withWeeks(stored: StoredSemester): Semester {
  const weeks = buildWeeks(stored.start, stored.end);
  return { ...stored, weeks, currentWeek: currentWeek(weeks) };
}

export type Report = Pick<CheckIn, "held" | "minutes" | "reason" | "note">;

export function readReport(body: unknown, reasons: AbsenceReason[]): Report | null {
  if (typeof body !== "object" || body === null) return null;
  const { held, minutes, reason, note } = body as Record<string, unknown>;

  if (typeof held !== "boolean") return null;
  if (note != null && (typeof note !== "string" || note.length > MAX_NOTE)) return null;
  const cleanNote = typeof note === "string" && note.trim() ? note.trim() : null;

  if (held) {
    if (typeof minutes !== "number" || !Number.isInteger(minutes)) return null;
    if (minutes < 1 || minutes > 300) return null;
    return { held, minutes, reason: null, note: cleanNote };
  }

  if (typeof reason !== "string" || !reasons.some((entry) => entry.value === reason)) {
    return null;
  }
  return { held, minutes: null, reason, note: cleanNote };
}
