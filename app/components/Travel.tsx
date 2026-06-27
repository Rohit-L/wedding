import { hotels, wedding } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Travel() {
  const mapsQuery = encodeURIComponent(
    `${wedding.venueName}, ${wedding.city}`,
  );

  return (
    <Section
      id="travel"
      eyebrow="Travel & Stay"
      title="Getting there"
      intro="Sonoma is about an hour north of San Francisco. Here's where to stay and how to find us."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {hotels.map((hotel, i) => (
          <FadeIn key={hotel.name} delay={i * 80}>
            <div className="flex h-full flex-col rounded-sm border border-hairline bg-surface p-8">
              <p className="eyebrow text-accent">{hotel.distance}</p>
              <h3 className="mt-3 font-display text-2xl">{hotel.name}</h3>
              <p className="mt-3 flex-1 text-muted">{hotel.description}</p>
              <p className="mt-5 text-sm text-muted">{hotel.bookingNote}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-10">
        <div className="rounded-sm border border-hairline p-8 text-center">
          <p className="eyebrow">The Venue</p>
          <h3 className="mt-3 font-display text-2xl">{wedding.venueName}</h3>
          <p className="mt-2 text-muted">{wedding.city}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost mt-6"
          >
            Get Directions
          </a>
        </div>
      </FadeIn>
    </Section>
  );
}
