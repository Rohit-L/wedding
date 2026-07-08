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
      title="The Schedule"
      intro="Times and details to come"
      className="bg-surface"
    >
      <div className="grid gap-14 md:grid-cols-2 md:gap-10">
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
                  <li key={event.id}>
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
