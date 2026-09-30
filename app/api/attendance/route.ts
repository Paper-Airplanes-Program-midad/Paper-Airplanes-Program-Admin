import { actor, unauthorized } from "@/lib/actor";
import { ok, read } from "@/lib/db";
import { withWeeks } from "@/lib/semester";
import type { CheckIn, Pair, Session, StoredSemester } from "@/lib/types";

export async function GET() {
  if (!(await actor())) return unauthorized();

  const [semester, pairs, checkins, sessions] = await Promise.all([
    read<StoredSemester>("semester"),
    read<Pair[]>("pairs"),
    read<CheckIn[]>("checkins"),
    read<Session[]>("sessions"),
  ]);
  return ok({
    semester: withWeeks(semester),
    pairs,
    checkins: checkins.filter((row) => row.semester === semester.id),
    sessions: sessions.filter((session) => session.semester === semester.id),
  });
}
