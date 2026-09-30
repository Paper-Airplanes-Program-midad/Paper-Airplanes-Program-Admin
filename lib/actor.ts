import { auth } from "@/auth";

import { findById, publicUser, type PublicUser } from "@/lib/users";
import { portal } from "@/lib/portal";

export async function actor(): Promise<PublicUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const account = await findById(id);
  if (!account) return null;
  if (account.role !== portal.role) return null;

  return publicUser(account);
}

export async function requireActive(): Promise<PublicUser | Response> {
  const user = await actor();
  if (!user) return unauthorized();
  if (user.status === "suspended") return suspended();
  if (user.status !== "active") return forbidden();
  return user;
}

export function unauthorized() {
  return Response.json({ error: "Not signed in" }, { status: 401 });
}

export function forbidden() {
  return Response.json({ error: "Account not approved yet" }, { status: 403 });
}

export function suspended() {
  return Response.json({ error: "Account suspended" }, { status: 403 });
}
