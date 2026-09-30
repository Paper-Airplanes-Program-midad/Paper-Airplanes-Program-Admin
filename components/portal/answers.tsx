"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { StatusPill } from "@/components/portal/kit";
import { cn } from "@/components/ui";
import type { Exam, ExamQuestion } from "@/lib/exam";
import { useI18n } from "@/lib/i18n";
import {
  questionPoints,
  unitsBySlug,
  type Block,
  type ExamBlock,
  type QuizBlock,
  type Question,
} from "@/lib/training";

export type QuizAttempt = {
  id: string;
  score: number;
  total: number;
  passed: boolean;
  attempts: number;
  at: string;
  answers: Record<string, string>;
};

export type ExamAttempt = {
  id: string;
  at: string;
  answers: Record<string, string | string[]>;
};

export type TrainingUnit = {
  slug: string;
  completedAt: string | null;
  blocksDone: number;
  quizzes: QuizAttempt[];
  exams: ExamAttempt[];
};

function blocksOf(slug: string): Block[] {
  const unit = unitsBySlug.get(slug);
  return unit ? unit.sections.flatMap((section) => section.blocks) : [];
}

export function unitTitle(slug: string): string | null {
  return unitsBySlug.get(slug)?.title ?? null;
}

export function hasAnswers(unit: TrainingUnit): boolean {
  return unit.quizzes.length > 0 || unit.exams.length > 0;
}

function isCorrect(question: Question, answers: Record<string, string>): boolean {
  if (question.kind === "grid") {
    return question.rows.every((row) => answers[row.id] === row.answer);
  }
  if (question.kind === "choice") return answers[question.id] === question.answer;
  const given = (answers[question.id] ?? "").trim().toLowerCase();
  return question.accept.some((accepted) => accepted.toLowerCase() === given);
}

function Verdict({ correct }: { correct: boolean }) {
  return correct ? (
    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-mint" />
  ) : (
    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
  );
}

function Given({
  value,
  correct,
  expected,
  ltr,
}: {
  value: string;
  correct: boolean;
  expected?: string;
  ltr?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <p
        dir={ltr ? "ltr" : undefined}
        className={cn(
          "rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed",
          correct
            ? "border-mint-500/45 bg-mint-500/10 text-fg"
            : "border-red-500/45 bg-red-500/8 text-fg",
        )}
      >
        <span className="font-bold text-fg-subtle">{t("review.gave")}: </span>
        {value || t("review.noanswer")}
      </p>
      {!correct && expected && (
        <p className="text-[12px] text-fg-muted">
          {t("training.correctanswer")}:{" "}
          <span dir={ltr ? "ltr" : undefined} className="font-semibold text-fg">
            {expected}
          </span>
        </p>
      )}
    </div>
  );
}

