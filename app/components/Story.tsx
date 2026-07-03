import { story } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Story() {
  return (
    <Section
      id="story"
      eyebrow="Our Story"
      title="How we got here"
      intro="A few of the moments, big and small, that led us to this one."
    >
      <div className="space-y-20 md:space-y-28">
        {story.map((moment, i) => (
          <FadeIn key={moment.year}>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              {/* Framed placeholder. Swap for a real photo. */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="mx-auto flex aspect-[4/5] w-full max-w-xs items-center justify-center border border-hairline bg-surface md:max-w-sm">
                  <span className="font-display text-2xl italic text-muted">
                    {moment.year}
                  </span>
                </div>
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="eyebrow text-accent">{moment.year}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight">
                  {moment.title}
                </h3>
                <p className="mt-4 max-w-[46ch] text-muted">
                  {moment.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
