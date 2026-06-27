import { couple, wedding } from "~/data/wedding";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center"
    >
      {/* Soft warm glow, purely decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(88,96,73,0.06),transparent_70%)]"
      />

      <p className="eyebrow">Together with their families</p>

      <h1 className="mt-8 font-display text-[clamp(3.5rem,9vw,7.5rem)] font-light leading-[0.95] tracking-[-0.01em]">
        {couple.partnerOne}{" "}
        <span className="italic text-accent">&amp;</span>{" "}
        {couple.partnerTwo}
      </h1>

      <div className="mt-8 h-14 w-px bg-accent" aria-hidden />

      <p className="mt-8 text-sm uppercase tracking-[0.22em] text-muted">
        {wedding.dateLong}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted">
        {wedding.city}
      </p>

      <div className="mt-12">
        <Countdown />
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <a href="#rsvp" className="btn btn-primary">
          RSVP
        </a>
        <a href="#schedule" className="btn btn-ghost">
          View Schedule
        </a>
      </div>

      <a
        href="#story"
        aria-label="Scroll to read our story"
        className="absolute bottom-8 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
      >
        Scroll
      </a>
    </section>
  );
}
