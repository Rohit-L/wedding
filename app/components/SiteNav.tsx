import { useEffect, useState } from "react";
import { couple } from "~/data/wedding";

const LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#schedule", label: "Schedule" },
  { href: "#travel", label: "Travel" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Sticky nav: links left, monogram centered, RSVP as a boxed button on the
 * right. Transparent with light text over the hero photo, then flips to a
 * solid page-colored bar with dark text once scrolled (or the mobile menu
 * is open, since it needs an opaque backdrop either way).
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const inverted = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const monogram = `${couple.partnerOne[0]} & ${couple.partnerTwo[0]}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        inverted
          ? "border-b border-hairline bg-page/95 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5">
        {/* Desktop links */}
        <ul className="hidden items-center gap-6 whitespace-nowrap md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:text-accent ${
                  inverted ? "text-ink" : "text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="justify-self-start md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`text-xs font-medium uppercase tracking-[0.14em] ${
              inverted ? "text-ink" : "text-white"
            }`}
          >
            {open ? "Close" : "Menu"}
          </span>
        </button>

        <a
          href="#top"
          className={`justify-self-center font-display text-lg tracking-wide ${
            inverted ? "text-ink" : "text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          {monogram}
        </a>

        <a
          href="#rsvp"
          className={`justify-self-end px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors ${
            inverted
              ? "bg-ink text-page hover:bg-accent"
              : "bg-white text-ink hover:bg-white/90"
          }`}
        >
          RSVP
        </a>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-hairline bg-page px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-3 text-sm font-medium uppercase tracking-[0.14em] text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
