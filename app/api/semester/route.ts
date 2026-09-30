import { actor, unauthorized } from "@/lib/actor";
import { fail, newId, ok, read, update } from "@/lib/db";
import { MAX_WEEKS, withWeeks } from "@/lib/semester";
import type { StoredSemester } from "@/lib/types";

const DAY = 86_400_000;
const MAX_NAME = 80;

type Fields = Pick<StoredSemester, "name" | "start" | "end">;

function isDay(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
}

function readFields(body: unknown): Fields | string {
  if (typeof body !== "object" || body === null) return "bad_body";
  const { name, start, end } = body as { name?: { en?: unknown; ar?: unknown }; start?: unknown; end?: unknown };

  const en = typeof name?.en === "string" ? name.en.trim() : "";
  const ar = typeof name?.ar === "string" ? name.ar.trim() : "";
  if (!en || !ar || en.length > MAX_NAME || ar.length > MAX_NAME) return "bad_name";

  if (!isDay(start) || !isDay(end) || end <= start) return "bad_dates";
  if ((Date.parse(end) - Date.parse(start)) / DAY >= MAX_WEEKS * 7) return "too_long";

  return { name: { en, ar }, start, end };
}

export async function GET() {
  if (!(await actor())) return unauthorized();
  return ok(withWeeks(await read<StoredSemester>("semester")));
}

export async function PUT(request: Request) {
  if (!(await actor())) return unauthorized();
  const fields = readFields(await request.json());
  if (typeof fields === "string") return fail(fields);

  const saved = await update<StoredSemester>("semester", (current) => ({ ...current, ...fields }));
  return ok(withWeeks(saved));
}

export async function POST(request: Request) {
  if (!(await actor())) return unauthorized();
  const fields = readFields(await request.json());
  if (typeof fields === "string") return fail(fields);

  const saved = await update<StoredSemester>("semester", (current) => ({
    id: newId("sem"),
    ...fields,
    absenceReasons: current.absenceReasons,
  }));
  return ok(withWeeks(saved));
}
