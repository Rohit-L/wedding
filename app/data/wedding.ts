/**
 * Single source of truth for all wedding content.
 *
 * This is template/placeholder data — replace the values below with your real
 * details. Everything on the site reads from this file, so you only edit here.
 */

export const couple = {
  partnerOne: "Sophia",
  partnerTwo: "Rohit",
  /** Used in <title>, hero, and footer. */
  combined: "Sophia & Rohit",
  hashtag: "#RohitAndSophia",
} as const;

export const wedding = {
  /**
   * ISO 8601 with timezone — drives the countdown timer. Counts down to the
   * start of the first day's festivities, in Lake Como time (CEST).
   */
  dateISO: "2027-09-17T16:30:00+02:00",
  dateLong: "September 17–18, 2027",
  dateShort: "09 . 17 . 27",
  city: "Lake Como, Italy",
} as const;

/**
 * Full-bleed hero background photo, e.g. `/images/hero.jpg` (drop the file
 * in `public/images/`). Leave empty for an elegant placeholder gradient
 * until you have a real photo to use.
 */
export const heroImage: string = "/images/vertical_walking.jpg";

/**
 * Full-bleed background photo for the password gate (`/enter`), e.g.
 * `/images/enter.jpg` (drop the file in `public/images/`). Leave empty for
 * an elegant placeholder gradient until you have a real photo to use.
 */
export const lockScreenImage: string = "/images/vertical_walking.jpg";

export type WeddingEvent = {
  id: string;
  day: string;
  date: string;
  name: string;
  venue: string;
  dressCode: string;
  description?: string;
};

/**
 * Times and descriptions are intentionally omitted until they're finalized —
 * the schedule shows each day's venue, attire, and running order only.
 */
export const events: WeddingEvent[] = [
  {
    id: "ceremony",
    day: "Friday",
    date: "September 17, 2027",
    name: "Wedding Ceremony",
    venue: "Villa Pizzo",
    dressCode: "Black Tie Optional",
  },
  {
    id: "friday-cocktails",
    day: "Friday",
    date: "September 17, 2027",
    name: "Cocktail Hour",
    venue: "Villa Pizzo",
    dressCode: "Black Tie Optional",
  },
  {
    id: "friday-reception",
    day: "Friday",
    date: "September 17, 2027",
    name: "Dinner & Reception",
    venue: "Villa Pizzo",
    dressCode: "Black Tie Optional",
  },
  {
    id: "baraat",
    day: "Saturday",
    date: "September 18, 2027",
    name: "Baraat",
    venue: "Castello Durini",
    dressCode: "Indian Formal",
    description:
      "The groom's entrance, with music and dancing. Family and friends of the groom escort him to the wedding venue. This is a lively and celebratory event.",
  },
  {
    id: "jai-mala",
    day: "Saturday",
    date: "September 18, 2027",
    name: "Jai Mala",
    venue: "Castello Durini",
    dressCode: "Indian Formal",
    description:
      "The bride and groom exchange flower garlands to symbolize their unity.",
  },
  {
    id: "saturday-cocktails",
    day: "Saturday",
    date: "September 18, 2027",
    name: "Cocktail Hour",
    venue: "Castello Durini",
    dressCode: "Indian Formal",
  },
  {
    id: "saturday-reception",
    day: "Saturday",
    date: "September 18, 2027",
    name: "Dinner & Reception",
    venue: "Castello Durini",
    dressCode: "Indian Formal",
  },
];

/**
 * Attire inspiration images, keyed by dress code, shown on the Schedule under
 * the matching day(s). Drop files in `public/images/`.
 */
export const attireInspiration: Record<
  string,
  { src: string; alt: string }[]
> = {
  "Black Tie Optional": [
    { src: "/images/day%201%20men.jpg", alt: "Black tie optional inspiration for him" },
    { src: "/images/day%201%20women.jpg", alt: "Black tie optional inspiration for her" },
  ],
  "Indian Formal": [
    { src: "/images/day%202%20men.jpeg", alt: "Indian formal inspiration for him" },
    { src: "/images/day%202%20women.jpeg", alt: "Indian formal inspiration for her" },
  ],
};

/** Short notes shown under a dress code's heading on the Dress Code section. */
export const dressCodeNotes: Record<string, string> = {
  "Black Tie Optional":
    "We invite you to dress elegantly for our first day of celebration. Gentlemen are encouraged to wear tuxedos or dark suits, and ladies are invited to wear floor-length dresses. Please refrain from wearing white or ivory and red.",
  "Indian Formal":
    "Our second day celebrates Indian tradition and festivity. Gentlemen may wear kurta sets or sherwanis, and ladies are welcome in lehengas or sarees. We encourage bright and vibrant attire. Please refrain from wearing white or ivory and red.",
};

export type MealOption = {
  id: string;
  name: string;
  description: string;
};

export const mealOptions: MealOption[] = [
  {
    id: "chicken",
    name: "Herb-Roasted Chicken",
    description: "Free-range chicken, lemon-thyme jus, seasonal vegetables.",
  },
  {
    id: "salmon",
    name: "Pan-Seared Salmon",
    description: "Wild salmon, citrus beurre blanc, charred asparagus.",
  },
  {
    id: "vegetarian",
    name: "Wild Mushroom Risotto",
    description: "Arborio rice, forest mushrooms, parmesan (vegetarian).",
  },
  {
    id: "kids",
    name: "Kids' Plate",
    description: "Buttered pasta and fresh fruit for our littlest guests.",
  },
];

export type Venue = {
  /** Which day of the celebration happens here. */
  day: string;
  name: string;
  /** Search text for the Google Maps "Get Directions" link. */
  mapsQuery: string;
};

export const venues: Venue[] = [
  { day: "Friday", name: "Villa Pizzo", mapsQuery: "Villa Pizzo, Italy" },
  {
    day: "Saturday",
    name: "Castello Durini",
    mapsQuery: "Castello Durini, Italy",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What should I wear?",
    answer:
      "Each event has its own dress code listed on the Schedule. The first day is black-tie optional and the second day is Indian formal. We've also included some pictures for inspiration under Dress Code. When in doubt, dress to impress!",
  },
  {
    question: "Can I bring a plus-one?",
    answer:
      "Your invitation will specify the number of guests in your party. If you have questions, please reach out to us directly.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "As much as we love your little ones, we've decided to keep our celebration an adults-only affair, except for those specifically included on your invitation. We hope this gives you a chance to relax and celebrate with us!",
  },
  {
    question: "What's the weather like?",
    answer:
      "September on Lake Como is warm and sunny by day (mid 70s°F) and cool in the evening (upper 50s°F). Most wedding events will take place outdoors.",
  },
  {
    question: "When should I RSVP by?",
    answer: "Please send your response no later than August 1, 2027.",
  },
  {
    question: "Are pets allowed?",
    answer:
      "Our wedding venues have strict restrictions on pets. Only pets of the bride and groom are allowed.",
  },
];

/**
 * Venmo username for gifts (without the @). Replace with your real handle —
 * the Registry section links to venmo.com/u/<handle>.
 */
export const venmoHandle = "Sophia-Zheng-1";

/** Deadline shown on the RSVP form. */
export const rsvpDeadline = "August 1, 2027";
