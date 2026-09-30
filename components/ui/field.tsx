"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";
import { cn } from "./cn";

function Shell({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-semibold text-fg">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-fg-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Shell label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn("field h-10", error && "border-red-500", className)}
        {...props}
      />
    </Shell>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  className,
  wrapperClassName,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Shell label={label} hint={hint} error={error} htmlFor={inputId} className={wrapperClassName}>
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn("field resize-y", error && "border-red-500", className)}
        {...props}
      />
    </Shell>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  hint?: ReactNode;
  wrapperClassName?: string;
  options: { value: string; label: ReactNode }[];
}

export function Select({
  label,
  hint,
  className,
  wrapperClassName,
  options,
  id,
  ...props
}: SelectProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Shell label={label} hint={hint} htmlFor={inputId} className={wrapperClassName}>
      <select id={inputId} className={cn("field h-10", className)} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function Checkbox({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <span className="relative inline-grid h-5 w-5 shrink-0 place-items-center">
      <input
        type="checkbox"
        className={cn(
          "peer h-5 w-5 cursor-pointer appearance-none rounded-[7px] border border-line bg-tint",
          "checked:border-transparent checked:bg-gradient-to-br checked:from-dawn-500 checked:to-dawn-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <svg
        viewBox="0 0 20 20"
        aria-hidden
        className="pointer-events-none absolute h-3 w-3 text-on-accent opacity-0 peer-checked:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m4 10.5 4 4 8-9" />
      </svg>
    </span>
  );
}

export function Radio({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <span className="relative inline-grid h-5 w-5 shrink-0 place-items-center">
      <input
        type="radio"
        className={cn(
          "peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-line bg-tint",
          "checked:border-transparent checked:bg-gradient-to-br checked:from-dawn-500 checked:to-dawn-400",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-on-accent opacity-0 peer-checked:opacity-100" />
    </span>
  );
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "border-transparent bg-gradient-to-r from-dawn-500 to-dawn-400"
          : "border-line bg-tint-2",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-[inset-inline-start] duration-300 ease-[var(--ease-out-expo)]",
          checked ? "start-[1.4rem]" : "start-0.5",
        )}
      />
    </button>
  );
}
