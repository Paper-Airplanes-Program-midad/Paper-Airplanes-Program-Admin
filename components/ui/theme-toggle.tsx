"use client";

import { useEffect, useState } from "react";
import { THEME_EVENT, THEME_KEY, type Theme } from "./theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
  }

  window.dispatchEvent(new Event(THEME_EVENT));
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const update = () => setTheme(readTheme());
    update();

    window.addEventListener("storage", update);
    window.addEventListener(THEME_EVENT, update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(THEME_EVENT, update);
    };
  }, []);

  return theme;
}

const OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2.2v1.6M10 16.2v1.6M17.8 10h-1.6M3.8 10H2.2M15.5 4.5l-1.1 1.1M5.6 14.4l-1.1 1.1M15.5 15.5l-1.1-1.1M5.6 5.6 4.5 4.5" />
      </>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <>
        <rect x="2.6" y="3.6" width="14.8" height="10" rx="1.6" />
        <path d="M7 17h6M10 13.6V17" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M16.2 11.6A6.8 6.8 0 0 1 7.6 3.2a7 7 0 1 0 8.6 8.4Z" />,
  },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`flex items-center gap-0.5 rounded-full border border-line bg-tint p-0.5 ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            onClick={() => apply(option.value)}
            className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 ${
              active ? "text-on-accent" : "text-fg-subtle hover:text-fg"
            }`}
          >
            {active && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-dawn-400 to-dawn-300" />
            )}
            <svg
              viewBox="0 0 20 20"
              className="relative h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
