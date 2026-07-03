import type { Route } from "./+types/home";

import { Faq } from "~/components/Faq";
import { Footer } from "~/components/Footer";
import { Gallery } from "~/components/Gallery";
import { Hero } from "~/components/Hero";
import { Registry } from "~/components/Registry";
import { Rsvp } from "~/components/Rsvp";
import { Schedule } from "~/components/Schedule";
import { SiteNav } from "~/components/SiteNav";
import { Story } from "~/components/Story";
import { Travel } from "~/components/Travel";
import type { RsvpActionData, RsvpValues } from "~/components/RsvpForm";
import { requireUnlocked } from "~/lib/auth.server";
import { saveRsvp } from "~/lib/rsvp-store.server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function loader({ request }: Route.LoaderArgs) {
  await requireUnlocked(request);
  return null;
}

export async function action({
  request,
}: Route.ActionArgs): Promise<RsvpActionData> {
  await requireUnlocked(request);

  const form = await request.formData();
  const values: RsvpValues = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    attending: String(form.get("attending") ?? ""),
    guests: String(form.get("guests") ?? ""),
    meal: String(form.get("meal") ?? ""),
    dietary: String(form.get("dietary") ?? "").trim(),
    song: String(form.get("song") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };

  const errors: Partial<Record<keyof RsvpValues, string>> = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!values.email) {
    errors.email = "Please add an email so we can confirm.";
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = "That email doesn't look quite right.";
  }
  if (values.attending !== "yes" && values.attending !== "no") {
    errors.attending = "Please let us know if you can make it.";
  }
  if (values.attending === "yes" && !values.meal) {
    errors.meal = "Please choose a meal so we can plan the menu.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }

  // Upsert into the Google Sheet (keyed by email). See rsvp-store.server.ts
  // and the README for the required environment variables.
  const result = await saveRsvp(values);
  if (result.status === "error") {
    return {
      ok: false,
      errors: {},
      formError:
        "Sorry — we couldn't save your RSVP just now. Please try again in a moment.",
      values,
    };
  }

  return { ok: true, name: values.name, attending: values.attending };
}

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Story />
        <Gallery />
        <Schedule />
        <Travel />
        <Rsvp />
        <Registry />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
