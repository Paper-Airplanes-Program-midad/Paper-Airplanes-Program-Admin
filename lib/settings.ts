import { read, update } from "@/lib/db";

export type Message = { en: string; ar: string };

export type Intake = {
  open: boolean;
  message: Message;
  changedUtc: string | null;
  changedBy: string | null;
};

export type Settings = { intake: Intake };

const FALLBACK: Intake = {
  open: true,
  message: { en: "", ar: "" },
  changedUtc: null,
  changedBy: null,
};

export async function settings(): Promise<Settings> {
  try {
    const stored = await read<Partial<Settings>>("settings");
    return {
      intake: {
        ...FALLBACK,
        ...stored.intake,
        message: { ...FALLBACK.message, ...stored.intake?.message },
      },
    };
  } catch {
    return { intake: FALLBACK };
  }
}

export type IntakePatch = { open?: boolean; message?: Message };

export async function setIntake(patch: IntakePatch, adminId: string): Promise<Intake> {
  const current = (await settings()).intake;
  const next: Intake = {
    open: patch.open ?? current.open,
    message: patch.message ?? current.message,
    changedUtc: new Date().toISOString(),
    changedBy: adminId,
  };

  const saved = await update<Settings>("settings", (stored) => ({ ...stored, intake: next }));
  return saved.intake;
}

