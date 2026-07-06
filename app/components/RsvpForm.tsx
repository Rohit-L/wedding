import { useState } from "react";
import { useActionData, useFetcher } from "react-router";
import type { FetcherWithComponents } from "react-router";
import { mealOptions, rsvpDeadline } from "~/data/wedding";

/** One guest's response, as shown in the form and written to the sheet. */
export type GuestEntry = {
  name: string;
  attending: "" | "yes" | "no";
  /** A `mealOptions` id, or "" when none chosen / not attending. */
  mealId: string;
  dietary: string;
};

export type RsvpActionData =
  /** Step 1 — the email lookup failed (bad email / unknown invite / outage). */
  | { step: "lookup"; error: string; email: string }
  /** Step 2 — the invite's guests, plus validation errors on a failed submit. */
  | {
      step: "form";
      email: string;
      totalGuests: number;
      guests: GuestEntry[];
      note: string;
      song: string;
      /** Field errors keyed `g<index>-attending` / `g<index>-meal`. */
      errors?: Record<string, string>;
      /** Non-field error, e.g. the Google Sheet write failed. */
      formError?: string;
    }
  /** Step 3 — saved. */
  | { step: "done"; email: string; accepted: string[]; declined: string[] };

const labelClass =
  "block text-xs font-medium uppercase tracking-[0.12em] text-muted";
const inputClass =
  "mt-2 w-full border-0 border-b border-hairline bg-transparent py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-0";
const cardClass =
  "rounded-sm border border-hairline bg-page px-4 py-3 text-center text-sm transition-colors peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:font-medium peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent";

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 text-sm text-[#b3261e]" role="alert">
      {children}
    </p>
  );
}

