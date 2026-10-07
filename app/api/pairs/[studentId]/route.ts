import { actor, unauthorized } from "@/lib/actor";
import { fail, newId, ok, read, update } from "@/lib/db";
import { LEVELS, releaseTutor } from "@/lib/pairs";
import type { Pair } from "@/lib/types";
import type { Account } from "@/lib/users";

type Params = { params: Promise<{ studentId: string }> };

async function studentOf(params: Params["params"]) {
  const { studentId } = await params;
  const users = await read<Account[]>("users");
  const student = users.find((user) => user.id === studentId && user.role === "student");
  return { users, student };
}

async function pairOf(studentId: string) {
  return (await read<Pair[]>("pairs")).find((pair) => pair.studentId === studentId);
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await actor())) return unauthorized();

  const { users, student } = await studentOf(params);
  if (!student) return fail("no_such_student", 404);
  if (student.status !== "active" && student.status !== "suspended") {
    return fail("student_not_active", 409);
  }

  const body = (await request.json()) as { tutorId?: unknown; level?: unknown };
  const level = body.level;
  if (typeof level !== "string" || !LEVELS.includes(level)) return fail("bad_level");
  const tutor = users.find((user) => user.id === body.tutorId && user.role === "teacher");
  if (!tutor) return fail("no_such_teacher", 404);
  if (tutor.status !== "active") return fail("teacher_not_active", 409);

  const previous = await pairOf(student.id);
  const pair: Pair = {
    ...(previous ?? {
      pairId: newId("pair"),
      status: "active",
      attendanceRate: 0,
      health: "good",
      ungraded: 0,
    }),
    student: student.name,
    studentId: student.id,
    studentLevel: level,
    studentTz: student.timezone,
    tutor: tutor.name,
    tutorId: tutor.id,
    tutorTz: tutor.timezone,
  };

  await update<Pair[]>("pairs", (current) =>
    previous
      ? current.map((entry) => (entry.pairId === previous.pairId ? pair : entry))
      : [...current, pair],
  );
  if (previous && previous.tutorId !== tutor.id) {
    await releaseTutor(student.id, previous.tutorId);
  }

  return ok(pair, previous ? 200 : 201);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await actor())) return unauthorized();

  const { student } = await studentOf(params);
  if (!student) return fail("no_such_student", 404);

  const previous = await pairOf(student.id);
  if (!previous) return fail("no_pair", 404);

  await update<Pair[]>("pairs", (current) =>
    current.filter((entry) => entry.pairId !== previous.pairId),
  );
  await releaseTutor(student.id, previous.tutorId);

  return ok({ pairId: previous.pairId });
}
