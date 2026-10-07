import { actor, unauthorized } from "@/lib/actor";
import { ok, read } from "@/lib/db";
import { LEVELS } from "@/lib/pairs";
import type { Pair } from "@/lib/types";
import type { Account } from "@/lib/users";

function person({ id, name, email, timezone, status }: Account) {
  return { id, name, email, timezone, status };
}

export async function GET() {
  if (!(await actor())) return unauthorized();

  const [users, pairs] = await Promise.all([read<Account[]>("users"), read<Pair[]>("pairs")]);
  const byStudent = new Map(pairs.map((pair) => [pair.studentId, pair]));

  return ok({
    levels: LEVELS,
    teachers: users
      .filter((user) => user.role === "teacher" && user.status === "active")
      .map(person)
      .sort((a, b) => a.name.localeCompare(b.name)),
    students: users
      .filter((user) => user.role === "student")
      .map((student) => ({ ...person(student), pair: byStudent.get(student.id) ?? null }))
      .filter((row) => row.status === "active" || row.pair)
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
}
