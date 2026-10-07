import { actor, unauthorized } from "@/lib/actor";
import { fail, newId, ok, read, update } from "@/lib/db";
import type { L } from "@/lib/i18n";
import type { AnnouncementSent, AnnouncementTemplate, Pair } from "@/lib/types";
import type { Account } from "@/lib/users";

type Store = { templates: AnnouncementTemplate[]; history: AnnouncementSent[] };
type Reads = Record<string, string[]>;

const AUDIENCES = ["students", "tutors", "at_risk"];
const MAX_SUBJECT = 200;
const MAX_BODY = 4000;

function readText(value: unknown, max: number): L | null {
  if (typeof value !== "object" || value === null) return null;
  const { en, ar } = value as { en?: unknown; ar?: unknown };
  if (typeof en !== "string" || typeof ar !== "string") return null;
  if (en.length > max || ar.length > max) return null;
  return { en: en.trim(), ar: ar.trim() };
}

async function recipientsOf(audience: string): Promise<string[]> {
  const [users, pairs] = await Promise.all([read<Account[]>("users"), read<Pair[]>("pairs")]);
  const active = users.filter((user) => user.status === "active");
  if (audience === "tutors") {
    return active.filter((user) => user.role === "teacher").map((user) => user.id);
  }

  const students = active.filter((user) => user.role === "student");
  if (audience === "at_risk") {
    const flagged = new Set(
      pairs.filter((pair) => pair.health === "at_risk").map((pair) => pair.studentId),
    );
    return students.filter((user) => flagged.has(user.id)).map((user) => user.id);
  }
  return students.map((user) => user.id);
}

export async function GET() {
  if (!(await actor())) return unauthorized();

  const [store, reads] = await Promise.all([
    read<Store>("announcements"),
    read<Reads>("notification-reads"),
  ]);
  return ok({
    templates: store.templates,
    history: store.history.map(({ recipientIds, ...sent }) => {
      if (!recipientIds) return sent;
      const opened = recipientIds.filter((id) => reads[id]?.includes(`ann-${sent.id}`)).length;
      return {
        ...sent,
        recipients: recipientIds.length,
        openRate: recipientIds.length ? Math.round((opened / recipientIds.length) * 100) : 0,
      };
    }),
  });
}

export async function POST(request: Request) {
  const admin = await actor();
  if (!admin) return unauthorized();

  const body = (await request.json()) as { subject?: unknown; body?: unknown; audience?: unknown };
  const subject = readText(body.subject, MAX_SUBJECT);
  if (!subject || (!subject.en && !subject.ar)) return fail("bad_subject");
  const message = readText(body.body ?? { en: "", ar: "" }, MAX_BODY);
  if (!message) return fail("bad_body");
  const audience = body.audience;
  if (typeof audience !== "string" || !AUDIENCES.includes(audience)) return fail("bad_audience");

  const recipientIds = await recipientsOf(audience);
  const sent: AnnouncementSent = {
    id: newId("ann"),
    subject,
    body: message,
    audience,
    sentUtc: new Date().toISOString(),
    sentBy: admin.id,
    recipientIds,
    recipients: recipientIds.length,
    openRate: 0,
  };
  await update<Store>("announcements", (current) => ({
    ...current,
    history: [sent, ...current.history],
  }));
  return ok({ id: sent.id, recipients: sent.recipients }, 201);
}
