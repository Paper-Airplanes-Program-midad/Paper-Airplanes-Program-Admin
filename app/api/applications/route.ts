import { actor, unauthorized } from "@/lib/actor";
import type { Applications } from "@/lib/applications";
import { ok, read } from "@/lib/db";
import type { Account } from "@/lib/users";

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  attempts: number;
  at: string;
  answers?: Record<string, string>;
};

type ExamResult = { at: string; answers: Record<string, string | string[]> };

type UnitProgress = {
  done?: string[];
  quizzes?: Record<string, QuizResult>;
  exams?: Record<string, ExamResult>;
  completedAt?: string;
};

type Progress = Record<string, { units?: Record<string, UnitProgress> }>;

export async function GET() {
  if (!(await actor())) return unauthorized();

  const [applications, users, progress] = await Promise.all([
    read<Applications>("applications"),
    read<Account[]>("users"),
    read<Progress>("training-progress"),
  ]);

  const rows = Object.values(applications)
    .map((application) => {
      const account = users.find((entry) => entry.id === application.userId);
      if (!account) return null;

      const units = progress[application.userId]?.units ?? {};
      const training = Object.entries(units).map(([slug, unit]) => ({
        slug,
        completedAt: unit.completedAt ?? null,
        blocksDone: unit.done?.length ?? 0,
        quizzes: Object.entries(unit.quizzes ?? {}).map(([id, quiz]) => ({
          id,
          score: quiz.score,
          total: quiz.total,
          passed: quiz.passed,
          attempts: quiz.attempts,
          at: quiz.at,
          answers: quiz.answers ?? {},
        })),
        exams: Object.entries(unit.exams ?? {}).map(([id, exam]) => ({
          id,
          at: exam.at,
          answers: exam.answers ?? {},
        })),
      }));

      return {
        application,
        user: {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          initials: account.initials,
          timezone: account.timezone,
          status: account.status,
          createdUtc: account.createdUtc,
        },
        training,
        completed: training.filter((unit) => unit.completedAt).length,
      };
    })
    .filter((row) => row !== null);

  const order = { pending: 0, new: 1, rejected: 2, approved: 3 };
  rows.sort(
    (a, b) =>
      order[a.application.status] - order[b.application.status] ||
      (b.application.submittedUtc ?? "").localeCompare(a.application.submittedUtc ?? ""),
  );

  return ok(rows);
}
