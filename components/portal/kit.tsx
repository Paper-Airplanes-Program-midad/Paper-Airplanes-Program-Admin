import type { ComponentType, ReactNode } from "react";

import { Panel, Reveal, cn } from "@/components/ui";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "var(--accent-cool)",
  delay = 0,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  accent?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Panel className="h-full">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-[12.5px] font-semibold text-fg-muted">{label}</p>
            {Icon && (
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border"
                style={{
                  background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                  borderColor: `color-mix(in oklab, ${accent} 26%, transparent)`,
                  color: accent,
                }}
              >
                <Icon className="h-4 w-4" />
              </span>
            )}
          </div>
          <p className="mt-3 text-[28px] leading-none font-extrabold tracking-[-0.02em] text-fg">
            {value}
          </p>
          {hint && <p className="mt-1.5 text-[11.5px] text-fg-subtle">{hint}</p>}
        </div>
      </Panel>
    </Reveal>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  delay = 0,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <section className={cn("panel overflow-hidden", className)}>
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-extrabold tracking-tight text-fg">
              {title}
            </h2>
            {description && (
              <p className="truncate text-[12px] text-fg-muted">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
        <div className="p-5">{children}</div>
      </section>
    </Reveal>
  );
}

export function Row({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "row flex items-center justify-between gap-3 p-4 transition-colors hover:border-line-strong",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="row h-16 animate-pulse opacity-60" />
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-[13px] text-fg-subtle">
      {message}
    </div>
  );
}

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: "var(--tint-2)", fg: "var(--fg-muted)" },
  accent: { bg: "color-mix(in oklab, var(--accent) 16%, transparent)", fg: "var(--accent)" },
  success: {
    bg: "color-mix(in oklab, var(--accent-mint) 16%, transparent)",
    fg: "var(--accent-mint)",
  },
  warning: {
    bg: "color-mix(in oklab, var(--color-dawn-500) 18%, transparent)",
    fg: "var(--accent)",
  },
  danger: { bg: "rgb(239 68 68 / 0.14)", fg: "rgb(239 68 68)" },
  info: {
    bg: "color-mix(in oklab, var(--accent-cool) 16%, transparent)",
    fg: "var(--accent-cool)",
  },
};

export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  const { bg, fg } = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap capitalize",
        className,
      )}
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "completed":
    case "graded":
    case "attended":
    case "active":
    case "resolved":
    case "good":
      return "success";
    case "in_progress":
    case "scheduled":
    case "submitted":
    case "investigating":
      return "info";
    case "watch":
    case "pending":
    case "paused":
    case "late":
    case "open":
      return "warning";
    case "missed":
    case "at_risk":
    case "cancelled":
    case "rematching":
      return "danger";
    default:
      return "neutral";
  }
}

export function humanise(status: string) {
  return status.replace(/_/g, " ");
}
