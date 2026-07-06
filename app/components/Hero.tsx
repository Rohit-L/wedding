import { couple, heroImage, wedding } from "~/data/wedding";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section
      id="top"
      className="relative z-0 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center text-white"
      style={{ textShadow: "0 2px 20px rgb(0 0 0 / 35%)" }}
    >
      {/* Full-bleed photo. The gradient is a second background layer, so it
          shows through as an elegant placeholder until heroImage is set. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `${heroImage ? `url(${JSON.stringify(heroImage)}), ` : ""}linear-gradient(160deg, #6b6558, #33312b)`,
        }}
      />
      {/* Darkening scrim so light text stays legible over any photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />

      <h1 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.01em]">
        {couple.partnerOne} <span className="italic">&amp;</span>{" "}
        {couple.partnerTwo}
      </h1>

      <div className="mt-8 h-12 w-px bg-white/50" aria-hidden />

      <p className="mt-8 text-sm uppercase tracking-[0.22em] text-white/90">
        {wedding.dateLong}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/90">
        {wedding.city}
      </p>

      <div className="mt-12">
        <Countdown />
      </div>

      <a
        href="#schedule"
        aria-label="Scroll to see the schedule"
        className="absolute bottom-8 text-xs uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white"
      >
        Scroll
      </a>
    </section>
  );
}
