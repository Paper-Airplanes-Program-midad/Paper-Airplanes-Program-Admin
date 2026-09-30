"use client";

import { CalendarPlus, CalendarRange, Pencil } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/portal/app-shell";
import { EmptyState, Loading, SectionCard, StatusPill } from "@/components/portal/kit";
import { Button, Input, Radio, Select, Textarea, useToast } from "@/components/ui";
import { send, useApi } from "@/lib/api";
import { useDeviceTimezone } from "@/lib/client";
import { useI18n } from "@/lib/i18n";
import { adminNav } from "@/lib/nav";
import { MAX_WEEKS, buildWeeks } from "@/lib/semester";
import { formatDate, formatDayInTz, formatInTz, zoneLabel } from "@/lib/time";
import type { CheckIn, Pair, Semester, Session } from "@/lib/types";

type Attendance = { semester: Semester; pairs: Pair[]; checkins: CheckIn[]; sessions: Session[] };

const DAY = 86_400_000;

export function AttendanceView() {
  const { t, tv } = useI18n();
  const { data, refresh } = useApi<Attendance>("/api/attendance");

  return (
    <AppShell
      nav={adminNav}
      title={t("nav.attendance")}
      description={data ? tv(data.semester.name) : t("common.loading")}
    >
      {data ? (
        <>
          <SemesterCard semester={data.semester} onSaved={refresh} />
          <WeeklyForms data={data} onSaved={refresh} />
        </>
      ) : (
        <Loading rows={4} />
      )}
    </AppShell>
  );
}

type Draft = { ar: string; en: string; start: string; end: string };

