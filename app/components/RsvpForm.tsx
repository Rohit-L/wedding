import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { mealOptions, rsvpDeadline } from "~/data/wedding";

export type RsvpValues = {
  name: string;
  email: string;
  attending: string;
  guests: string;
  meal: string;
  dietary: string;
  song: string;
  message: string;
};

export type RsvpActionData =
  | { ok: true; name: string; attending: string }
  | { ok: false; errors: Partial<Record<keyof RsvpValues, string>>; values: RsvpValues };

const labelClass =
  "block text-xs font-medium uppercase tracking-[0.12em] text-muted";
const inputClass =
  "mt-2 w-full border-0 border-b border-hairline bg-transparent py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-0";
const errorClass = "mt-2 text-sm text-[#b3261e]";

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className={errorClass} role="alert">
      {children}
    </p>
  );
}

export function RsvpForm() {
  const actionData = useActionData() as RsvpActionData | undefined;
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  const errors = actionData && !actionData.ok ? actionData.errors : {};
  const values = actionData && !actionData.ok ? actionData.values : undefined;

  const [attending, setAttending] = useState<string>(values?.attending ?? "");

  if (actionData?.ok) {
    return (
      <div className="mx-auto max-w-xl rounded-sm border border-hairline bg-surface p-10 text-center">
        <p className="eyebrow text-accent">RSVP received</p>
        <h3 className="mt-4 font-display text-3xl">Thank you, {actionData.name}!</h3>
        <p className="mt-4 text-muted">
          {actionData.attending === "yes"
            ? "We can't wait to celebrate with you. Keep an eye on your inbox for more details closer to the day."
            : "We'll miss you, but thank you for letting us know. We'll be thinking of you on the day."}
        </p>
      </div>
    );
  }

  return (
    <Form
      method="post"
      className="mx-auto max-w-xl space-y-8"
      aria-describedby="rsvp-deadline"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values?.name}
            className={inputClass}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <ErrorText id="name-error">{errors.name}</ErrorText>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            className={inputClass}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <ErrorText id="email-error">{errors.email}</ErrorText>
        </div>
      </div>

      {/* Attending? */}
      <fieldset>
        <legend className={labelClass}>Will you be joining us?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { value: "yes", label: "Joyfully accepts" },
            { value: "no", label: "Regretfully declines" },
          ].map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="attending"
                value={option.value}
                checked={attending === option.value}
                onChange={(e) => setAttending(e.target.value)}
                className="peer sr-only"
              />
              <div className="rounded-sm border border-hairline bg-page px-4 py-3 text-center text-sm transition-colors peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:font-medium peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {option.label}
              </div>
            </label>
          ))}
        </div>
        <ErrorText id="attending-error">{errors.attending}</ErrorText>
      </fieldset>

      {/* Details shown only when attending */}
      {attending === "yes" && (
        <div className="space-y-8">
          <div>
            <label htmlFor="guests" className={labelClass}>
              Number in your party
            </label>
            <select
              id="guests"
              name="guests"
              defaultValue={values?.guests || "1"}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={labelClass}>Meal preference</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {mealOptions.map((option) => (
                <label key={option.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="meal"
                    value={option.id}
                    defaultChecked={values?.meal === option.id}
                    className="peer sr-only"
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
            <ErrorText id="meal-error">{errors.meal}</ErrorText>
          </fieldset>

          <div>
            <label htmlFor="dietary" className={labelClass}>
              Dietary restrictions <span className="normal-case">(optional)</span>
            </label>
            <input
              id="dietary"
              name="dietary"
              type="text"
              placeholder="Allergies, vegan, gluten-free…"
              defaultValue={values?.dietary}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="song" className={labelClass}>
              Song request <span className="normal-case">(optional)</span>
            </label>
            <input
              id="song"
              name="song"
              type="text"
              placeholder="What will get you on the dance floor?"
              defaultValue={values?.song}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className={labelClass}>
          A note for the couple <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          defaultValue={values?.message}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Sending…" : "Send RSVP"}
        </button>
        <p id="rsvp-deadline" className="text-sm text-muted">
          Kindly respond by {rsvpDeadline}
        </p>
      </div>
    </Form>
  );
}
