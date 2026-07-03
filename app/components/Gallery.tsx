import { engagementPhotos } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Gallery() {
  return (
    <Section
      id="gallery"
      eyebrow="In Love"
      title="A few of our favorites"
      intro="A small window into the years that brought us here — more to come from the day itself."
      className="bg-surface"
    >
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {engagementPhotos.map((photo, i) => (
          <FadeIn key={photo.id} delay={i * 60}>
            <figure className="group relative aspect-[4/5] overflow-hidden border border-hairline bg-page">
              {photo.src ? (
                <>
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-page/90 px-3 py-2 text-center text-xs uppercase tracking-[0.14em] text-ink opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {photo.caption}
                  </figcaption>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center">
                  <span className="font-display text-sm italic text-muted">
                    {photo.caption}
                  </span>
                </div>
              )}
            </figure>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
