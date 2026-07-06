/**
 * Server-only RSVP persistence backed by a Google Sheet with two tabs:
 *
 *   Tab 1 — Guests:  Timestamp | Name | Email | Attending | Meal | Dietary | Song | Message
 *   Tab 2 — Invites: Full Name | Email | Phone Number | Total Guest Count
 *
 * The couple pre-fills both tabs: one Invites row per household — the Email
 * is what guests type to open their RSVP — and one Guests row per person on
 * that invite (Name + the same Email; leave the response columns blank).
 * Submitting the form UPDATES the matching guest rows in place, so the sheet
 * always holds exactly one row per guest. Attending/Meal/Dietary are
 * per-guest; Song/Message are per-invite (written to each of its rows);
 * Timestamp records when the household last responded.
 *
 * The `.server.ts` suffix guarantees this module (and the service-account
 * secret it reads) is never bundled into the client.
 *
 * Setup (see README): create a Google Cloud service account with the Sheets
 * API enabled, share the sheet with the service account's email as an Editor,
 * then set these environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  – the service account email
 *   GOOGLE_PRIVATE_KEY            – its private key (keep the \n escapes)
 *   GOOGLE_SHEET_ID              – the id from the sheet URL
 *
 * Without those variables, dev serves a SAMPLE invite (so the flow is fully
 * usable locally) and production fails loudly rather than faking success.
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import type {
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { JWT } from "google-auth-library";

import type { GuestEntry } from "~/components/RsvpForm";
import { mealOptions } from "~/data/wedding";

/** Tab 1 columns. "Name" + "Email" are filled by the couple; the rest are
 * written by the app on submit. */
const GUEST_HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Attending",
  "Meal",
  "Dietary",
  "Song",
  "Message",
] as const;

/** Tab 2 columns, filled by the couple — one row per invitation. Only the
 * REQUIRED subset is validated; the rest is reference data for the couple. */
const INVITE_HEADERS = [
  "Full Name",
  "Email",
  "Phone Number",
  "Total Guest Count",
] as const;
const REQUIRED_INVITE_HEADERS = ["Email", "Total Guest Count"] as const;

export type LookupResult =
  | {
      status: "found";
      totalGuests: number;
      guests: GuestEntry[];
      note: string;
      song: string;
    }
  | { status: "not-found" }
  | { status: "error"; message: string };

export type SaveResult =
  | { status: "saved" }
  /** The invite email no longer matches a row in the Invites tab. */
  | { status: "not-found" }
  /** The submitted guests don't line up with the sheet's guest rows. */
  | { status: "mismatch" }
  | { status: "error"; message: string };

function readConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheetId) return null;
  // Env vars store newlines escaped as literal "\n"; restore them for the PEM.
  return { email, key: key.replace(/\\n/g, "\n"), sheetId };
}

const isProduction = () => process.env.NODE_ENV === "production";

/** Sample invite served in dev when Google Sheets isn't configured. */
const SAMPLE_GUESTS: GuestEntry[] = [
  { name: "Avery Sample", attending: "", mealId: "", dietary: "" },
  { name: "Jordan Sample", attending: "", mealId: "", dietary: "" },
];

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();

/** "Yes"/"No" (any casing) → form value; anything else means "not answered". */
function parseAttending(value: unknown): GuestEntry["attending"] {
  const v = normalize(value);
  if (v.startsWith("y")) return "yes";
  if (v.startsWith("n")) return "no";
  return "";
}

/** Sheet stores the meal's display name; map it back to the option id. */
function mealIdFromName(value: unknown): string {
  const v = normalize(value);
  return mealOptions.find((m) => m.name.toLowerCase() === v)?.id ?? "";
}

function mealNameFromId(id: string): string {
  return mealOptions.find((m) => m.id === id)?.name ?? id;
}

