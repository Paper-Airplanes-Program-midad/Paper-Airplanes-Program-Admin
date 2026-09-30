import type { CSSProperties, ReactNode } from "react";

export function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl border border-line bg-card transition-colors duration-300 hover:border-line-strong ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
