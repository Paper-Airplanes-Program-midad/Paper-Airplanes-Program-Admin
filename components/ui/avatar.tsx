import { cn } from "./cn";

export function Avatar({
  initials,
  className,
  accent = "var(--accent-cool)",
}: {
  initials: string;
  className?: string;
  accent?: string;
}) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[11px] font-extrabold tracking-wide",
        className,
      )}
      style={{
        background: `color-mix(in oklab, ${accent} 16%, transparent)`,
        borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
        color: accent,
      }}
    >
      {initials}
    </span>
  );
}
