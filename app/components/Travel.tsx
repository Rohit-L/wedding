import { venues } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Travel() {
  return (
    <Section
      id="travel"
      title="Travel & Stay"
      intro="We recommend taking the train from Milan to Lake Como. We are also working on securing a hotel room block."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {venues.map((venue, i) => (
          <FadeIn key={venue.name} delay={i * 80}>
            <div className="flex h-full flex-col items-center rounded-sm border border-hairline p-8 text-center">
              <p className="eyebrow">{venue.day}</p>
              <h3 className="mt-3 font-display text-2xl">{venue.name}</h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost mt-6"
              >
                Get Directions
              </a>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
