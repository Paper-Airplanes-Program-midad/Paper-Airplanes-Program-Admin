import { read, update } from "@/lib/db";
import type { Role } from "@/lib/users";

export type ApplicationStatus = "new" | "pending" | "approved" | "rejected";

export type Application = {
  userId: string;
  role: Role;
  status: ApplicationStatus;
  submittedUtc: string | null;
  decidedUtc: string | null;
  decidedBy: string | null;
  reason: string | null;
  reference: string | null;
};

export type Applications = Record<string, Application>;

export function blankApplication(userId: string, role: Role): Application {
  const teacher = role === "teacher";
  return {
    userId,
    role,
    status: teacher ? "pending" : "new",
    submittedUtc: teacher ? new Date().toISOString() : null,
    decidedUtc: null,
    decidedBy: null,
    reason: null,
    reference: null,
  };
}

export async function applicationFor(userId: string, role: Role): Promise<Application> {
  const all = await read<Applications>("applications");
  return all[userId] ?? blankApplication(userId, role);
}

export async function saveApplication(next: Application): Promise<Application> {
  const all = await update<Applications>("applications", (current) => ({
    ...current,
    [next.userId]: next,
  }));
  return all[next.userId];
}

export function newReference(): string {
  return `PA-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}
