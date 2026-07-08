import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";

import type { Route } from "./+types/enter";
import { couple, lockScreenImage } from "~/data/wedding";
import {
  createUnlockCookie,
  redirectIfUnlocked,
  safeRedirect,
  SITE_PASSWORD,
} from "~/lib/auth.server";

type ActionData = { error: string } | undefined;

export function meta() {
  return [{ title: `${couple.combined} · Private Celebration` }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await redirectIfUnlocked(request);
  return null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionData | Response> {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (password !== SITE_PASSWORD) {
    return { error: "That's not quite right — please try again." };
  }

  // Send the guest back to wherever they were headed before the gate
  // (e.g. a /rsvp link from an invitation). Validated to same-site paths.
  return redirect(safeRedirect(form.get("redirectTo")), {
    headers: { "Set-Cookie": await createUnlockCookie() },
  });
}

export default function Enter() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  return (
    <main
      className="relative flex min-h-screen z-0 flex-col items-center justify-center overflow-hidden px-6 text-center text-white"
      style={{ textShadow: "0 2px 20px rgb(0 0 0 / 35%)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `${lockScreenImage ? `url(${JSON.stringify(lockScreenImage)}), ` : ""}linear-gradient(160deg, #6b6558, #33312b)`,
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/45" />

      <h1 className="font-names text-[clamp(3rem,13vw,10rem)] font-normal leading-[1.15]">
        {couple.partnerOne} and {couple.partnerTwo}
      </h1>
      <p className="mt-6 max-w-sm text-sm text-white/75">
        This celebration is just for our family and friends. Enter the
        password from your invitation to continue.
      </p>

      <Form method="post" className="mt-10 w-full max-w-xs">
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          autoFocus
          placeholder="Password"
          className="w-full border-0 border-b border-white/40 bg-transparent py-2 text-center text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-0"
          aria-invalid={actionData?.error ? true : undefined}
          aria-describedby={actionData?.error ? "password-error" : undefined}
        />
        {actionData?.error && (
          <p id="password-error" role="alert" className="mt-3 text-sm text-white/90">
            {actionData.error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn mt-8 w-full bg-white text-ink hover:bg-white/90"
        >
          {submitting ? "Checking…" : "Enter"}
        </button>
      </Form>
    </main>
  );
}
