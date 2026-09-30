import { ok, read } from "@/lib/db";
import type { Analytics, Incident, Pair } from "@/lib/types";

export async function GET() {
  const [pairs, incidents, analytics] = await Promise.all([
    read<Pair[]>("pairs"),
    read<Incident[]>("incidents"),
    read<Analytics>("analytics"),
  ]);
  return ok({ pairs, incidents, analytics });
}
