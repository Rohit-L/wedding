/**
 * Server-only RSVP persistence to a Google Sheet.
 *
 * The `.server.ts` suffix guarantees this module (and the service-account
 * secret it reads) is never bundled into the client.
 *
 * Setup (see README): create a Google Cloud service account with the Sheets
 * API enabled, share your sheet with the service account's email as an Editor,
 * then set these environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  – the service account email
 *   GOOGLE_PRIVATE_KEY            – its private key (keep the \n escapes)
 *   GOOGLE_SHEET_ID              – the id from the sheet URL
 *
 * If the variables are absent the submission is logged and reported as
 * "skipped" so the site still runs locally without any Google setup.
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

import type { RsvpValues } from "~/components/RsvpForm";
import { mealOptions } from "~/data/wedding";

/** Column order written to the sheet (also used to seed the header row). */
const HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Attending",
  "Guests",
  "Meal",
  "Dietary",
  "Song",
  "Message",
] as const;

export type SaveResult =
  | { status: "saved"; mode: "created" | "updated" }
  | { status: "skipped" }
  | { status: "error"; message: string };

function readConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheetId) return null;
  // Env vars store newlines escaped as literal "\n"; restore them for the PEM.
  return { email, key: key.replace(/\\n/g, "\n"), sheetId };
}

/** Turn a submission into a flat row keyed by header name. */
function toRow(values: RsvpValues): Record<string, string> {
  const attending = values.attending === "yes";
  const mealName =
    mealOptions.find((m) => m.id === values.meal)?.name ?? values.meal;
  return {
    Timestamp: new Date().toISOString(),
    Name: values.name,
    Email: values.email,
    Attending: attending ? "Yes" : "No",
    Guests: attending ? values.guests : "",
    Meal: attending ? mealName : "",
    Dietary: values.dietary,
    Song: values.song,
    Message: values.message,
  };
}

/**
 * Upsert an RSVP into the sheet, keyed by email (case-insensitive). Updates the
 * matching row if the guest has responded before, otherwise appends a new row.
 */
export async function saveRsvp(values: RsvpValues): Promise<SaveResult> {
  const config = readConfig();
  if (!config) {
    // In production, missing credentials must NOT look like success — otherwise
    // guests see "RSVP received" while nothing is saved. Surface an error so
    // they get the retry banner and the couple notices the misconfiguration.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[RSVP] Google Sheets is not configured in production — submission NOT saved:",
        values,
      );
      return {
        status: "error",
        message: "Google Sheets credentials are not configured.",
      };
    }
    // In dev the site is expected to run without any Google setup.
    console.warn(
      "[RSVP] Google Sheets not configured (dev) — submission logged instead:",
      values,
    );
    return { status: "skipped" };
  }

  try {
    const auth = new JWT({
      email: config.email,
      key: config.key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(config.sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error("The spreadsheet has no sheets/tabs.");
    }

    // Make sure the sheet has our header row before reading/writing rows.
    // Note: reading `sheet.headerValues` throws until headers are loaded, so we
    // track success with a flag rather than probing the getter after a failure.
    let hasHeader = false;
    try {
      await sheet.loadHeaderRow();
      hasHeader = sheet.headerValues.length > 0;
    } catch {
      // loadHeaderRow throws when row 1 is empty — leave hasHeader false to seed.
    }

    if (!hasHeader) {
      // Fresh/blank sheet: create the header row on first use.
      await sheet.setHeaderRow([...HEADERS]);
    } else {
      // A header row already exists. Only proceed if it contains our columns —
      // otherwise get/set/addRow would silently drop or misalign data. Fail
      // loudly instead so the couple notices (and the submission is logged).
      const missing = HEADERS.filter((h) => !sheet.headerValues.includes(h));
      if (missing.length > 0) {
        throw new Error(
          `Sheet "${sheet.title}" is missing expected column(s): ${missing.join(
            ", ",
          )}. Point GOOGLE_SHEET_ID at a blank sheet, or one whose first tab has the RSVP columns.`,
        );
      }
    }

    const rowData = toRow(values);
    const emailKey = values.email.trim().toLowerCase();

    const rows = await sheet.getRows();
    const existing = rows.find(
      (row) => String(row.get("Email") ?? "").trim().toLowerCase() === emailKey,
    );

    if (existing) {
      for (const header of HEADERS) existing.set(header, rowData[header]);
      await existing.save();
      return { status: "saved", mode: "updated" };
    }

    await sheet.addRow(rowData);
    return { status: "saved", mode: "created" };
  } catch (error) {
    // Log the full submission so a failed write is still recoverable.
    console.error("[RSVP] Failed to write to Google Sheet:", error, values);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
