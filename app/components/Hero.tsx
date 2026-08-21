import { couple, heroImage, wedding } from "~/data/wedding";

export function Hero() {
  return (
    <section
      id="top"
      className="relative z-0 flex min-h-screen flex-col items-center overflow-hidden px-6 pb-20 pt-28 text-center text-white"
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

      {/* Names and date sit together in the remaining space between the top
          padding and the scroll cue, so they land in the true vertical
          middle as one group. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <h1 className="font-heroNames whitespace-nowrap text-center text-[clamp(2.5rem,20vw,18rem)] font-normal leading-[1.2] tracking-[-0.02em]">
          {couple.partnerOne} &amp; {couple.partnerTwo}
        </h1>

        <p className="text-sm uppercase tracking-[0.22em] text-white/90">
          {wedding.dateLong} | {wedding.city}
        </p>
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
