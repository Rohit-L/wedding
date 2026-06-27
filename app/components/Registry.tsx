import { registry } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Registry() {
  return (
    <Section
      id="registry"
      eyebrow="Registry"
      title="Your presence is the present"
      intro="Truly — celebrating with you is more than enough. But if you'd like to give a gift, here are a few ways."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {registry.map((item, i) => (
          <FadeIn key={item.name} delay={i * 80}>
            <a
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={item.url.startsWith("http") ? "noreferrer" : undefined}
              className="group flex h-full flex-col rounded-sm border border-hairline p-8 transition-colors hover:bg-accent-soft"
            >
              <h3 className="font-display text-xl">{item.name}</h3>
              <p className="mt-3 flex-1 text-sm text-muted">
                {item.description}
              </p>
              <span className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-accent">
                View
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
