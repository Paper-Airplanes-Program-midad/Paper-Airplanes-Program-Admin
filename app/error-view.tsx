"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import { ArrowRight, PlaneMark, ThemeToggle, cn } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LANDING_URL, portal } from "@/lib/portal";

export type ErrorCode = 403 | 404;

function LostPlane({ code, className = "" }: { code: ErrorCode; className?: string }) {
  const badge = code === 403 ? "var(--accent)" : "var(--accent-cool)";

  return (
    <svg
      viewBox="0 0 240 170"
      fill="none"
      aria-hidden
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id="es-body" x1="118" y1="18" x2="192" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--mark-a)" />
          <stop offset="0.5" stopColor="var(--mark-b)" />
          <stop offset="1" stopColor="var(--mark-c)" />
        </linearGradient>
        <linearGradient id="es-fold" x1="140" y1="62" x2="190" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--mark-fold-a)" />
          <stop offset="1" stopColor="var(--mark-fold-b)" />
        </linearGradient>
        <linearGradient id="es-trail" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--trail-2)" stopOpacity="0" />
          <stop offset="0.45" stopColor="var(--trail-2)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--trail-2)" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="es-glow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="var(--color-dawn-500)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--color-dawn-500)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="52" r="66" fill="url(#es-glow)" />

      <path
        d="M 2 150 C 44 156, 74 140, 96 118 S 124 94, 136 80"
        stroke="url(#es-trail)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 14"
        className="animate-trail"
      />

      {code === 404 && (
        <g fill="var(--accent-cool)">
          <circle cx="196" cy="17" r="2.2" opacity="0.5" />
          <circle cx="207" cy="12" r="1.7" opacity="0.34" />
          <circle cx="216" cy="8.5" r="1.3" opacity="0.22" />
        </g>
      )}
      <g className="animate-float [transform-box:view-box] [transform-origin:center]">
        <g transform="translate(108 14) scale(2.5)">
          <path
            d="M29.4 3.1 2.9 13.6c-.9.4-.8 1.7.1 2l6.9 2.2 2.6 8.3c.3.9 1.5 1.1 2.1.3l3.6-4.5 7 5.2c.7.5 1.7.1 1.9-.7l3.5-21.8c.1-.9-.8-1.6-1.6-1.3Z"
            fill="url(#es-body)"
          />
          <path
            d="m12.5 17.8 16.6-13.6-13.9 15.5-.1 5.9c0 .4-.6.5-.7.1l-1.9-7.9Z"
            fill="url(#es-fold)"
          />
        </g>
      </g>

      <circle cx="190" cy="95" r="27" fill={badge} opacity="0.13" />
      <circle
        cx="190"
        cy="95"
        r="21"
        fill="var(--card)"
        stroke="var(--line-strong)"
        strokeWidth="1.2"
      />

      {code === 403 ? (
        <g>
          <path
            d="M184.6 91.5v-2.6a5.4 5.4 0 0 1 10.8 0v2.6"
            stroke={badge}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="181.6" y="91" width="16.8" height="13.4" rx="3.4" fill={badge} />
          <circle cx="190" cy="96.4" r="1.7" fill="var(--card)" />
          <path d="M190 97.6v2.6" stroke="var(--card)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path
            d="M185.4 90.6a4.9 4.9 0 0 1 9.5 1.6c0 3.3-4.7 3.6-4.7 6.4"
            stroke={badge}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="190.2" cy="103" r="1.8" fill={badge} />
        </g>
      )}
    </svg>
  );
}

export function ErrorView({ code }: { code: ErrorCode }) {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();

  const path = usePathname();
  const signedIn = !!user;

  return (
    <main className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-5 py-20 sm:px-8">
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Link href={signedIn ? portal.home : "/"} className="flex items-center gap-2.5">
          <PlaneMark className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="text-[14px] font-extrabold tracking-tight text-fg">
              {t("app.name")}
            </span>
            <span className="mt-0.5 text-[10px] font-bold tracking-[0.12em] text-accent-cool uppercase">
              {t(portal.roleKey)}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
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

      <div className="relative mx-auto w-full max-w-xl text-center">
        <LostPlane code={code} className="mx-auto w-[min(15rem,54vw)]" />

        <span className="-mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-tint px-3 py-1 text-[11px] font-bold tracking-[0.15em] text-accent uppercase">
          <span className="h-1 w-1 rounded-full bg-dawn-400" />
          {t(`err.${code}.eyebrow`)}
        </span>

        <p
          dir="ltr"
          className="mt-5 font-serif text-[clamp(4.25rem,16vw,7.5rem)] leading-[0.82] tracking-[-0.02em] text-gradient"
        >
          {code}
          <span className="text-accent">.</span>
        </p>

        <h1 className="mt-4 text-[clamp(1.6rem,4.6vw,2.4rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-fg">
          {t(`err.${code}.lead`)}{" "}
          <span
            className={cn(
              "text-gradient-dawn",
              locale === "en" && "font-serif font-normal italic",
            )}
          >
            {t(`err.${code}.accent`)}
          </span>
          .
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-pretty text-fg-muted">
          {t(`err.${code}.body`)}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={signedIn ? portal.home : "/"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-dawn-500 to-dawn-400 px-6 text-[15px] font-semibold text-on-accent transition-all duration-200 hover:brightness-105 sm:w-auto"
          >
            {signedIn ? t("err.home") : t("auth.signin")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <a
            href={LANDING_URL}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card px-6 text-[15px] font-semibold text-fg transition-all duration-200 hover:border-line-strong hover:bg-tint sm:w-auto"
          >
            {t("auth.back")}
          </a>
        </div>

        {code === 404 && path && (
          <p className="mt-9 text-[12px] text-fg-faint">
            {t("err.path")}{" "}
            <span
              dir="ltr"
              className="inline-block rounded-md bg-tint px-1.5 py-0.5 align-middle font-mono text-[11.5px] text-fg-subtle"
            >
              {path}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
