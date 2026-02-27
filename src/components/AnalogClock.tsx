"use client";

import { getTimePartsInTimezone } from "@/lib/utils";

interface AnalogClockProps {
  date: Date;
  timezone: string;
  size?: number;
  className?: string;
}

export default function AnalogClock({
  date,
  timezone,
  size = 80,
  className = "",
}: AnalogClockProps) {
  const { hours, minutes, seconds } = getTimePartsInTimezone(date, timezone);

  // Clock hand rotations (0 = 12 o'clock, clockwise)
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60 + seconds / 3600) * 360;
  const hourDeg = ((hours % 12) / 12 + minutes / 720 + seconds / 43200) * 360;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  // Round to avoid hydration mismatch from floating point differences across environments
  const round = (n: number) => Math.round(n * 1e6) / 1e6;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`shrink-0 ${className}`}
    >
      {/* Clock face circle */}
      <circle
        cx={round(cx)}
        cy={round(cy)}
        r={round(r)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-spring-border"
      />
      {/* Hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const innerR = r - 6;
        const outerR = r;
        const x1 = round(cx + innerR * Math.cos(angle));
        const y1 = round(cy + innerR * Math.sin(angle));
        const x2 = round(cx + outerR * Math.cos(angle));
        const y2 = round(cy + outerR * Math.sin(angle));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 2 : 1}
            className="text-spring-soft"
          />
        );
      })}
      {/* Hour hand */}
      <line
        x1={round(cx)}
        y1={round(cy)}
        x2={round(cx + (r * 0.4) * Math.cos((hourDeg - 90) * (Math.PI / 180)))}
        y2={round(cy + (r * 0.4) * Math.sin((hourDeg - 90) * (Math.PI / 180)))}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="text-spring-text"
      />
      {/* Minute hand */}
      <line
        x1={round(cx)}
        y1={round(cy)}
        x2={round(cx + (r * 0.6) * Math.cos((minuteDeg - 90) * (Math.PI / 180)))}
        y2={round(cy + (r * 0.6) * Math.sin((minuteDeg - 90) * (Math.PI / 180)))}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="text-spring-text"
      />
      {/* Second hand */}
      <line
        x1={round(cx)}
        y1={round(cy)}
        x2={round(cx + (r * 0.7) * Math.cos((secondDeg - 90) * (Math.PI / 180)))}
        y2={round(cy + (r * 0.7) * Math.sin((secondDeg - 90) * (Math.PI / 180)))}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        className="text-spring-sage-600"
      />
      {/* Center dot */}
      <circle cx={round(cx)} cy={round(cy)} r={2} fill="currentColor" className="text-spring-sage-600" />
    </svg>
  );
}
