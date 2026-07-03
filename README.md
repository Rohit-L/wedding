# Rohit & Sophia · Wedding Website

A single-page, black-tie-optional wedding site built with
[React Router v7](https://reactrouter.com/) (framework mode, SSR) and
[Tailwind CSS](https://tailwindcss.com/). It includes a full-bleed photo hero
with a live countdown, our story, an engagement photo gallery, the schedule
of events, travel & stay info, an RSVP form with meal selection, a registry,
and an FAQ.

## Editing your details

All content lives in one place — edit [`app/data/wedding.ts`](app/data/wedding.ts):

- **Couple & date** — names, hashtag, wedding date (drives the countdown), city, venue.
- **Hero photo** — `heroImage`. Leave it empty for an elegant placeholder
  gradient, or point it at a real photo, e.g. `/images/hero.jpg` (drop the
  file in `public/images/`).
- **Schedule** — the list of `events` (day, time, venue, dress code, description).
- **Our Story** — the `story` timeline moments.
- **Engagement photos** — the `engagementPhotos` gallery. Each entry shows an
  elegant placeholder frame with just its caption until you add a `src`
  pointing at a real image (drop files under `public/images/engagement/` and
  reference them as `/images/engagement/01.jpg`).
- **Meal options** — the choices shown on the RSVP form.
- **Travel** — `hotels` / room block info.
- **FAQ** and **Registry** entries.

The visual theme (the "Editorial" palette and fonts) is defined as CSS
variables at the top of [`app/app.css`](app/app.css) — change those to
re-theme the whole site.

## Password gate

The whole site sits behind a password screen at
[`app/routes/enter.tsx`](app/routes/enter.tsx) — every other route requires an
unlocked session (checked in each route's `loader`/`action` via
[`requireUnlocked`](app/lib/auth.server.ts)). The password is the
`SITE_PASSWORD` constant in `app/lib/auth.server.ts` (currently `"coco"`) —
edit it there to change it. This keeps out search engines and casual passers-by;
it isn't meant to withstand a determined attacker.

Set `SESSION_SECRET` (see [`.env.example`](.env.example)) to a long random
string in production so the "unlocked" cookie can't be forged. It's optional
for local dev.

## RSVP submissions → Google Sheet

The RSVP form posts to the `action` in
[`app/routes/home.tsx`](app/routes/home.tsx), which validates the input and then
calls [`saveRsvp`](app/lib/rsvp-store.server.ts). Each submission **upserts a row
in the sheet's first tab, keyed by email** — a returning guest updates their
existing row instead of adding a duplicate. Columns: `Timestamp, Name, Email,
Attending, Guests, Meal, Dietary, Song, Message`. If the first tab is blank, the
header row is created automatically on the first write; if it already has
different columns, the write fails loudly rather than corrupting your data (so
point `GOOGLE_SHEET_ID` at a blank sheet, or one that already has these columns).

Behavior when something isn't set up:

- **Local dev with no credentials** — submissions are logged to the server
  console and the guest still sees the confirmation, so you can work on the site
  without any Google setup.
- **Production with missing credentials or a failed write** — the guest sees a
  "please try again" message (never a false confirmation) and the full
  submission is logged so it's recoverable.

### One-time setup

1. **Create a Google Cloud project** and enable the **Google Sheets API**
   (APIs & Services → Library → "Google Sheets API" → Enable).
2. **Create a service account** (APIs & Services → Credentials → Create
   credentials → Service account). Then, on that service account, create a
   **JSON key** (Keys → Add key → JSON) and download it.
3. **Create your Google Sheet** and **share it** with the service account's
   email (the `client_email` in the JSON, ending in
   `…iam.gserviceaccount.com`) as an **Editor**.
4. **Set the environment variables** (copy [`.env.example`](.env.example) to
   `.env` for local dev, and add the same values in your Vercel project
   settings for production):

   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` from the JSON.
   - `GOOGLE_PRIVATE_KEY` — the `private_key` from the JSON, on one line with
     its `\n` escapes preserved and wrapped in double quotes.
   - `GOOGLE_SHEET_ID` — the id in the sheet URL
     (`.../spreadsheets/d/THIS_PART/edit`).

The secrets are only ever read in
[`app/lib/rsvp-store.server.ts`](app/lib/rsvp-store.server.ts); the `.server.ts`
suffix keeps them out of the client bundle.

## Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Building for production

```bash
npm run build
npm start
```

This project is configured for deployment on Vercel via `@vercel/react-router`.

## Type checking

```bash
npm run typecheck
```
