import type { Config } from "tailwindcss";

// The CSS variables hold space-separated RGB triplets (e.g. "200 168 102"),
// so Tailwind's `/opacity` modifiers (`border-accent/30`) can compose them
// into `rgb(var(...) / <alpha>)` instead of needing a fully opaque color.
// Tailwind supports this function form at runtime, but its own TS types only
// declare `string`, hence the cast.
function withOpacity(variable: string): string {
  const resolver = ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `rgb(var(${variable}))`
      : `rgb(var(${variable}) / ${opacityValue})`;
  return resolver as unknown as string;
}

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: withOpacity("--color-page"),
        surface: withOpacity("--color-surface"),
        ink: withOpacity("--color-ink"),
        muted: withOpacity("--color-muted"),
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          strong: withOpacity("--color-accent-strong"),
          soft: withOpacity("--color-accent-soft"),
        },
        // Tailwind's `border-border` etc. read from this; named `hairline`
        // so we keep the default gray `border` utility working too.
        hairline: withOpacity("--color-border"),
      },
      borderColor: {
        DEFAULT: withOpacity("--color-border"),
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
