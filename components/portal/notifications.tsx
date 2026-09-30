"use client";

import Link from "next/link";
import {
  Bell,
  CalendarClock,
  ClipboardCheck,
  Star,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import { cn } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { useNotifications, type NotificationKind } from "@/lib/notifications";
import { relativeDays } from "@/lib/time";

const ICON: Record<NotificationKind, ComponentType<{ className?: string }>> = {
  homework: ClipboardCheck,
  grade: Star,
  lesson: CalendarClock,
  incident: TriangleAlert,
  person: UserPlus,
};

export function NotificationBell() {
  const { t, locale } = useI18n();
  const { items, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);

  const unread = items.filter((item) => !item.read).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("notif.title")}
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (!next) return;
          setFresh(items.filter((item) => !item.read).map((item) => item.id));
          void markAllRead();
        }}
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-tint text-fg-muted transition-colors hover:text-fg"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute -top-1 -end-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gradient-to-r from-dawn-500 to-dawn-400 px-1 text-[10px] font-extrabold tabular-nums text-on-accent"
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={t("nav.close")}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="glass absolute end-0 top-11 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl">
            <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="text-[13.5px] font-extrabold text-fg">
                {t("notif.title")}
              </span>
              <span className="text-[11.5px] text-fg-subtle">{items.length}</span>
            </header>

            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px] text-fg-subtle">
                {t("notif.empty")}
              </p>
            ) : (
              <ul className="nav-scroll max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const Icon = ICON[item.kind];
                  return (
                    <li key={item.id} className="border-b border-line last:border-b-0">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex gap-3 px-4 py-3 transition-colors hover:bg-tint",
                          fresh.includes(item.id) && "bg-tint-2",
                        )}
                      >
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-tint text-fg-muted">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-bold text-fg">
                            {item.title}
                          </span>
                          <span className="block truncate text-[12px] text-fg-muted">
                            {item.body}
                          </span>
                          {item.whenUtc && (
                            <span className="block text-[11px] text-fg-subtle">
                              {relativeDays(item.whenUtc, locale)}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
