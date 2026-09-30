"use client";

import { useId } from "react";

import { cn } from "@/components/ui";

export function BarChart({
  data,
  suffix = "",
  accent = "var(--accent)",
  className,
}: {
  data: { label: string; value: number }[];
  suffix?: string;
  accent?: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className={cn("flex items-end gap-2 sm:gap-3", className)}>
      {data.map((d, i) => (
        <li key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <span className="text-[11.5px] font-bold text-fg-muted tabular-nums">
            {d.value}
            {suffix}
          </span>
          <span
            className="bar-rise w-full rounded-t-lg"
            style={{
              height: `${Math.max(6, (d.value / max) * 128)}px`,
              background: `linear-gradient(to top, color-mix(in oklab, ${accent} 35%, transparent), ${accent})`,
              animationDelay: `${i * 70}ms`,
            }}
          />
          <span className="w-full truncate text-center text-[11px] text-fg-faint">
            {d.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

const W = 640;
const H = 190;
const PAD = 14;

export function TrendChart({
  data,
  suffix = "%",
  accent = "var(--accent-cool)",
}: {
  data: { label: string; value: number }[];
  suffix?: string;
  accent?: string;
}) {
  const gradientId = useId();
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = Math.max(0, min - (max - min || 10) * 0.6);
  const hi = max + (max - min || 10) * 0.35;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => H - PAD - ((v - lo) / (hi - lo)) * (H - PAD * 2);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H} L${x(0)},${H} Z`;

  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={data.map((d) => `${d.label} ${d.value}${suffix}`).join(", ")}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + f * (H - PAD * 2)}
            y2={PAD + f * (H - PAD * 2)}
            stroke="var(--line)"
            strokeDasharray="3 6"
          />
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={d.label}
            cx={x(i)}
            cy={y(d.value)}
            r="4"
            fill="var(--chart-surface)"
            stroke={accent}
            strokeWidth="2.5"
          />
        ))}
      </svg>

      <ul className="flex justify-between px-1">
        {data.map((d) => (
          <li key={d.label} className="text-center text-[11px] text-fg-faint">
            <span className="block font-bold text-fg-muted tabular-nums">
              {d.value}
              {suffix}
            </span>
            {d.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
