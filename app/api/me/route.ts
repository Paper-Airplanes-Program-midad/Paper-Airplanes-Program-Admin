import { actor, unauthorized } from "@/lib/actor";
import { ok } from "@/lib/db";

export async function GET() {
  const user = await actor();
  if (!user) return unauthorized();
  return ok({ user });
}
