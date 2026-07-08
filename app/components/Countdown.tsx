import { useEffect, useState } from "react";
import { wedding } from "~/data/wedding";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(target: number): Remaining {
  let ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86_400_000);
  ms -= days * 86_400_000;
  const hours = Math.floor(ms / 3_600_000);
  ms -= hours * 3_600_000;
  const minutes = Math.floor(ms / 60_000);
  ms -= minutes * 60_000;
  const seconds = Math.floor(ms / 1_000);
  return { days, hours, minutes, seconds };
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

/**
 * Boxless live countdown to the wedding date. Renders neutral placeholders on
 * the server / first paint, then ticks once mounted (avoids hydration drift).
 */
export function Countdown() {
  const target = new Date(wedding.dateISO).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(target));
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const isPast =
    remaining !== null &&
    remaining.days === 0 &&
    remaining.hours === 0 &&
    remaining.minutes === 0 &&
    remaining.seconds === 0;

  if (isPast) {
    return (
      <p className="font-display text-2xl italic text-white">
        Just married — thank you for celebrating with us.
      </p>
    );
  }

  const format = (key: keyof Remaining) => {
    if (remaining === null) return "—";
    const value = remaining[key];
    return key === "days" ? String(value) : String(value).padStart(2, "0");
  };

  return (
    <div
      className="flex items-stretch justify-center font-sans"
      role="timer"
      aria-label="Countdown to the wedding"
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex">
          {i > 0 && <div className="w-px self-stretch bg-white/30" aria-hidden />}
          <div className="px-4 text-center sm:px-7">
            <div className="text-3xl tabular-nums sm:text-4xl">
              {format(unit.key)}
            </div>
            <div className="mt-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