function SemesterCard({ semester, onSaved }: { semester: Semester; onSaved: () => void }) {
  const { t, tv, locale } = useI18n();
  const toast = useToast();
  const [mode, setMode] = useState<"view" | "edit" | "new">("view");
  const [draft, setDraft] = useState<Draft>({ ar: "", en: "", start: "", end: "" });
  const [busy, setBusy] = useState(false);

  const open = (next: "edit" | "new") => {
    setDraft(
      next === "edit"
        ? { ...semester.name, start: semester.start, end: semester.end }
        : { ar: "", en: "", start: "", end: "" },
    );
    setMode(next);
  };

  const today = new Date().toISOString().slice(0, 10);
  const status =
    semester.currentWeek === 0
      ? { tone: "info" as const, label: t("sem.notstarted") }
      : today > semester.end
        ? { tone: "neutral" as const, label: t("sem.ended") }
        : { tone: "success" as const, label: `${t("sem.current")}: ${semester.currentWeek}` };

  if (mode === "view") {
    return (
      <SectionCard title={t("sem.title")} description={t("sem.subtitle")}>
        <div className="row flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-transparent bg-gradient-to-br from-dawn-500 to-dawn-400 text-on-accent">
              <CalendarRange className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-extrabold text-fg">{tv(semester.name)}</p>
              <p className="mt-1 text-[12.5px] text-fg-muted">
                {formatDate(semester.start, locale)} – {formatDate(semester.end, locale)} ·{" "}
                {semester.weeks.length} {t("sem.weeks")}
              </p>
            </div>
          </div>
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button size="sm" variant="secondary" onClick={() => open("edit")}>
            <Pencil className="h-3.5 w-3.5" />
            {t("sem.edit")}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => open("new")}>
            <CalendarPlus className="h-3.5 w-3.5" />
            {t("sem.new")}
          </Button>
        </div>
      </SectionCard>
    );
  }

  const weeks = buildWeeks(draft.start, draft.end);
  const tooLong = (Date.parse(draft.end) - Date.parse(draft.start)) / DAY >= MAX_WEEKS * 7;
  const badDates = !!draft.start && !!draft.end && draft.end <= draft.start;
  const ready = !!draft.ar.trim() && !!draft.en.trim() && weeks.length > 0 && !badDates && !tooLong;

  return (
    <SectionCard title={t("sem.title")} description={t("sem.subtitle")}>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            await send("/api/semester", mode === "new" ? "POST" : "PUT", {
              name: { ar: draft.ar, en: draft.en },
              start: draft.start,
              end: draft.end,
            });
            toast.success(t(mode === "new" ? "sem.created" : "sem.saved"));
            setMode("view");
            onSaved();
          } catch (cause) {
            const message = (cause as Error).message;
            toast.info(
              message === "bad_dates"
                ? t("sem.baddates")
                : message === "too_long"
                  ? t("sem.toolong")
                  : message,
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold text-fg">
            {t(mode === "new" ? "sem.new" : "sem.edit")}
          </p>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-fg-muted">
            {t(mode === "new" ? "sem.newhint" : "sem.edithint")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t("sem.namear")}
            required
            maxLength={80}
            value={draft.ar}
            onChange={(event) => setDraft({ ...draft, ar: event.target.value })}
          />
          <Input
            label={t("sem.nameen")}
            required
            maxLength={80}
            dir="ltr"
            value={draft.en}
            onChange={(event) => setDraft({ ...draft, en: event.target.value })}
          />
          <Input
            label={t("sem.start")}
            type="date"
            required
            dir="ltr"
            value={draft.start}
            onChange={(event) => setDraft({ ...draft, start: event.target.value })}
          />
          <Input
            label={t("sem.end")}
            type="date"
            required
            dir="ltr"
            min={draft.start || undefined}
            value={draft.end}
            onChange={(event) => setDraft({ ...draft, end: event.target.value })}
          />
        </div>

        <p className="text-[12.5px] text-fg-subtle">
          {badDates
            ? t("sem.baddates")
            : tooLong
              ? t("sem.toolong")
              : weeks.length > 0
                ? `${weeks.length} ${t("sem.weeks")} · ${t("sem.firstweek")}: ${formatDate(weeks[0].start, locale)} – ${formatDate(weeks[0].end, locale)}`
                : null}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button size="sm" type="submit" disabled={busy || !ready}>
            {t(mode === "new" ? "sem.new" : "common.save")}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            disabled={busy}
            onClick={() => setMode("view")}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

function WeeklyForms({ data, onSaved }: { data: Attendance; onSaved: () => void }) {
  const { t, locale } = useI18n();
  const { semester, pairs, checkins, sessions } = data;
  const tz = useDeviceTimezone("UTC");
  const [picked, setPicked] = useState<number | null>(null);
  const week = picked ?? semester.currentWeek;

  const sessionsOf = (student: string) =>
    sessions
      .filter((session) => session.week === week && session.studentName === student)
      .sort((a, b) => a.startUtc.localeCompare(b.startUtc));
  const joined = (session: Session, by: CheckIn["by"]) => {
    const first = session.joins?.find((entry) => entry.by === by);
    return first ? formatInTz(first.atUtc, tz, locale) : t("sched.nojoin");
  };

  const rows = checkins.filter((row) => row.week === week);
  const find = (student: string, by: CheckIn["by"]) =>
    rows.find((row) => row.studentName === student && row.by === by);

  const people = new Map(pairs.map((pair) => [pair.student, pair.tutor]));
  for (const row of rows) if (!people.has(row.studentName)) people.set(row.studentName, row.tutorName);
  const complete = [...people.keys()].filter(
    (student) => find(student, "student") && find(student, "tutor"),
  ).length;

  return (
    <SectionCard title={t("att.title")} description={t("att.subtitle")} delay={80}>
      {semester.currentWeek === 0 ? (
        <EmptyState message={t("sem.notstarted")} />
      ) : (
        <>
          <Select
            label={t("common.week")}
            value={String(week)}
            onChange={(event) => setPicked(Number(event.target.value))}
            options={semester.weeks
              .filter((entry) => entry.week <= semester.currentWeek)
              .reverse()
              .map((entry) => ({
                value: String(entry.week),
                label: `${t("common.week")} ${entry.week} · ${formatDate(entry.start, locale)} – ${formatDate(entry.end, locale)}`,
              }))}
            wrapperClassName="sm:max-w-[26rem]"
          />
          <p className="mt-3 text-[12.5px] text-fg-subtle">
            {complete}/{people.size} {t("att.complete")}
          </p>

          <ul className="mt-5 flex flex-col gap-3">
            {[...people].map(([student, tutor]) => {
              const fromStudent = find(student, "student");
              const fromTutor = find(student, "tutor");
              const differ =
                !!fromStudent &&
                !!fromTutor &&
                (fromStudent.held !== fromTutor.held || fromStudent.minutes !== fromTutor.minutes);

              return (
                <li key={student} className="row p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-[13.5px] font-bold text-fg">
                      {student} · {tutor}
                    </p>
                    {differ && <StatusPill tone="warning">{t("att.mismatch")}</StatusPill>}
                  </div>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {sessionsOf(student).map((session) => (
                      <li
                        key={session.id}
                        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-muted"
                      >
                        <span className="font-semibold text-fg">
                          {formatDayInTz(session.startUtc, tz, locale)} ·{" "}
                          {formatInTz(session.startUtc, tz, locale)}–
                          {formatInTz(session.endUtc, tz, locale)} {zoneLabel(session.startUtc, tz)}
                        </span>
                        {session.makeup && <StatusPill tone="accent">{t("sched.makeup")}</StatusPill>}
                        {session.status === "cancelled" ? (
                          <StatusPill tone="danger">{t("sched.cancelled")}</StatusPill>
                        ) : (
                          <span>
                            {t("att.student")}: {joined(session, "student")} · {t("att.tutor")}:{" "}
                            {joined(session, "tutor")}
                          </span>
                        )}
                      </li>
                    ))}
                    {sessionsOf(student).length === 0 && (
                      <li className="text-[12px] text-fg-subtle">{t("sched.nosessions")}</li>
                    )}
                  </ul>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Report
                      key={`${week}-student`}
                      label={t("att.student")}
                      row={fromStudent}
                      semester={semester}
                      onSaved={onSaved}
                    />
                    <Report
                      key={`${week}-tutor`}
                      label={t("att.tutor")}
                      row={fromTutor}
                      semester={semester}
                      onSaved={onSaved}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </SectionCard>
  );
}

function Report({
  label,
  row,
  semester,
  onSaved,
}: {
  label: string;
  row: CheckIn | undefined;
  semester: Semester;
  onSaved: () => void;
}) {
  const { t, tv, locale } = useI18n();
  const [editing, setEditing] = useState(false);

  const heading = (
    <p className="text-[11px] font-bold tracking-[0.12em] text-fg-faint uppercase">{label}</p>
  );

  if (!row) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-3">
        {heading}
        <p className="mt-1 text-[12.5px] text-fg-subtle">{t("att.missing")}</p>
      </div>
    );
  }

  if (editing) {
    return (
      <ReportForm
        heading={heading}
        row={row}
        semester={semester}
        onClose={(saved) => {
          setEditing(false);
          if (saved) onSaved();
        }}
      />
    );
  }

  const reason = semester.absenceReasons.find((entry) => entry.value === row.reason)?.label;
  const stamp = row.editedUtc
    ? `${t("att.edited")} · ${formatDate(row.editedUtc, locale)}`
    : row.submittedUtc
      ? `${t("att.sent")} · ${formatDate(row.submittedUtc, locale)}`
      : "";

  return (
    <div className="rounded-2xl border border-line bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        {heading}
        <StatusPill tone={row.held ? "success" : "danger"}>
          {row.held ? t("checkin.held") : t("checkin.nosession")}
        </StatusPill>
      </div>
      <p className="mt-1.5 text-[13px] font-bold text-fg">
        {row.held ? `${row.minutes} ${t("lesson.min")}` : reason ? tv(reason) : "—"}
      </p>
      {row.note && (
        <p className="mt-1 text-[12px] leading-relaxed whitespace-pre-line text-fg-muted">
          {row.note}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-fg-subtle">{stamp}</p>
        <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
          {t("att.edit")}
        </Button>
      </div>
    </div>
  );
}

function ReportForm({
  heading,
  row,
  semester,
  onClose,
}: {
  heading: React.ReactNode;
  row: CheckIn;
  semester: Semester;
  onClose: (saved: boolean) => void;
}) {
  const { t, tv } = useI18n();
  const toast = useToast();
  const [held, setHeld] = useState(row.held);
  const [minutes, setMinutes] = useState(String(row.minutes ?? 60));
  const [reason, setReason] = useState(row.reason ?? semester.absenceReasons[0].value);
  const [note, setNote] = useState(row.note ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
          await send(`/api/attendance/${row.id}`, "PATCH", {
            held,
            minutes: held ? Number(minutes) : null,
            reason: held ? null : reason,
            note: note.trim() || null,
          });
          toast.success(t("att.saved"));
          onClose(true);
        } catch (cause) {
          toast.info((cause as Error).message);
          setBusy(false);
        }
      }}
    >
      {heading}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-[13px] font-semibold text-fg">{t("checkin.happened")}</legend>
        <div className="mt-1 flex gap-6">
          {[
            { value: true, label: t("common.yes") },
            { value: false, label: t("common.no") },
          ].map((option) => (
            <label
              key={String(option.value)}
              className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-fg"
            >
              <Radio
                name={`held-${row.id}`}
                checked={held === option.value}
                onChange={() => setHeld(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {held ? (
        <Input
          label={t("checkin.minutes")}
          type="number"
          min={1}
          max={300}
          required
          dir="ltr"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
          wrapperClassName="sm:max-w-[14rem]"
        />
      ) : (
        <Select
          label={t("checkin.reason")}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          options={semester.absenceReasons.map((entry) => ({
            value: entry.value,
            label: tv(entry.label),
          }))}
        />
      )}

      <Textarea
        label={t("common.notes")}
        placeholder={t("common.optional")}
        className="min-h-20"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        <Button size="sm" type="submit" disabled={busy}>
          {t("common.save")}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          type="button"
          disabled={busy}
          onClick={() => onClose(false)}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
