import type { City } from "@/data/cities";

export function formatTime(date: Date, timezone: string): string {
  return date.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date, timezone: string): string {
  return date.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatUTC(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function getTimePartsInTimezone(
  date: Date,
  timezone: string
): { hours: number; minutes: number; seconds: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

  return {
    hours: get("hour"),
    minutes: get("minute"),
    seconds: get("second"),
  };
}

export function getUTCOffset(timezone: string): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  }).formatToParts(now);

  const offsetPart = parts.find((p) => p.type === "timeZoneName");
  return offsetPart ? offsetPart.value : "";
}

export function cityLabel(city: City): string {
  if (city.state && city.state !== city.name) {
    return `${city.name}, ${city.state}, ${city.country}`;
  }
  return `${city.name}, ${city.country}`;
}

export function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export function highlightMatch(text: string, query: string): string {
  const tokens = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
  let result = text;
  tokens.forEach((token) => {
    const regex = new RegExp(
      `(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    result = result.replace(regex, "<mark>$1</mark>");
  });
  return result;
}
