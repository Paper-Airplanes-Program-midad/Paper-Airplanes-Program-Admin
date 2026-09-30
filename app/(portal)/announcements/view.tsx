"use client";

import { Megaphone, Send } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/portal/app-shell";
import { Loading, Row, SectionCard, StatusPill } from "@/components/portal/kit";
import { Button, Input, Select, Textarea, useToast } from "@/components/ui";
import { send, useApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { AnnouncementSent, AnnouncementTemplate } from "@/lib/types";
import { adminNav } from "@/lib/nav";
import { formatInTz } from "@/lib/time";

const AUDIENCES = ["students", "tutors", "at_risk"];

export function AnnouncementsView() {
  const { t, tv, locale } = useI18n();
  const toast = useToast();

  const [audience, setAudience] = useState("students");
  const [subjectEn, setSubjectEn] = useState("");
  const [subjectAr, setSubjectAr] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyAr, setBodyAr] = useState("");
  const [busy, setBusy] = useState(false);
  const { data, refresh } = useApi<{
    templates: AnnouncementTemplate[];
    history: AnnouncementSent[];
  }>("/api/announcements");
  const announcementTemplates = data?.templates ?? [];
  const announcementHistory = data?.history ?? [];

  const applyTemplate = (id: string) => {
    const template = announcementTemplates.find((x) => x.id === id);
    if (!template) return;
    setSubjectEn(template.subject.en);
    setSubjectAr(template.subject.ar);
    setBodyEn(template.body.en);
    setBodyAr(template.body.ar);
  };

  return (
    <AppShell nav={adminNav} title={t("comms.title")} description={t("comms.subtitle")}>
      <SectionCard
        title={t("comms.templates")}
        action={<Megaphone className="h-4 w-4 text-fg-faint" />}
      >
        <div className="flex flex-wrap gap-2">
          {announcementTemplates.map((template) => (
            <Button
              key={template.id}
              size="sm"
              variant="secondary"
              onClick={() => applyTemplate(template.id)}
            >
              {tv(template.name)}
            </Button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t("comms.compose")} delay={80}>
        <div className="flex flex-col gap-4">
          <Select
            label={t("comms.audience")}
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            options={AUDIENCES.map((option) => ({
              value: option,
              label: t(`comms.audience${option}`),
            }))}
            wrapperClassName="sm:max-w-xs"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Input
                label={`${t("comms.subject")} · EN`}
                value={subjectEn}
                onChange={(event) => setSubjectEn(event.target.value)}
                dir="ltr"
              />
              <Textarea
                aria-label={`${t("comms.body")} EN`}
                rows={6}
                value={bodyEn}
                onChange={(event) => setBodyEn(event.target.value)}
                dir="ltr"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Input
                label={`${t("comms.subject")} · AR`}
                value={subjectAr}
                onChange={(event) => setSubjectAr(event.target.value)}
                dir="rtl"
              />
              <Textarea
                aria-label={`${t("comms.body")} AR`}
                rows={6}
                value={bodyAr}
                onChange={(event) => setBodyAr(event.target.value)}
                dir="rtl"
              />
            </div>
          </div>

          <Button
            className="self-start"
            disabled={busy || (!subjectEn.trim() && !subjectAr.trim())}
            onClick={async () => {
              setBusy(true);
              try {
                await send("/api/announcements", "POST", {
                  subject: { en: subjectEn, ar: subjectAr },
                  body: { en: bodyEn, ar: bodyAr },
                  audience,
                });
                setSubjectEn("");
                setSubjectAr("");
                setBodyEn("");
                setBodyAr("");
                refresh();
                toast.success(t("comms.sent"));
              } catch (cause) {
                toast.info((cause as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <Send className="h-4 w-4" />
            {t("comms.send")}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title={t("comms.history")} delay={140}>
        {!data && <Loading rows={3} />}
        <ul className="flex flex-col gap-3">
          {announcementHistory.map((announcement) => (
            <Row key={announcement.id}>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-fg">
                  {tv(announcement.subject)}
                </p>
                <p className="truncate text-[11.5px] text-fg-subtle">
                  {t(`comms.audience${announcement.audience}`)} · {announcement.recipients} ·{" "}
                  {formatInTz(announcement.sentUtc, "UTC", locale, {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <StatusPill tone={announcement.openRate >= 75 ? "success" : "info"}>
                {announcement.openRate}% {t("comms.openrate")}
              </StatusPill>
            </Row>
          ))}
        </ul>
      </SectionCard>
    </AppShell>
  );
}
