import { actor, unauthorized } from "@/lib/actor";
import { ok, read, update } from "@/lib/db";

type Reads = Record<string, string[]>;

export async function GET() {
  const user = await actor();
  if (!user) return unauthorized();
  const reads = await read<Reads>("notification-reads");
  return ok(reads[user.id] ?? []);
}

export async function POST(request: Request) {
  const user = await actor();
  if (!user) return unauthorized();
  const { ids } = (await request.json()) as { ids: string[] };
  const reads = await update<Reads>("notification-reads", (current) => ({
    ...current,
    [user.id]: Array.from(new Set([...(current[user.id] ?? []), ...ids])),
  }));
  return ok(reads[user.id]);
}
