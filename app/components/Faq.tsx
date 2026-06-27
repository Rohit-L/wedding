import { faqs } from "~/data/wedding";
import { FadeIn } from "./FadeIn";
import { Section } from "./Section";

export function Faq() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Good to know"
      intro="Still have a question? Reach out to us any time — we're happy to help."
    >
      <FadeIn className="mx-auto max-w-3xl">
        <div className="border-t border-hairline">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-hairline py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <span className="font-medium">{faq.question}</span>
                <span
                  aria-hidden
                  className="text-2xl font-light leading-none text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[65ch] text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
