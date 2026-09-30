"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, Lock, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { NotificationBell } from "@/components/portal/notifications";
import { Avatar, PlaneMark, ThemeToggle, cn } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { portal } from "@/lib/portal";

export type NavItem = {
  href: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
  badge?: ComponentType;
};

export function AppShell({
  nav,
  title,
  description,
  actions,
  children,
  locked,
}: {
  nav: NavItem[];
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  locked?: string;
}) {
  const { t, locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href={portal.home}
        className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-tint"
      >
        <PlaneMark className="h-8 w-8 shrink-0" />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-extrabold tracking-tight text-fg">
            {t("app.name")}
          </span>
          <span className="block truncate text-[11px] font-bold tracking-[0.12em] text-accent-cool uppercase">
            {t(portal.roleKey)}
          </span>
        </span>
      </Link>

      <nav className="nav-scroll -mx-1 flex flex-1 flex-col gap-1 overflow-y-auto px-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          const shut = !!locked && item.href !== locked;
          if (shut) {
            return (
              <span
                key={item.href}
                aria-disabled
                className="group flex cursor-not-allowed items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-[13.5px] font-semibold text-fg-faint opacity-60"
              >
                <item.icon className="h-4 w-4 shrink-0 text-fg-faint" />
                <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
                <Lock className="h-3.5 w-3.5 shrink-0 text-fg-faint" />
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-300",
                active
                  ? "border border-line bg-tint-2 text-fg"
                  : "border border-transparent text-fg-subtle hover:bg-tint hover:text-fg",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gradient-to-b from-dawn-400 to-dawn-500"
                />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-accent" : "text-fg-faint group-hover:text-fg-muted",
                )}
              />
              <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
              {item.badge && <item.badge />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <span className="text-[11px] font-bold tracking-[0.12em] text-fg-faint uppercase">
            {t("common.language")}
          </span>
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-semibold text-fg-subtle transition-colors hover:bg-tint hover:text-fg"
        >
          <Languages className="h-4 w-4 shrink-0 text-fg-faint" />
          <span>{locale === "en" ? "العربية" : "English"}</span>
        </button>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-semibold text-fg-subtle transition-colors hover:bg-tint hover:text-fg"
        >
          <LogOut className="h-4 w-4 shrink-0 text-fg-faint" />
          <span>{t("nav.signout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div data-portal className="relative flex min-h-screen">
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 rounded-none border-y-0 border-s-0 lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label={t("nav.close")}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          />
          <div className="glass absolute inset-y-0 start-0 w-72 rounded-none border-y-0 border-s-0">
            <button
              type="button"
              aria-label={t("nav.close")}
              onClick={() => setOpen(false)}
              className="absolute top-4 end-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-tint text-fg-muted transition-colors hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              type="button"
              aria-label={t("nav.menu")}
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-tint text-fg-muted transition-colors hover:text-fg lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[17px] font-extrabold tracking-tight text-fg sm:text-xl">
                {title}
              </h1>
              {description && (
                <p className="truncate text-[12.5px] text-fg-muted">{description}</p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <NotificationBell />
              <Avatar initials={user?.initials ?? ""} accent={portal.accent} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
