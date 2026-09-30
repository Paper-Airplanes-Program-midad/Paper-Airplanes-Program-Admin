import { actor, unauthorized } from "@/lib/actor";
import { fail, ok, read, update } from "@/lib/db";
import { readReport } from "@/lib/semester";
import type { CheckIn, StoredSemester } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await actor();
  if (!admin) return unauthorized();

  const { id } = await params;
  const semester = await read<StoredSemester>("semester");
  const report = readReport(await request.json(), semester.absenceReasons);
  if (!report) return fail("bad_report");

  const editedUtc = new Date().toISOString();
  const rows = await update<CheckIn[]>("checkins", (current) =>
    current.map((row) => (row.id === id ? { ...row, ...report, editedUtc, editedBy: admin.id } : row)),
  );

  const saved = rows.find((row) => row.id === id);
  if (!saved) return fail("No such check-in", 404);
  return ok(saved);
}
