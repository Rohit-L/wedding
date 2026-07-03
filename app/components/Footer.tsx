import { couple, wedding } from "~/data/wedding";

export function Footer() {
  const monogram = `${couple.partnerOne[0]} & ${couple.partnerTwo[0]}`;

  return (
    <footer className="border-t border-hairline px-6 py-16 text-center">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-3xl" aria-hidden>
          {monogram}
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.22em] text-muted">
          {wedding.dateShort} &nbsp;·&nbsp; {wedding.city}
        </p>
        <p className="mt-3 font-display text-lg italic text-accent">
          {couple.hashtag}
        </p>
        <p className="mt-8 text-xs text-muted">With love, {couple.combined}</p>
      </div>
    </footer>
  );
}
