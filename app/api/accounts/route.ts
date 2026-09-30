import { actor, unauthorized } from "@/lib/actor";
import { fail, ok, read } from "@/lib/db";
import { createAccount, publicUser, type Account } from "@/lib/users";

export async function GET() {
  if (!(await actor())) return unauthorized();
  const users = await read<Account[]>("users");
  return ok(
    users
      .map(publicUser)
      .sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name)),
  );
}

export async function POST(request: Request) {
  if (!(await actor())) return unauthorized();

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    timezone?: string;
  };

  if (body.password !== body.confirmPassword) return fail("mismatch");

  const result = await createAccount({
    role: "admin",
    name: body.name ?? "",
    email: body.email ?? "",
    password: body.password ?? "",
    timezone: body.timezone ?? "UTC",
  });

  if (!result.ok) {
    return fail(result.reason, result.reason === "taken" ? 409 : 400);
  }

  return ok(result.user, 201);
}
