import { ok, read } from "@/lib/db";
import type { Incident } from "@/lib/types";

export async function GET() {
  return ok(await read<Incident[]>("incidents"));
}
