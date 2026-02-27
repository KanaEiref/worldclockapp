"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CITIES } from "@/data/cities";
import type { City } from "@/data/cities";
import {
  formatTime,
  formatDate,
  formatUTC,
  getUTCOffset,
  cityLabel,
  getLocalTimezone,
  highlightMatch,
} from "@/lib/utils";
import AnalogClock from "./AnalogClock";

const MAX_CITIES = 10;
const STORAGE_KEY = "worldclock-cities";

// Important cities to show when search is focused (before typing)
const SUGGESTED_CITIES: City[] = [
  { name: "Nanjing", state: "Jiangsu", country: "China", timezone: "Asia/Shanghai" },
  { name: "Beijing", state: "Beijing", country: "China", timezone: "Asia/Shanghai" },
  { name: "Shanghai", state: "Shanghai", country: "China", timezone: "Asia/Shanghai" },
  { name: "Tokyo", state: "", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "London", state: "", country: "UK", timezone: "Europe/London" },
  { name: "New York", state: "", country: "USA", timezone: "America/New_York" },
];

function detectLocalCity(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = CITIES.find((c) => c.timezone === tz);
    if (match) return cityLabel(match);
    const parts = tz.split("/");
    return parts[parts.length - 1].replace(/_/g, " ");
  } catch {
    return "Your Location";
  }
}

function filterCities(
  query: string,
  selectedCities: City[]
): City[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const tokens = q.split(/[\s,]+/).filter(Boolean);
  const available = CITIES.filter(
    (c) =>
      !selectedCities.some(
        (s) => s.timezone === c.timezone && s.name === c.name
      )
  );

  return available
    .map((c) => {
      const fields = [c.name, c.state, c.country].map((f) => f.toLowerCase());
      const allTokensMatch = tokens.every((t) =>
        fields.some((f) => f.includes(t))
      );
      if (!allTokensMatch) return null;

      let score = 0;
      if (c.name.toLowerCase().startsWith(q)) score += 100;
      else if (c.name.toLowerCase().includes(q)) score += 50;
      if (c.state.toLowerCase().startsWith(q)) score += 30;
      if (c.country.toLowerCase().startsWith(q)) score += 20;
      tokens.forEach((t) => {
        if (c.name.toLowerCase().startsWith(t)) score += 10;
      });
      // Boost suggested/important cities so they appear first when they match
      if (SUGGESTED_CITIES.some((s) => s.name === c.name && s.timezone === c.timezone)) score += 200;

      return { city: c, score };
    })
    .filter((r): r is { city: City; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.city);
}

// Fixed date + UTC for SSR/hydration - ensures server and client render identical output
const PLACEHOLDER_DATE = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));