/**
 * Ensure a tab has the expected header row: seed `headers` when row 1 is
 * blank, and fail loudly when a header row exists but is missing any of
 * `required` — writing against an unrecognized header would silently drop or
 * misalign data. Extra columns beyond `required` are fine.
 *
 * Note: reading `sheet.headerValues` throws until headers are loaded, so we
 * track loadHeaderRow's success with a flag rather than probing the getter.
 */
async function ensureHeaders(
  sheet: GoogleSpreadsheetWorksheet,
  headers: readonly string[],
  required: readonly string[],
  tabDescription: string,
): Promise<void> {
  let hasHeader = false;
  try {
    await sheet.loadHeaderRow();
    hasHeader = sheet.headerValues.length > 0;
  } catch (error) {
    // loadHeaderRow throws for a blank row 1 — the only case where seeding is
    // safe. It ALSO throws for duplicate headers and transient API failures
    // (429/5xx); reseeding then would destructively rewrite the couple's
    // header row, so rethrow anything that isn't the blank-row error.
    const msg = error instanceof Error ? error.message : String(error);
    if (!/No values in the header row|header cells are blank/i.test(msg)) {
      throw error;
    }
  }

  if (!hasHeader) {
    await sheet.setHeaderRow([...headers]);
    return;
  }

  const missing = required.filter((h) => !sheet.headerValues.includes(h));
  if (missing.length > 0) {
    throw new Error(
      `${tabDescription} tab "${sheet.title}" is missing expected column(s): ` +
        `${missing.join(", ")}. See the README for the required layout.`,
    );
  }
}

