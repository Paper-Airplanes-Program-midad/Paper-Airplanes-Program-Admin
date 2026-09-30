"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check } from "./marks";

type Tone = "success" | "info";
type Toast = { id: number; message: string; tone: Tone };

type ToastValue = {
  success: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastValue | null>(null);

const LIFETIME = 3600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: Tone) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((list) => list.filter((t) => t.id !== id)),
      LIFETIME,
    );
  }, []);

  const value = useMemo<ToastValue>(
    () => ({
      success: (message) => push(message, "success"),
      info: (message) => push(message, "info"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-100 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in glass pointer-events-auto flex max-w-md items-center gap-2.5 rounded-full py-2.5 ps-3 pe-5 text-[13px] font-semibold text-fg"
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
              style={{
                background:
                  t.tone === "success"
                    ? "color-mix(in oklab, var(--accent-mint) 22%, transparent)"
                    : "color-mix(in oklab, var(--accent-cool) 22%, transparent)",
                color: t.tone === "success" ? "var(--accent-mint)" : "var(--accent-cool)",
              }}
            >
              <Check className="h-3 w-3" />
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
