"use client";

import { Link2, Link2Off, Pencil, UserPlus, Users } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/portal/app-shell";
import { EmptyState, Loading, SectionCard, StatusPill, humanise } from "@/components/portal/kit";
import { Button, Checkbox, Input, Select, useToast } from "@/components/ui";
import { send, useApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { adminNav } from "@/lib/nav";
import type { Pair, User } from "@/lib/types";

type Person = Pick<User, "id" | "name" | "email" | "timezone" | "status">;
type Student = Person & { pair: Pair | null };
type Pairing = { levels: string[]; teachers: Person[]; students: Student[] };

export function PairsView() {
  const { t } = useI18n();
  const { data, refresh } = useApi<Pairing>("/api/pairs");
  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!data) {
    return (
      <AppShell nav={adminNav} title={t("pairs.title")} description={t("common.loading")}>
        <Loading rows={4} />
      </AppShell>
    );
  }

  const { students, teachers } = data;
  const assigned = students.filter((student) => student.pair).length;
  const wanted = query.trim().toLowerCase();
  const visible = students.filter(
    (student) =>
      (!onlyOpen || !student.pair) &&
      `${student.name} ${student.email} ${student.pair?.tutor ?? ""}`
        .toLowerCase()
        .includes(wanted),
  );

  return (
    <AppShell nav={adminNav} title={t("pairs.title")} description={t("pairs.subtitle")}>
      <SectionCard
        title={t("pairs.students")}
        description={`${assigned}/${students.length} ${t("pairs.count")}`}
        action={<Users className="h-4 w-4 text-fg-faint" />}
      >
        {teachers.length === 0 && (
          <p className="mb-4 rounded-2xl border border-dashed border-line px-4 py-3 text-[12.5px] text-fg-muted">
            {t("pairs.noteachers")}
          </p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Input
            placeholder={t("common.search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            wrapperClassName="w-full sm:max-w-xs"
          />
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-fg">
            <Checkbox checked={onlyOpen} onChange={(event) => setOnlyOpen(event.target.checked)} />
            {t("pairs.onlyopen")}
          </label>
        </div>

        {visible.length === 0 ? (
          <EmptyState message={t("common.empty")} />
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((student) => {
              const open = openId === student.id;
              return (
                <li key={student.id} className="row p-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[13.5px] font-bold text-fg">{student.name}</p>
                        {student.status !== "active" && (
                          <StatusPill tone="danger">{humanise(student.status)}</StatusPill>
                        )}
                      </div>
                      <p className="truncate text-[11.5px] text-fg-subtle">
                        {student.email} · {student.timezone}
                      </p>
                    </div>

                    {student.pair ? (
                      <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-fg-muted">
                        <Link2 className="h-3.5 w-3.5 shrink-0 text-fg-faint" />
                        <span className="truncate font-semibold text-fg">{student.pair.tutor}</span>
                        <StatusPill tone="info">{student.pair.studentLevel}</StatusPill>
                      </div>
                    ) : (
                      <StatusPill tone="warning">{t("pairs.none")}</StatusPill>
                    )}

                    <Button
                      size="sm"
                      variant={open || student.pair ? "secondary" : "primary"}
                      disabled={!open && teachers.length === 0}
                      onClick={() => setOpenId(open ? null : student.id)}
                    >
                      {open ? null : student.pair ? (
                        <Pencil className="h-3.5 w-3.5" />
                      ) : (
                        <UserPlus className="h-3.5 w-3.5" />
                      )}
                      {open
                        ? t("review.close")
                        : student.pair
                          ? t("pairs.change")
                          : t("pairs.assign")}
                    </Button>
                  </div>

                  {open && (
                    <PairForm
                      student={student}
                      teachers={teachers}
                      students={students}
                      levels={data.levels}
                      onDone={() => {
                        setOpenId(null);
                        refresh();
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </AppShell>
  );
}

function PairForm({
  student,
  teachers,
  students,
  levels,
  onDone,
}: {
  student: Student;
  teachers: Person[];
  students: Student[];
  levels: string[];
  onDone: () => void;
}) {
  const { t } = useI18n();
  const toast = useToast();
  const { pair } = student;
  const current = teachers.find((teacher) => teacher.id === pair?.tutorId);

  const [tutorId, setTutorId] = useState(current?.id ?? teachers[0]?.id ?? "");
  const [level, setLevel] = useState(pair?.studentLevel ?? levels[0]);
  const [busy, setBusy] = useState(false);

  const loadOf = (teacher: Person) =>
    students.filter((entry) => entry.pair?.tutorId === teacher.id).length;
  const tutor = teachers.find((teacher) => teacher.id === tutorId);
  const changing = !!pair && pair.tutorId !== tutorId;

  const act = async (run: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await run();
      toast.success(t(done));
      onDone();
    } catch (cause) {
      toast.info((cause as Error).message);
      setBusy(false);
    }
  };

  return (
    <form
      className="mt-4 flex flex-col gap-4 border-t border-line pt-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (changing && !window.confirm(t("pairs.changeconfirm"))) return;
        act(
          () => send(`/api/pairs/${student.id}`, "PUT", { tutorId, level }),
          pair ? "pairs.updated" : "pairs.assigned",
        );
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <Select
          label={t("pairs.teacher")}
          hint={t("pairs.teacherhint")}
          value={tutorId}
          onChange={(event) => setTutorId(event.target.value)}
          options={teachers.map((teacher) => ({
            value: teacher.id,
            label: `${teacher.name} · ${teacher.timezone} (${loadOf(teacher)})`,
          }))}
        />
        <Select
          label={t("common.level")}
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          options={levels.map((code) => ({ value: code, label: code }))}
        />
      </div>

      {changing && (
        <p className="text-[12.5px] leading-relaxed text-fg-muted">{t("pairs.changehint")}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button size="sm" type="submit" disabled={busy || !tutor}>
          <Link2 className="h-3.5 w-3.5" />
          {pair ? t("common.save") : t("pairs.assign")}
        </Button>
        {pair && (
          <Button
            size="sm"
            variant="danger"
            type="button"
            disabled={busy}
            onClick={() => {
              if (!window.confirm(t("pairs.removeconfirm"))) return;
              act(() => send(`/api/pairs/${student.id}`, "DELETE"), "pairs.removed");
            }}
          >
            <Link2Off className="h-3.5 w-3.5" />
            {t("pairs.remove")}
          </Button>
        )}
      </div>
    </form>
  );
}
