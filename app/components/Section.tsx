import type { ReactNode } from "react";
import { FadeIn } from "./FadeIn";

/**
 * Standard section shell: an optional uppercase eyebrow, a Fraunces title, a
 * short accent hairline, an optional intro, then the section body. The header
 * is centered and revealed on scroll.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-6 py-24 sm:py-28 md:py-36 ${className}`}
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn className="text-center">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className={`font-display text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] ${eyebrow ? "mt-4" : ""}`}>
            {title}
          </h2>
          <div className="hairline mt-6" />
          {intro && (
            <p className="mx-auto mt-6 max-w-[60ch] text-muted">{intro}</p>
          )}
        </FadeIn>
        <div className="mt-14 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
