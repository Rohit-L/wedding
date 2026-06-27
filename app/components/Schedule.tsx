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
      title="Three days of celebration"
      intro="Here's everything we have planned. Times and locations may shift slightly — check back closer to the date."
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

              <ol className="mt-8 space-y-10 border-l border-hairline pl-8">
                {group.items.map((event) => (
                  <li key={event.id} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-surface"
                    />
                    <p className="text-sm font-medium uppercase tracking-[0.1em] text-accent">
                      {event.time}
                    </p>
                    <h4 className="mt-1 font-display text-xl">{event.name}</h4>
                    <p className="mt-1 text-sm text-muted">
                      {event.venue} · {event.address}
                    </p>
                    <p className="mt-3 max-w-[60ch] text-muted">
                      {event.description}
                    </p>
                    <span className="mt-4 inline-block rounded-sm border border-hairline px-2.5 py-1 text-xs uppercase tracking-[0.08em] text-muted">
                      Attire · {event.dressCode}
                    </span>
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
