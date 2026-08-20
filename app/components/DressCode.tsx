import { attireInspiration, events } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

/** Dress codes in the order they first appear on the Schedule. */
function uniqueDressCodes(list: typeof events) {
  const codes: string[] = [];
  for (const event of list) {
    if (!codes.includes(event.dressCode)) codes.push(event.dressCode);
  }
  return codes;
}

export function DressCode() {
  const codes = uniqueDressCodes(events);

  return (
    <Section
      id="dress-code"
      title="Dress Code"
      intro="A few looks for inspiration"
    >
      <div className="grid gap-14 md:grid-cols-2 md:gap-10">
        {codes.map((code) => {
          const images = attireInspiration[code];
          return (
            <FadeIn key={code}>
              <div className="text-center">
                <h3 className="font-display text-2xl">{code}</h3>
                {images && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {images.map((img) => (
                      <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        className="aspect-[2/3] w-full rounded-sm object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
