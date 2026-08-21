import { venmoHandle } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Registry() {
  return (
    <Section
      id="registry"
      title="Registry"
      intro="We don't have a wedding registry. Celebrating with our family and closest friends is a gift in itself. If you'd like to give a gift, you can contribute to our honeymoon fund."
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
