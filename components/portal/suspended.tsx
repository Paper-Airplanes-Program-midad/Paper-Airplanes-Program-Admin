"use client";

import { Ban } from "lucide-react";

import { Button, PlaneMark } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function SuspendedScreen() {
  const { t } = useI18n();
  const { signOut } = useAuth();

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="panel flex w-full max-w-md flex-col items-center gap-4 p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-red-500/25 bg-red-500/8 text-red-500">
          <Ban className="h-6 w-6" />
        </span>

        <div>
          <p className="text-[17px] font-extrabold tracking-tight text-fg">
            {t("suspend.title")}
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">
            {t("suspend.body")}
          </p>
          <p className="mt-3 text-[13px] font-semibold text-fg">{t("suspend.contact")}</p>
        </div>

        <Button variant="secondary" onClick={() => void signOut()}>
          {t("nav.signout")}
        </Button>

        <PlaneMark className="mt-2 h-6 w-6 opacity-40" />
      </div>
    </div>
  );
}
