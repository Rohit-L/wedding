/**
 * Server-only site-wide password gate.
 *
 * This is a privacy screen, not a security boundary — it keeps search
 * engines and passers-by off the site, not a determined attacker. The
 * password is intentionally a plain constant (change it here to change the
 * password); what's actually secret is the session-signing key.
 */
import { createCookieSessionStorage, redirect } from "react-router";

export const SITE_PASSWORD = "coco";

const secret = process.env.SESSION_SECRET;
if (!secret && import.meta.env.PROD) {
  console.warn(
    "SESSION_SECRET is not set — using an insecure default. Set it in your " +
      "production environment so unlock sessions can't be forged.",
  );
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__wedding_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secret || "dev-only-insecure-secret-change-me"],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 180, // 180 days
  },
});

async function isUnlocked(request: Request): Promise<boolean> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return session.get("unlocked") === true;
}

/** Throws a redirect to `/enter` unless the request's session is unlocked. */
export async function requireUnlocked(request: Request): Promise<void> {
  if (!(await isUnlocked(request))) {
    throw redirect("/enter");
  }
}

/** Throws a redirect to `/` if the request is already unlocked. */
export async function redirectIfUnlocked(request: Request): Promise<void> {
  if (await isUnlocked(request)) {
    throw redirect("/");
  }
}

/** Builds the `Set-Cookie` header for a freshly unlocked session. */
export async function createUnlockCookie(): Promise<string> {
  const session = await sessionStorage.getSession();
  session.set("unlocked", true);
  return sessionStorage.commitSession(session);
}