export default function WorldClock() {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [time, setTime] = useState<Date>(PLACEHOLDER_DATE);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localCity, setLocalCity] = useState("Your Location");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const localTz = getLocalTimezone();

  useEffect(() => {
    setMounted(true);
    setLocalCity(detectLocalCity());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedCities(parsed.slice(0, MAX_CITIES));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCities));
  }, [selectedCities]);

  useEffect(() => {
    if (!mounted) return;
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, [mounted]);

  const addCity = useCallback((city: City) => {
    setSelectedCities((prev) => {
      if (prev.length >= MAX_CITIES) return prev;
      if (prev.some((c) => c.timezone === city.timezone && c.name === city.name))
        return prev;
      return [...prev, city];
    });
    setSearchQuery("");
    setDropdownOpen(false);
  }, []);

  const removeCity = useCallback((timezone: string, name: string) => {
    setSelectedCities((prev) =>
      prev.filter((c) => !(c.timezone === timezone && c.name === name))
    );
  }, []);

  const searchResults = filterCities(searchQuery, selectedCities);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10 md:px-6 md:py-14">
      <div className="w-full max-w-[780px]">
        <header className="mb-9 text-center">
          <h1 className="bg-gradient-to-r from-spring-sage-600 to-spring-blossom-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            World Clock
          </h1>
          <p className="mt-1 text-sm text-spring-muted">
            Track time across the globe
          </p>
        </header>

        <section className="mb-9">
          <div className="rounded-2xl border border-spring-border/30 bg-gradient-to-br from-spring-sage-600/20 to-spring-sage-700/10 px-6 py-6 shadow-spring">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-spring-sage-600">&#9678;</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-spring-sage-600">
                {localCity}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <AnalogClock
                date={time}
                timezone={mounted ? localTz : "UTC"}
                size={100}
              />
              <div>
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-mono text-3xl font-medium text-spring-text md:text-4xl">
                    {formatTime(time, mounted ? localTz : "UTC")}
                  </span>
                  <span className="text-sm text-spring-soft">
                    {formatDate(time, mounted ? localTz : "UTC")}
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs text-spring-muted">
                  UTC: {formatUTC(time)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-spring-text">
              World Clocks{" "}
              <span className="text-xs font-normal text-spring-muted">
                (Max 10 cities)
              </span>
            </h2>
            <span className="text-sm font-medium text-spring-muted">
              {selectedCities.length} / {MAX_CITIES}
            </span>
          </div>

          <div ref={searchRef} className="relative mb-5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
              &#128269;
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDropdownOpen(e.target.value.trim().length > 0);
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder={
                selectedCities.length >= MAX_CITIES
                  ? "Maximum 10 cities reached"
                  : "Search for a city..."
              }
              disabled={selectedCities.length >= MAX_CITIES}
              className="w-full rounded-lg border border-spring-border bg-spring-input py-3 pl-10 pr-4 text-spring-text placeholder:text-spring-muted focus:border-spring-sage-500 focus:outline-none focus:ring-2 focus:ring-spring-sage-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              autoComplete="off"
            />

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-spring-border bg-spring-card shadow-spring-lg"
              >
                {searchQuery.trim().length === 0 ? (
                  <>
                    <div className="border-b border-spring-border px-3 py-2 text-xs font-medium text-spring-muted">
                      Popular cities
                    </div>
                    {SUGGESTED_CITIES.filter(
                      (c) =>
                        !selectedCities.some(
                          (s) =>
                            s.timezone === c.timezone && s.name === c.name
                        )
                    ).map((city) => (
                      <button
                        key={`${city.name}-${city.timezone}`}
                        type="button"
                        onClick={() => addCity(city)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-spring-hover"
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {cityLabel(city)}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-spring-muted">
                          {getUTCOffset(city.timezone)}
                        </span>
                      </button>
                    ))}
                  </>
                ) : searchResults.length === 0 ? (
                  <div className="flex justify-center py-4 text-sm text-spring-muted">
                    No cities found
                  </div>
                ) : (
                  searchResults.slice(0, 30).map((city) => (
                    <button
                      key={`${city.name}-${city.timezone}`}
                      type="button"
                      onClick={() => addCity(city)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-spring-hover"
                    >
                      <span
                        className="min-w-0 flex-1 truncate [&_mark]:rounded [&_mark]:bg-spring-sage-500/25 [&_mark]:px-0.5 [&_mark]:text-spring-sage-600"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(cityLabel(city), searchQuery),
                        }}
                      />
                      <span className="shrink-0 font-mono text-xs text-spring-muted">
                        {getUTCOffset(city.timezone)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {selectedCities.length === 0 ? (
              <div className="py-12 text-center text-sm text-spring-muted">
                No cities added yet. Search above to add up to 10 cities.
              </div>
            ) : (
              selectedCities.map((city) => (
                <div
                  key={`${city.name}-${city.timezone}`}
                  className="flex animate-slide-in items-center justify-between gap-4 rounded-2xl border border-spring-border/30 bg-spring-card px-5 py-5 shadow-spring"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-spring-text">
                        {cityLabel(city)}
                      </span>
                      <span className="font-mono text-xs text-spring-muted">
                        {getUTCOffset(city.timezone)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <AnalogClock date={time} timezone={city.timezone} size={72} />
                    <div className="text-right">
                      <div className="font-mono text-xl font-medium text-spring-text md:text-2xl">
                        {formatTime(time, city.timezone)}
                      </div>
                      <div className="text-xs text-spring-soft">
                        {formatDate(time, city.timezone)}
                      </div>
                      <div className="font-mono text-xs text-spring-muted">
                        UTC: {formatUTC(time)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCity(city.timezone, city.name)}
                      title={`Remove ${city.name}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl text-spring-muted transition-colors hover:bg-spring-danger/10 hover:text-spring-danger"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="mt-auto pt-10 pb-6 text-center text-xs text-spring-muted">
          © 2026 controlled chaos design studio
        </footer>
      </div>
    </div>
  );
}