/** Open the doc and both tabs, validating each tab's header row. */
async function openSheets(config: NonNullable<ReturnType<typeof readConfig>>) {
  const auth = new JWT({
    email: config.email,
    key: config.key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(config.sheetId, auth);
  await doc.loadInfo();

  const guestsSheet = doc.sheetsByIndex[0];
  const invitesSheet = doc.sheetsByIndex[1];
  if (!guestsSheet || !invitesSheet) {
    throw new Error(
      "The spreadsheet needs two tabs: Guests (first) and Invites (second). " +
        "See the README for the required layout.",
    );
  }

  await ensureHeaders(guestsSheet, GUEST_HEADERS, GUEST_HEADERS, "Guests");
  await ensureHeaders(
    invitesSheet,
    INVITE_HEADERS,
    REQUIRED_INVITE_HEADERS,
    "Invites",
  );

  return { guestsSheet, invitesSheet };
}

async function findInviteRow(
  invitesSheet: GoogleSpreadsheetWorksheet,
  email: string,
): Promise<GoogleSpreadsheetRow | undefined> {
  const rows = await invitesSheet.getRows();
  const key = normalize(email);
  return rows.find((row) => normalize(row.get("Email")) === key);
}

/** All guest rows belonging to an invite, in sheet order (blank names skipped). */
async function findGuestRows(
  guestsSheet: GoogleSpreadsheetWorksheet,
  email: string,
): Promise<GoogleSpreadsheetRow[]> {
  const rows = await guestsSheet.getRows();
  const key = normalize(email);
  return rows.filter(
    (row) =>
      normalize(row.get("Email")) === key &&
      String(row.get("Name") ?? "").trim() !== "",
  );
}

/**
 * Look up an invitation by its email. Returns the invite's guest list with
 * any previous answers, so a returning household sees their responses
 * prefilled and can change them.
 */
export async function lookupInvite(email: string): Promise<LookupResult> {
  const config = readConfig();
  if (!config) {
    if (isProduction()) {
      console.error(
        "[RSVP] Google Sheets is not configured in production — lookup failed for:",
        email,
      );
      return {
        status: "error",
        message: "Google Sheets credentials are not configured.",
      };
    }
    console.warn(
      `[RSVP] Google Sheets not configured (dev) — serving the sample invite for "${email}".`,
    );
    return {
      status: "found",
      totalGuests: SAMPLE_GUESTS.length,
      guests: SAMPLE_GUESTS.map((g) => ({ ...g })),
      note: "",
      song: "",
    };
  }

  try {
    const { guestsSheet, invitesSheet } = await openSheets(config);

    const inviteRow = await findInviteRow(invitesSheet, email);
    if (!inviteRow) return { status: "not-found" };

    const guestRows = await findGuestRows(guestsSheet, email);
    const guests: GuestEntry[] = guestRows.map((row) => ({
      name: String(row.get("Name") ?? "").trim(),
      attending: parseAttending(row.get("Attending")),
      mealId: mealIdFromName(row.get("Meal")),
      dietary: String(row.get("Dietary") ?? "").trim(),
    }));

    const parsedTotal = Number.parseInt(
      String(inviteRow.get("Total Guest Count") ?? ""),
      10,
    );
    const totalGuests =
      Number.isFinite(parsedTotal) && parsedTotal > 0
        ? parsedTotal
        : guests.length;

    if (totalGuests !== guests.length) {
      console.warn(
        `[RSVP] Invite "${email}": Total Guest Count (${totalGuests}) doesn't ` +
          `match the ${guests.length} guest row(s) on the Guests tab — check the sheet.`,
      );
    }

    return {
      status: "found",
      totalGuests,
      guests,
      note: String(guestRows[0]?.get("Message") ?? "").trim(),
      song: String(guestRows[0]?.get("Song") ?? "").trim(),
    };
  } catch (error) {
    console.error("[RSVP] Failed to look up invite:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Write an invite's responses onto its guest rows in the Guests tab.
 *
 * Every guest row of the invite must be matched by a submitted response (and
 * vice versa) before anything is written — no partial updates. Rows are
 * matched by name, tolerating duplicate names by claiming each row once.
 */
export async function saveInviteRsvp(
  email: string,
  guests: GuestEntry[],
  extras: { note: string; song: string },
): Promise<SaveResult> {
  const config = readConfig();
  if (!config) {
    if (isProduction()) {
      console.error(
        "[RSVP] Google Sheets is not configured in production — submission NOT saved:",
        { email, guests, extras },
      );
      return {
        status: "error",
        message: "Google Sheets credentials are not configured.",
      };
    }
    console.warn(
      "[RSVP] Google Sheets not configured (dev) — submission logged instead:",
      { email, guests, extras },
    );
    return { status: "saved" };
  }

  try {
    const { guestsSheet, invitesSheet } = await openSheets(config);

    const inviteRow = await findInviteRow(invitesSheet, email);
    if (!inviteRow) return { status: "not-found" };

    const guestRows = await findGuestRows(guestsSheet, email);
    if (guestRows.length === 0 || guestRows.length !== guests.length) {
      return { status: "mismatch" };
    }

    // Pair every submitted guest with a distinct sheet row before writing.
    const claimed = new Set<GoogleSpreadsheetRow>();
    const pairs: Array<[GoogleSpreadsheetRow, GuestEntry]> = [];
    for (const guest of guests) {
      const row = guestRows.find(
        (r) => !claimed.has(r) && normalize(r.get("Name")) === normalize(guest.name),
      );
      if (!row) return { status: "mismatch" };
      claimed.add(row);
      pairs.push([row, guest]);
    }

    const respondedAt = new Date().toISOString();
    for (const [row, guest] of pairs) {
      const attending = guest.attending === "yes";
      row.set("Attending", attending ? "Yes" : "No");
      row.set("Meal", attending ? mealNameFromId(guest.mealId) : "");
      row.set("Dietary", attending ? guest.dietary : "");
      row.set("Song", extras.song);
      row.set("Message", extras.note);
      row.set("Timestamp", respondedAt);
      // raw: write values as literal text — never as formulas. Without this,
      // guest input starting with = + - or @ would be evaluated by Sheets
      // (spreadsheet formula injection, e.g. IMPORTXML exfiltration).
      await row.save({ raw: true });
    }

    return { status: "saved" };
  } catch (error) {
    // Log the full submission so a failed write is still recoverable.
    console.error("[RSVP] Failed to write to Google Sheet:", error, {
      email,
      guests,
      extras,
    });
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
