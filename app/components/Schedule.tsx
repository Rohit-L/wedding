import { events, type WeddingEvent } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

/** Group events by day, preserving their order in the data file. */
function groupByDay(list: WeddingEvent[]) {
  const groups: { heading: string; sub: string; items: WeddingEvent[] }[] = [];
  for (const event of list) {
    const last = groups[groups.length - 1];
    if (last && last.heading === event.day && last.sub === event.date) {
      last.items.push(event);
    } else {
      groups.push({ heading: event.day, sub: event.date, items: [event] });
    }
  }
  return groups;
}

export function Schedule() {
  const groups = groupByDay(events);

  return (
    <Section
      id="schedule"
      eyebrow="The Schedule"
      title="Two days of celebration"
      intro="Here's what we have planned. Times and details to come — check back closer to the date."
      className="bg-surface"
    >
      <div className="space-y-16">
        {groups.map((group) => (
          <FadeIn key={`${group.heading}-${group.sub}`}>
            <div>
              <h3 className="font-display text-2xl">
                {group.heading}
                <span className="ml-2 text-base text-muted">· {group.sub}</span>
              </h3>
              {/* Venue and attire are uniform within a day, shown once. */}
              <p className="mt-2 text-muted">{group.items[0].venue}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
                Attire · {group.items[0].dressCode}
              </p>

              <ol className="mt-8 space-y-8 border-l border-hairline pl-8">
                {group.items.map((event) => (
                  <li key={event.id} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-surface"
                    />
                    <h4 className="font-display text-xl">{event.name}</h4>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
