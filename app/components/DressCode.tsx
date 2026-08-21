import { attireInspiration, events } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

/**
 * Dress codes in the order they first appear on the Schedule, each labeled
 * with the day it belongs to (in appearance order) since the Schedule's own
 * "Attire ·" line shows the dress code without that day prefix.
 */
function uniqueDressCodes(list: typeof events) {
  const codes: { code: string; label: string }[] = [];
  const days: string[] = [];
  for (const event of list) {
    if (codes.some((c) => c.code === event.dressCode)) continue;
    if (!days.includes(event.day)) days.push(event.day);
    const dayNumber = days.indexOf(event.day) + 1;
    codes.push({ code: event.dressCode, label: `Day ${dayNumber} - ${event.dressCode}` });
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
      <p className="mx-auto max-w-[60ch] text-center text-sm text-muted">
        One favor to ask: please leave white and red for the couple — on both
        days.
      </p>

      <div className="mt-10 grid gap-14 md:grid-cols-2 md:gap-10">
        {codes.map(({ code, label }) => {
          const images = attireInspiration[code];
          return (
            <FadeIn key={code}>
              <div className="text-center">
                <h3 className="font-display text-2xl">{label}</h3>
                {images && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {images.map((img) => (
                      <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        className="w-full rounded-sm object-contain"
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
