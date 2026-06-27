# Rohit & Sophia · Wedding Website

A single-page wedding site built with [React Router v7](https://reactrouter.com/)
(framework mode, SSR) and [Tailwind CSS](https://tailwindcss.com/). It includes a
hero with a live countdown, our story, the schedule of events, travel & stay
info, an RSVP form with meal selection, a registry, and an FAQ.

## Editing your details

All content lives in one place — edit [`app/data/wedding.ts`](app/data/wedding.ts):

- **Couple & date** — names, hashtag, wedding date (drives the countdown), city, venue.
- **Schedule** — the list of `events` (day, time, venue, dress code, description).
- **Our Story** — the `story` timeline moments.
- **Meal options** — the choices shown on the RSVP form.
- **Travel** — `hotels` / room block info.
- **FAQ** and **Registry** entries.

The visual theme (the "Olive Atelier" palette and fonts) is defined as CSS
variables at the top of [`app/app.css`](app/app.css) — change those to re-theme
the whole site.

## RSVP submissions

The RSVP form posts to the `action` in
[`app/routes/home.tsx`](app/routes/home.tsx), where it is validated. **There is
no database wired up** — submissions are currently only logged on the server.
See the `TODO` in that file for how to capture responses for real (email, a
spreadsheet, or a database).

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
