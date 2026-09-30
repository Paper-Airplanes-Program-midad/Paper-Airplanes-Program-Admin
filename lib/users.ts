import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { newId, read, update } from "@/lib/db";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export type Role = "student" | "teacher" | "admin";

export type Status = "new" | "pending" | "active" | "rejected" | "suspended";

export type Account = {
  id: string;
  role: Role;
  name: string;
  email: string;
  initials: string;
  timezone: string;
  passwordHash: string;
  status: Status;
  createdUtc: string;
};

export type PublicUser = Omit<Account, "passwordHash">;

export function publicUser(account: Account): PublicUser {
  const { id, role, name, email, initials, timezone, status, createdUtc } = account;
  return { id, role, name, email, initials, timezone, status, createdUtc };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0] ?? "");
  return letters.join("").toUpperCase() || "?";
}

export async function findByEmail(email: string): Promise<Account | undefined> {
  const accounts = await read<Account[]>("users");
  const wanted = normaliseEmail(email);
  return accounts.find((account) => normaliseEmail(account.email) === wanted);
}

export async function findById(id: string): Promise<Account | undefined> {
  const accounts = await read<Account[]>("users");
  return accounts.find((account) => account.id === id);
}

export type NewAccount = {
  role: Role;
  name: string;
  email: string;
  password: string;
  timezone: string;
};

export type CreateResult =
  | { ok: true; user: PublicUser }
  | { ok: false; reason: "taken" | "invalid" };

export async function createAccount(input: NewAccount): Promise<CreateResult> {
  const name = input.name.trim();
  const email = normaliseEmail(input.email);
  if (name.length < 2 || !email.includes("@") || input.password.length < 8) {
    return { ok: false, reason: "invalid" };
  }
  if (await findByEmail(email)) return { ok: false, reason: "taken" };

  const account: Account = {
    id: newId(input.role === "student" ? "stu" : input.role === "teacher" ? "tut" : "fac"),
    role: input.role,
    name,
    email,
    initials: initialsOf(name),
    timezone: input.timezone || "UTC",
    passwordHash: await hashPassword(input.password),
    status: input.role === "admin" ? "active" : input.role === "teacher" ? "pending" : "new",
    createdUtc: new Date().toISOString(),
  };

  let taken = false;
  await update<Account[]>("users", (current) => {
    if (current.some((entry) => normaliseEmail(entry.email) === email)) {
      taken = true;
      return current;
    }
    return [...current, account];
  });

  return taken ? { ok: false, reason: "taken" } : { ok: true, user: publicUser(account) };
}

export async function authenticate(
  email: string,
  password: string,
  role: Role,
): Promise<PublicUser | null> {
  const account = await findByEmail(email);
  if (!account || account.status === "suspended" || account.role !== role) return null;
  if (!(await verifyPassword(password, account.passwordHash))) return null;
  return publicUser(account);
}
