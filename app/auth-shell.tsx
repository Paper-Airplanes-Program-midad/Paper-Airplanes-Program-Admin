"use client";

import { Languages } from "lucide-react";
import type { ReactNode } from "react";

import { ArrowRight, PlaneMark, ThemeToggle } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { LANDING_URL, portal } from "@/lib/portal";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="always-dark relative hidden overflow-hidden lg:block">
        <div className="grid-bg absolute inset-0" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <PlaneMark className="h-9 w-9" />
            <span className="text-[15px] font-extrabold tracking-tight text-fg">
              {t("app.name")}
            </span>
          </div>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-tint px-3 py-1 text-[11px] font-bold tracking-[0.15em] text-accent-cool uppercase">
              <span className="h-1 w-1 rounded-full bg-dawn-400" />
              {t("auth.eyebrow")}
            </span>
            <h2 className="mt-6 text-[2.6rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-fg">
              {t("app.tagline").split(" ").slice(0, -2).join(" ")}{" "}
              <span className="font-serif font-normal italic text-gradient-dawn">
                {t("app.tagline").split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-pretty text-fg-muted">
              {t("auth.pitch")}
            </p>
          </div>

          <a
            href={LANDING_URL}
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-fg-subtle transition-colors hover:text-fg"
          >
            {t("auth.back")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </a>
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-10">
        <div className="relative w-full max-w-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 lg:hidden">
              <PlaneMark className="h-7 w-7" />
              <span className="text-sm font-extrabold tracking-tight text-fg">
                {t("app.name")}
              </span>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-tint px-3 text-[12px] font-bold text-fg-muted transition-colors hover:text-fg"
              >
                <Languages className="h-3.5 w-3.5" />
                {locale === "en" ? "العربية" : "English"}
              </button>
            </div>
          </div>

          <span className="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-tint px-3 py-1 text-[11px] font-bold tracking-[0.15em] text-accent-cool uppercase">
            <span className="h-1 w-1 rounded-full bg-dawn-400" />
            {t(portal.nameKey)}
          </span>

          <h1 className="mt-4 text-[1.9rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-fg">
            {title}
          </h1>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-fg-muted">{subtitle}</p>

          {children}

          {footer}

          <a
            href={LANDING_URL}
            className="mt-8 inline-block text-[12.5px] font-semibold text-fg-subtle transition-colors hover:text-fg lg:hidden"
          >
            {t("auth.back")}
          </a>
        </div>
      </section>
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-fg"
    >
      {message}
    </p>
  );
}