function QuestionAnswer({
  question,
  answers,
}: {
  question: Question;
  answers: Record<string, string>;
}) {
  const { t } = useI18n();

  if (question.kind === "text") {
    const given = (answers[question.id] ?? "").trim();
    return (
      <Given
        ltr
        value={given}
        correct={isCorrect(question, answers)}
        expected={question.accept[0]}
      />
    );
  }

  if (question.kind === "choice") {
    const label = (id: string) =>
      t(question.choices.find((choice) => choice.id === id)?.label ?? "");
    const given = answers[question.id];
    return (
      <Given
        value={given ? label(given) : ""}
        correct={isCorrect(question, answers)}
        expected={label(question.answer)}
      />
    );
  }

  const label = (id: string) =>
    t(question.columns.find((column) => column.id === id)?.label ?? "");

  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {question.rows.map((row) => {
        const given = answers[row.id];
        const correct = given === row.answer;
        return (
          <li
            key={row.id}
            className={cn(
              "flex items-start gap-2 rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed",
              correct
                ? "border-mint-500/45 bg-mint-500/10"
                : "border-red-500/45 bg-red-500/8",
            )}
          >
            <Verdict correct={correct} />
            <span className="min-w-0 text-fg">
              {t(row.label)}
              <span className="mt-0.5 block text-[12px] text-fg-muted">
                {t("review.gave")}:{" "}
                <span className="font-semibold text-fg">
                  {given ? label(given) : t("review.noanswer")}
                </span>
                {!correct && (
                  <>
                    {" · "}
                    {t("training.correctanswer")}:{" "}
                    <span className="font-semibold text-fg">{label(row.answer)}</span>
                  </>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function QuizAnswers({ block, attempt }: { block: QuizBlock; attempt: QuizAttempt }) {
  const { t } = useI18n();

  return (
    <section className="rounded-2xl border border-line bg-tint p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold text-fg">{t(block.title)}</p>
          <p className="mt-1 text-[11.5px] text-fg-subtle">
            {t("training.attempt")} {attempt.attempts}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[13px] font-extrabold text-fg tabular-nums">
            {attempt.score}
            <span className="text-fg-faint">/{attempt.total}</span>
          </span>
          <StatusPill tone={attempt.passed ? "success" : "danger"}>
            {t(attempt.passed ? "training.quizpassed" : "training.quizfailed")}
          </StatusPill>
        </div>
      </header>

      <ol className="mt-4 flex flex-col gap-3">
        {block.questions.map((question, index) => {
          const correct = isCorrect(question, attempt.answers);
          return (
            <li key={question.id} className="rounded-2xl border border-line bg-card p-3.5">
              <div className="flex items-start gap-2">
                {question.kind !== "grid" && <Verdict correct={correct} />}
                <p className="min-w-0 text-[12.5px] leading-relaxed font-semibold text-fg">
                  <span className="text-fg-faint tabular-nums">{index + 1}. </span>
                  {t(question.prompt)}
                </p>
                <StatusPill tone="neutral" className="ms-auto">
                  {questionPoints(question)} {t("training.points")}
                </StatusPill>
              </div>
              <QuestionAnswer question={question} answers={attempt.answers} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ExamAnswer({
  question,
  answer,
}: {
  question: ExamQuestion;
  answer: string | string[] | undefined;
}) {
  const { t } = useI18n();

  const text = () => {
    if (question.kind === "choice" || question.kind === "multi") {
      const picked = Array.isArray(answer) ? answer : answer ? [answer] : [];
      const labels = picked.map(
        (id) => question.choices.find((choice) => choice.id === id)?.label ?? id,
      );
      return labels.join(" · ");
    }
    return Array.isArray(answer) ? answer.join(" · ") : (answer ?? "");
  };

  const value = text().trim();

  return (
    <p
      dir="ltr"
      className={cn(
        "mt-2 rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-line",
        value ? "border-line bg-tint-2 text-fg" : "border-line bg-tint text-fg-subtle",
      )}
    >
      {value || t("review.noanswer")}
    </p>
  );
}

function ExamAnswers({ exam, attempt }: { exam: Exam; attempt: ExamAttempt }) {
  const { t } = useI18n();

  return (
    <section className="rounded-2xl border border-line bg-tint p-4">
      <header>
        <p className="text-[13px] font-extrabold text-fg">{t(exam.title)}</p>
        <p className="mt-1 text-[11.5px] text-fg-muted">{t("review.placementnote")}</p>
      </header>

      <div className="mt-4 flex flex-col gap-4">
        {exam.parts.map((part) => (
          <div key={part.id}>
            <p className="text-[12.5px] font-extrabold text-fg" dir="ltr">
              {part.label}
            </p>
            {part.groups.map((group) => (
              <div key={group.id} className="mt-2.5">
                <p className="text-[12px] font-semibold text-fg-muted" dir="ltr">
                  {group.title}
                </p>
                <ol className="mt-2 flex flex-col gap-2.5">
                  {group.questions.map((question) => (
                    <li
                      key={question.id}
                      className="rounded-2xl border border-line bg-card p-3.5"
                      dir="ltr"
                    >
                      <p className="text-[12.5px] leading-relaxed font-semibold text-fg">
                        <span className="text-fg-faint tabular-nums">
                          {question.label ?? question.n}.{" "}
                        </span>
                        {question.prompt}
                      </p>
                      <ExamAnswer question={question} answer={attempt.answers[question.id]} />
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function UnitAnswers({ unit }: { unit: TrainingUnit }) {
  const blocks = blocksOf(unit.slug);

  const quizzes = unit.quizzes
    .map((attempt) => {
      const block = blocks.find(
        (entry) => entry.kind === "quiz" && entry.id === attempt.id,
      ) as QuizBlock | undefined;
      return block ? { block, attempt } : null;
    })
    .filter((entry) => entry !== null);

  const exams = unit.exams
    .map((attempt) => {
      const block = blocks.find(
        (entry) => entry.kind === "exam" && entry.id === attempt.id,
      ) as ExamBlock | undefined;
      return block ? { block, attempt } : null;
    })
    .filter((entry) => entry !== null);

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
      {quizzes.map(({ block, attempt }) => (
        <QuizAnswers key={attempt.id} block={block} attempt={attempt} />
      ))}
      {exams.map(({ block, attempt }) => (
        <ExamAnswers key={attempt.id} exam={block.exam} attempt={attempt} />
      ))}
    </div>
  );
}
