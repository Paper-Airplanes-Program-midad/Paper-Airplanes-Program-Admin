import { actor, unauthorized } from "@/lib/actor";
import { fail, ok } from "@/lib/db";
import { setIntake, settings, type IntakePatch, type Message } from "@/lib/settings";

const MAX_MESSAGE = 600;

function readMessage(value: unknown): Message | null {
  if (typeof value !== "object" || value === null) return null;
  const { en, ar } = value as { en?: unknown; ar?: unknown };
  if (typeof en !== "string" || typeof ar !== "string") return null;
  if (en.length > MAX_MESSAGE || ar.length > MAX_MESSAGE) return null;
  return { en: en.trim(), ar: ar.trim() };
}

export async function GET() {
  if (!(await actor())) return unauthorized();
  return ok(await settings());
}

export async function PATCH(request: Request) {
  const admin = await actor();
  if (!admin) return unauthorized();

  const body = (await request.json()) as { open?: unknown; message?: unknown };
  const patch: IntakePatch = {};

  if (body.open !== undefined) {
    if (typeof body.open !== "boolean") return fail("bad_value");
    patch.open = body.open;
  }

  if (body.message !== undefined) {
    const message = readMessage(body.message);
    if (!message) return fail("bad_message");
    patch.message = message;
  }

  if (patch.open === undefined && patch.message === undefined) return fail("nothing_to_do");

  return ok({ intake: await setIntake(patch, admin.id) });
}
