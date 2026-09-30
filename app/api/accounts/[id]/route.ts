import { actor, unauthorized } from "@/lib/actor";
import { ok, fail, read, update } from "@/lib/db";
import { publicUser, type Account, type Status } from "@/lib/users";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await actor();
  if (!admin) return unauthorized();

  const { id } = await params;
  const { status } = (await request.json()) as { status: Status };
  if (status !== "suspended" && status !== "active") return fail("bad_status");
  if (id === admin.id) return fail("not_yourself", 409);

  const users = await read<Account[]>("users");
  const account = users.find((entry) => entry.id === id);
  if (!account) return fail("no_such_account", 404);

  const next = await update<Account[]>("users", (current) =>
    current.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
  );

  return ok(publicUser(next.find((entry) => entry.id === id)!));
}