function FormErrorBanner({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-sm border border-[#b3261e] bg-[#b3261e]/5 px-4 py-3 text-center text-sm text-[#b3261e]"
    >
      {children}
    </p>
  );
}

/**
 * Two-step RSVP flow:
 *
 *   1. The guest enters the email address on their invitation (it acts as the
 *      invite's "password").
 *   2. The form lists every guest on that invitation — accept/decline and a
 *      meal choice per guest, prefilled with any previous answers — and the
 *      submission updates the matching rows in the Google Sheet.
 *
 * Uses a fetcher so moving between steps never navigates or scrolls the page;
 * `useActionData` is read as a fallback for non-JS document posts.
 */
export function RsvpForm() {
  const fetcher = useFetcher<RsvpActionData>();
  const navigationData = useActionData() as RsvpActionData | undefined;
  const data = fetcher.data ?? navigationData;
  const busy = fetcher.state !== "idle";

  // "Use a different email" — remember which response was dismissed so the
  // lookup step shows again until a fresh response arrives.
  const [dismissed, setDismissed] = useState<RsvpActionData | undefined>();
  const view = data === undefined || data === dismissed ? undefined : data;

  if (view === undefined || view.step === "lookup") {
    return (
      <LookupStep
        fetcher={fetcher}
        busy={busy}
        error={view?.error}
        email={view?.email ?? ""}
      />
    );
  }

  if (view.step === "form") {
    return (
      <GuestFormStep
        // Remount (resetting local state) when the invite's guest set changes.
        key={`${view.email}|${view.guests.map((g) => g.name).join("|")}`}
        data={view}
        fetcher={fetcher}
        busy={busy}
        onUseDifferentEmail={() => setDismissed(data)}
      />
    );
  }

  return <DonePanel data={view} fetcher={fetcher} busy={busy} />;
}

/* ── Step 1 — find the invitation ──────────────────────────────────────── */

function LookupStep({
  fetcher,
  busy,
  error,
  email,
}: {
  fetcher: FetcherWithComponents<RsvpActionData>;
  busy: boolean;
  error?: string;
  email: string;
}) {
  return (
    <fetcher.Form method="post" className="mx-auto max-w-md text-center">
      <input type="hidden" name="intent" value="lookup" />
      <div className="text-left">
        <label htmlFor="rsvp-email" className={labelClass}>
          Email on your invitation
        </label>
        <input
          id="rsvp-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={email}
          placeholder="you@example.com"
          className={inputClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "rsvp-email-error" : "rsvp-email-help"}
        />
        <ErrorText id="rsvp-email-error">{error}</ErrorText>
      </div>

      <button type="submit" disabled={busy} className="btn btn-primary mt-8">
        {busy ? "Finding…" : "Find your invitation"}
      </button>
      <p id="rsvp-email-help" className="mt-4 text-sm text-muted">
        Enter the email address your invitation was sent to.
        <br />
        Kindly respond by {rsvpDeadline}.
      </p>
    </fetcher.Form>
  );
}

/* ── Step 2 — respond for every guest ──────────────────────────────────── */

function GuestFormStep({
  data,
  fetcher,
  busy,
  onUseDifferentEmail,
}: {
  data: Extract<RsvpActionData, { step: "form" }>;
  fetcher: FetcherWithComponents<RsvpActionData>;
  busy: boolean;
  onUseDifferentEmail: () => void;
}) {
  // Local state is seeded from the server response (which includes any
  // previous answers) and is authoritative from then on; the component
  // remounts (via key) whenever a different guest list arrives.
  const [entries, setEntries] = useState<GuestEntry[]>(() =>
    data.guests.map((g) => ({ ...g })),
  );
  const [note, setNote] = useState(data.note);
  const [song, setSong] = useState(data.song);

  // Server errors, minus the ones the guest has since fixed. The cleared list
  // resets whenever a new response arrives (adjust-state-during-render).
  const [cleared, setCleared] = useState<string[]>([]);
  const [lastData, setLastData] = useState(data);
  if (lastData !== data) {
    setLastData(data);
    setCleared([]);
  }
  const errors = Object.fromEntries(
    Object.entries(data.errors ?? {}).filter(([key]) => !cleared.includes(key)),
  );
  const hasErrors = Object.keys(errors).length > 0;

  const updateEntry = (
    index: number,
    patch: Partial<GuestEntry>,
    clearError?: string,
  ) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    );
    if (clearError) setCleared((prev) => [...prev, clearError]);
  };

  const seats = data.totalGuests === 1 ? "1 seat" : `${data.totalGuests} seats`;

  return (
    <fetcher.Form method="post" className="mx-auto max-w-xl">
      <input type="hidden" name="intent" value="submit" />
      <input type="hidden" name="inviteEmail" value={data.email} />
      <input type="hidden" name="totalGuests" value={data.totalGuests} />
      <input type="hidden" name="guestCount" value={entries.length} />

      <div className="text-center">
        <p className="text-muted">
          We've reserved {seats} in your honor. Please respond for each guest
          below.
        </p>
        {data.totalGuests !== data.guests.length && (
          <p className="mt-2 text-sm text-muted">
            Missing someone from this list? Please reach out to us directly.
          </p>
        )}
      </div>

      <div className="mt-10 space-y-10">
        {entries.map((guest, i) => (
          <fieldset
            key={guest.name + i}
            className="rounded-sm border border-hairline bg-page/60 p-6"
          >
            <legend className="px-2 font-display text-2xl">{guest.name}</legend>
            <input type="hidden" name={`guest-${i}-name`} value={guest.name} />

            {/* Attending? */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "yes", label: "Joyfully accepts" },
                { value: "no", label: "Regretfully declines" },
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`guest-${i}-attending`}
                    value={option.value}
                    checked={guest.attending === option.value}
                    onChange={() =>
                      updateEntry(
                        i,
                        { attending: option.value as "yes" | "no" },
                        `g${i}-attending`,
                      )
                    }
                    className="peer sr-only"
                    aria-invalid={errors[`g${i}-attending`] ? true : undefined}
                    aria-describedby={
                      errors[`g${i}-attending`]
                        ? `g${i}-attending-error`
                        : undefined
                    }
                  />
                  <div className={cardClass}>{option.label}</div>
                </label>
              ))}
            </div>
            <ErrorText id={`g${i}-attending-error`}>
              {errors[`g${i}-attending`]}
            </ErrorText>

            {/* Meal + dietary, only when accepting */}
            {guest.attending === "yes" && (
              <div className="mt-6 space-y-6">
                <div>
                  <p className={labelClass}>Meal preference</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {mealOptions.map((option) => (
                      <label key={option.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name={`guest-${i}-meal`}
                          value={option.id}
                          checked={guest.mealId === option.id}
                          onChange={() =>
                            updateEntry(i, { mealId: option.id }, `g${i}-meal`)
                          }
                          className="peer sr-only"
                          aria-invalid={errors[`g${i}-meal`] ? true : undefined}
                          aria-describedby={
                            errors[`g${i}-meal`] ? `g${i}-meal-error` : undefined
                          }
                        />
                        <div className="flex h-full items-start gap-3 rounded-sm border border-hairline bg-page p-4 transition-colors peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:[&_.tick]:border-accent peer-checked:[&_.tick]:bg-accent peer-checked:[&_.tick_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                          <span className="tick mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-hairline transition-colors">
                            <svg
                              viewBox="0 0 20 20"
                              className="h-3 w-3 text-page opacity-0 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              aria-hidden
                            >
                              <path
                                d="M4 10.5l4 4 8-9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span>
                            <span className="block font-display text-lg leading-tight">
                              {option.name}
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              {option.description}
                            </span>
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <ErrorText id={`g${i}-meal-error`}>
                    {errors[`g${i}-meal`]}
                  </ErrorText>
                </div>

                <div>
                  <label htmlFor={`guest-${i}-dietary`} className={labelClass}>
                    Dietary restrictions{" "}
                    <span className="normal-case">(optional)</span>
                  </label>
                  <input
                    id={`guest-${i}-dietary`}
                    name={`guest-${i}-dietary`}
                    type="text"
                    placeholder="Allergies, vegan, gluten-free…"
                    value={guest.dietary}
                    onChange={(e) => updateEntry(i, { dietary: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </fieldset>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <label htmlFor="rsvp-song" className={labelClass}>
            Song request <span className="normal-case">(optional)</span>
          </label>
          <input
            id="rsvp-song"
            name="song"
            type="text"
            placeholder="What will get your party on the dance floor?"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="rsvp-note" className={labelClass}>
            A note for the couple <span className="normal-case">(optional)</span>
          </label>
          <textarea
            id="rsvp-note"
            name="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <FormErrorBanner>
          {data.formError ??
            (hasErrors
              ? "Please complete the highlighted responses above."
              : undefined)}
        </FormErrorBanner>

        <div className="flex flex-col items-center gap-4">
          <button type="submit" disabled={busy} className="btn btn-primary">
            {busy ? "Sending…" : "Send RSVP"}
          </button>
          <button
            type="button"
            onClick={onUseDifferentEmail}
            className="text-xs uppercase tracking-[0.12em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    </fetcher.Form>
  );
}

/* ── Step 3 — confirmation ─────────────────────────────────────────────── */

function DonePanel({
  data,
  fetcher,
  busy,
}: {
  data: Extract<RsvpActionData, { step: "done" }>;
  fetcher: FetcherWithComponents<RsvpActionData>;
  busy: boolean;
}) {
  const allDeclined = data.accepted.length === 0;
  const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

  return (
    <div
      role="status"
      className="mx-auto max-w-xl rounded-sm border border-hairline bg-page p-10 text-center"
    >
      <p className="eyebrow text-accent">RSVP received</p>
      <h3 className="mt-4 font-display text-3xl">Thank you!</h3>
      <div className="mt-4 space-y-2 text-muted">
        {data.accepted.length > 0 && (
          <p>
            Celebrating with us: <strong>{listFormat.format(data.accepted)}</strong>.
            We can't wait to see you there.
          </p>
        )}
        {data.declined.length > 0 && (
          <p>
            {allDeclined ? (
              <>
                We'll miss you, but thank you for letting us know. We'll be
                thinking of you on the day.
              </>
            ) : (
              <>
                We'll miss <strong>{listFormat.format(data.declined)}</strong> —
                thank you for letting us know.
              </>
            )}
          </p>
        )}
      </div>

      <fetcher.Form method="post" className="mt-8">
        <input type="hidden" name="intent" value="lookup" />
        <input type="hidden" name="email" value={data.email} />
        <button type="submit" disabled={busy} className="btn btn-ghost">
          {busy ? "One moment…" : "Make a change"}
        </button>
      </fetcher.Form>
    </div>
  );
}
