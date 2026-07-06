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
import type { GuestEntry, RsvpActionData } from "~/components/RsvpForm";
import { mealOptions } from "~/data/wedding";
import { requireUnlocked } from "~/lib/auth.server";
import { lookupInvite, saveInviteRsvp } from "~/lib/rsvp-store.server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
/** Sanity cap on submitted party size — real invites are far smaller. */
const MAX_GUESTS = 20;

export async function loader({ request }: Route.LoaderArgs) {
  await requireUnlocked(request);
  return null;
}

export async function action({
  request,
}: Route.ActionArgs): Promise<RsvpActionData> {
  await requireUnlocked(request);

  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");

  if (intent === "lookup") return handleLookup(form);
  if (intent === "submit") return handleSubmit(form);
  return {
    step: "lookup",
    error: "Something went wrong — please try again.",
    email: "",
  };
}

/** Step 1 — find the invitation for the entered email. */
async function handleLookup(form: FormData): Promise<RsvpActionData> {
  const email = String(form.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return {
      step: "lookup",
      error: "That email doesn't look quite right — please try again.",
      email,
    };
  }

  const result = await lookupInvite(email);
  if (result.status === "not-found") {
    return {
      step: "lookup",
      error:
        "We couldn't find an invitation for that email. Try the address your invitation was sent to, or reach out to us directly.",
      email,
    };
  }
  if (result.status === "error") {
    return {
      step: "lookup",
      error:
        "Sorry — we couldn't look that up just now. Please try again in a moment.",
      email,
    };
  }
  if (result.guests.length === 0) {
    return {
      step: "lookup",
      error:
        "We found your invitation, but no guests are listed on it yet — please reach out to us directly.",
      email,
    };
  }

  return {
    step: "form",
    email,
    totalGuests: result.totalGuests,
    guests: result.guests,
    note: result.note,
    song: result.song,
  };
}

/** Step 2 — validate the per-guest responses and write them to the sheet. */
async function handleSubmit(form: FormData): Promise<RsvpActionData> {
  const email = String(form.get("inviteEmail") ?? "").trim();
  const guestCount = Number.parseInt(String(form.get("guestCount") ?? ""), 10);
  if (
    !EMAIL_RE.test(email) ||
    !Number.isFinite(guestCount) ||
    guestCount < 1 ||
    guestCount > MAX_GUESTS
  ) {
    return {
      step: "lookup",
      error: "Something went wrong — please enter your email and try again.",
      email: EMAIL_RE.test(email) ? email : "",
    };
  }

  const guests: GuestEntry[] = [];
  const errors: Record<string, string> = {};
  for (let i = 0; i < guestCount; i++) {
    const name = String(form.get(`guest-${i}-name`) ?? "").trim().slice(0, 120);
    const attendingRaw = String(form.get(`guest-${i}-attending`) ?? "");
    const mealId = String(form.get(`guest-${i}-meal`) ?? "");
    const dietary = String(form.get(`guest-${i}-dietary`) ?? "")
      .trim()
      .slice(0, 300);

    if (!name) {
      // Names come from our own hidden fields — a blank one means tampering
      // or a stale form. Send the guest back to the lookup step.
      return {
        step: "lookup",
        error: "Something went wrong — please enter your email and try again.",
        email,
      };
    }

    const attending =
      attendingRaw === "yes" || attendingRaw === "no" ? attendingRaw : "";
    if (attending === "") {
      errors[`g${i}-attending`] = `Please choose an option for ${name}.`;
    }
    const validMeal = mealOptions.some((m) => m.id === mealId);
    if (attending === "yes" && !validMeal) {
      errors[`g${i}-meal`] = `Please choose a meal for ${name}.`;
    }

    guests.push({
      name,
      attending,
      mealId: attending === "yes" && validMeal ? mealId : "",
      dietary: attending === "yes" ? dietary : "",
    });
  }

  const note = String(form.get("note") ?? "").trim().slice(0, 1000);
  const song = String(form.get("song") ?? "").trim().slice(0, 200);
  const parsedTotal = Number.parseInt(String(form.get("totalGuests") ?? ""), 10);
  const totalGuests =
    Number.isFinite(parsedTotal) && parsedTotal > 0
      ? Math.min(parsedTotal, MAX_GUESTS)
      : guests.length;

  if (Object.keys(errors).length > 0) {
    return { step: "form", email, totalGuests, guests, note, song, errors };
  }

  const result = await saveInviteRsvp(email, guests, { note, song });
  if (result.status === "not-found" || result.status === "mismatch") {
    return {
      step: "lookup",
      error:
        "Your invitation looks different than expected — please enter your email and try again.",
      email,
    };
  }
  if (result.status === "error") {
    return {
      step: "form",
      email,
      totalGuests,
      guests,
      note,
      song,
      formError:
        "Sorry — we couldn't save your RSVP just now. Please try again in a moment.",
    };
  }

  return {
    step: "done",
    email,
    accepted: guests.filter((g) => g.attending === "yes").map((g) => g.name),
    declined: guests.filter((g) => g.attending === "no").map((g) => g.name),
  };
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
