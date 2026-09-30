
export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function formatInTz(
  iso: string,
  timeZone: string,
  locale: string,
  opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    timeZone,
    ...opts,
  }).format(new Date(iso));
}

export function formatDayInTz(iso: string, timeZone: string, locale: string): string {
  return formatInTz(iso, timeZone, locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function zoneLabel(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(new Date(iso));
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}

export function relativeDays(iso: string, locale: string): string {
  const diff = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", {
    numeric: "auto",
  });
  return rtf.format(diff, "day");
}

export const timezoneOptions = [
  "Asia/Damascus",
  "Asia/Gaza",
  "Asia/Beirut",
  "Asia/Amman",
  "Asia/Baghdad",
  "Africa/Cairo",
  "Africa/Khartoum",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "UTC",
];
