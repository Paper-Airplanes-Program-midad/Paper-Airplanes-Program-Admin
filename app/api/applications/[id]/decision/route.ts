import { actor, unauthorized } from "@/lib/actor";
import { applicationFor, saveApplication } from "@/lib/applications";
import { ok, fail, read, update } from "@/lib/db";
import type { Account, Status } from "@/lib/users";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await actor();
  if (!admin) return unauthorized();

  const { id } = await params;
  const { decision, reason } = (await request.json()) as {
    decision: "approved" | "rejected";
    reason?: string;
  };
  if (decision !== "approved" && decision !== "rejected") return fail("bad_decision");
  if (decision === "rejected" && !reason?.trim()) return fail("reason_required");

  const users = await read<Account[]>("users");
  const account = users.find((entry) => entry.id === id);
  if (!account) return fail("no_such_account", 404);
  if (account.role === "admin") return fail("not_reviewable", 403);

  const application = await applicationFor(account.id, account.role);
  if (application.status !== "pending") return fail("not_pending", 409);

  const decided = await saveApplication({
    ...application,
    status: decision,
    decidedUtc: new Date().toISOString(),
    decidedBy: admin.id,
    reason: decision === "rejected" ? reason!.trim() : null,
  });

  const status: Status = decision === "approved" ? "active" : "rejected";
  await update<Account[]>("users", (current) =>
    current.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
  );

  return ok(decided);
}
