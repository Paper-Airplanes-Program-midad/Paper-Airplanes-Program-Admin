"use client";

import { createContext, useContext, type ReactNode } from "react";

import { PlaneMark } from "@/components/ui";
import { useStoredValue, writeStored } from "@/lib/client";
import arCommon from "@/messages/ar/common.json";
import arCourse from "@/messages/ar/course.json";
import arDiagnostic from "@/messages/ar/diagnostic.json";
import enCommon from "@/messages/en/common.json";
import enCourse from "@/messages/en/course.json";
import enDiagnostic from "@/messages/en/diagnostic.json";

export type Locale = "en" | "ar";

export type L = { en: string; ar: string };

export const LOCALE_KEY = "pa-locale";
export const LOCALE_EVENT = "pa-localechange";

export const localeScript = `(function(){try{var l=localStorage.getItem("${LOCALE_KEY}");if(l==="ar"){document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","ar")}}catch(e){}})()`;

type Messages = { [key: string]: string | Messages };

const MESSAGES: Record<Locale, Messages> = {
  en: { ...enCommon, course: enCourse, diagnostic: enDiagnostic },
  ar: { ...arCommon, course: arCourse, diagnostic: arDiagnostic },
};

function lookup(messages: Messages, key: string): string | undefined {
  let node: string | Messages | undefined = messages;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
  tv: (value: L) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const stored = useStoredValue(LOCALE_KEY, LOCALE_EVENT);

  if (stored === undefined) {
    return (
      <div className="grid min-h-screen place-items-center">
        <PlaneMark className="h-10 w-10 animate-float" />
      </div>
    );
  }

  const locale: Locale = stored === "ar" ? "ar" : "en";

  const setLocale = (next: Locale) => {
    writeStored(LOCALE_KEY, next, LOCALE_EVENT);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", next);
  };

  const value: I18nValue = {
    locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    setLocale,
    toggleLocale: () => setLocale(locale === "en" ? "ar" : "en"),
    t: (key) => lookup(MESSAGES[locale], key) ?? key,
    tv: (text) => text[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
