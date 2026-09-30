import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "glass";
}

export function Card({ variant = "solid", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variant === "glass" ? "glass" : "border border-line bg-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 p-5 pb-0", className)}
    >
      <div className="min-w-0">
        <h3 className="text-base font-bold tracking-tight text-fg">{title}</h3>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-line px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}
