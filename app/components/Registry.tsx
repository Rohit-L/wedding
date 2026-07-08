import { venmoHandle } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Registry() {
  return (
    <Section
      id="registry"
      eyebrow="Registry"
      title="Your presence is the present"
      intro="Truly — celebrating with you is more than enough. But if you'd like to give a gift, we're keeping it simple."
    >
      <FadeIn className="mx-auto max-w-md">
        <div className="rounded-sm border border-hairline p-10 text-center">
          <h3 className="font-display text-2xl">Venmo</h3>
          <p className="mt-3 text-muted">@{venmoHandle}</p>
          <a
            href={`https://venmo.com/u/${venmoHandle}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost mt-6"
          >
            Open Venmo
          </a>
        </div>
      </FadeIn>
    </Section>
  );
}
