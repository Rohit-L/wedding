import { RsvpForm } from "./RsvpForm";
import { Section } from "./Section";

export function Rsvp() {
  return (
    <Section
      id="rsvp"
      eyebrow="RSVP"
      title="Will you celebrate with us?"
      intro="We'd be honored to have you there. Please let us know below."
      className="bg-surface"
    >
      <RsvpForm />
    </Section>
  );
}
