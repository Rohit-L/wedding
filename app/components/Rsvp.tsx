import { RsvpForm } from "./RsvpForm";
import { Section } from "./Section";

export function Rsvp() {
  return (
    <Section
      id="rsvp"
      eyebrow="RSVP"
      title="Will you celebrate with us?"
      intro="We'd be honored to have you there. Enter the email your invitation was sent to, and we'll pull up your party so you can respond for each guest."
      className="bg-surface"
    >
      <RsvpForm />
    </Section>
  );
}
