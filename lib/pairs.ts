import { read, update } from "@/lib/db";
import type { Assignment, Schedule, Session, StoredSemester } from "@/lib/types";

export const LEVELS = ["A1", "A2", "B1", "B2"];

// Same rule the teacher portal uses when a schedule is removed: lessons that
// already started or carry homework stay as history, upcoming ones go.
export async function releaseTutor(studentId: string, tutorId: string) {
  const [semester, homework] = await Promise.all([
    read<StoredSemester>("semester"),
    read<Assignment[]>("homework"),
  ]);
  const withHomework = new Set(homework.map((item) => item.sessionId));
  const now = Date.now();

  await update<Schedule[]>("schedules", (current) =>
    current.filter(
      (entry) =>
        !(
          entry.semester === semester.id &&
          entry.studentId === studentId &&
          entry.tutorId === tutorId
        ),
    ),
  );
  await update<Session[]>("sessions", (current) =>
    current.filter(
      (session) =>
        !(
          session.studentId === studentId &&
          session.tutorId === tutorId &&
          Date.parse(session.startUtc) > now &&
          !withHomework.has(session.id)
        ),
    ),
  );
}
