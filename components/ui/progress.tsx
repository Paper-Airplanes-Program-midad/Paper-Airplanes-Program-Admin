import { cn } from "./cn";

export function Progress({
  value,
  className,
  accent = "var(--accent-cool)",
  label,
}: {
  value: number;
  className?: string;
  accent?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-tint-2", className)}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-expo)]"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, color-mix(in oklab, ${accent} 55%, transparent), ${accent})`,
        }}
      />
    </div>
  );
}
