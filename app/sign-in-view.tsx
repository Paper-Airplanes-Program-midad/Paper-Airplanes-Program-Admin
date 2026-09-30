"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRight, Button, Input } from "@/components/ui";
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { portal } from "@/lib/portal";

import { AuthError, AuthShell } from "./auth-shell";

export function SignInView() {
  const { t } = useI18n();
  const { user, ready, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(portal.home);
  }, [ready, user, router]);

  return (
    <AuthShell
      title={t("auth.title")}
      subtitle={t("auth.subtitle")}
      footer={
        <p className="mt-6 text-[12px] text-fg-subtle">
          {t("auth.demo")}: {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
      }
    >
      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError(null);
          const result = await signIn(email, password);
          setBusy(false);
          if (result.ok) router.replace(portal.home);
          else setError(t(result.error === "credentials" ? "auth.wrong" : "auth.failed"));
        }}
      >
        <Input
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          dir="ltr"
        />
        <Input
          label={t("auth.password")}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          dir="ltr"
        />

        <AuthError message={error} />

        <Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">
          {busy ? t("common.loading") : t("auth.signin")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </form>
    </AuthShell>
  );
}
