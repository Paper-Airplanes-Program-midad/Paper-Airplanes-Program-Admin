import { ok, read } from "@/lib/db";
import type { Analytics } from "@/lib/types";

export async function GET() {
  return ok(await read<Analytics>("analytics"));
}
