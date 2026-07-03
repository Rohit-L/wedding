/**
 * Single source of truth for all wedding content.
 *
 * This is template/placeholder data — replace the values below with your real
 * details. Everything on the site reads from this file, so you only edit here.
 */

export const couple = {
  partnerOne: "Rohit",
  partnerTwo: "Sophia",
  /** Used in <title>, hero, and footer. */
  combined: "Rohit & Sophia",
  hashtag: "#RohitAndSophia",
} as const;

export const wedding = {
  /** ISO 8601 with timezone — drives the countdown timer. */
  dateISO: "2026-09-12T16:30:00-07:00",
  dateLong: "Saturday, September 12, 2026",
  dateShort: "09 . 12 . 26",
  city: "Lake Como, Italy",
  venueName: "Villa Serena",
} as const;

/**
 * Full-bleed hero background photo, e.g. `/images/hero.jpg` (drop the file
 * in `public/images/`). Leave empty for an elegant placeholder gradient
 * until you have a real photo to use.
 */
export const heroImage: string = "";

export type WeddingEvent = {
  id: string;
  day: string;
  date: string;
  name: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  description: string;
};

export const events: WeddingEvent[] = [
  {
    id: "mehndi",
    day: "Friday",
    date: "September 11, 2026",
    name: "Mehndi & Henna Afternoon",
    time: "2:00 PM – 5:00 PM",
    venue: "The Garden Courtyard",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Casual & colorful",
    description:
      "Join us for an afternoon of henna, music, and sweets to kick off the celebration. Come relaxed and ready to be adorned.",
  },
  {
    id: "sangeet",
    day: "Friday",
    date: "September 11, 2026",
    name: "Sangeet & Welcome Dinner",
    time: "7:00 PM – 11:00 PM",
    venue: "The Grand Pavilion",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Festive cocktail",
    description:
      "A night of music, dancing, and dinner as our families come together. Expect performances, toasts, and a full dance floor.",
  },
  {
    id: "ceremony",
    day: "Saturday",
    date: "September 12, 2026",
    name: "Wedding Ceremony",
    time: "4:30 PM – 5:30 PM",
    venue: "The Lakeside Terrace",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Formal / black-tie optional",
    description:
      "The moment we say 'I do', overlooking the lake at golden hour. Please be seated by 4:15 PM.",
  },
  {
    id: "cocktails",
    day: "Saturday",
    date: "September 12, 2026",
    name: "Cocktail Hour",
    time: "5:30 PM – 6:30 PM",
    venue: "The Olive Grove",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Formal / black-tie optional",
    description:
      "Signature cocktails and hors d'oeuvres while we capture a few photos. Mingle, sip, and find your seat.",
  },
  {
    id: "reception",
    day: "Saturday",
    date: "September 12, 2026",
    name: "Dinner & Reception",
    time: "6:30 PM – 12:00 AM",
    venue: "The Grand Pavilion",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Formal / black-tie optional",
    description:
      "Dinner, dancing, and a few surprises. Stay late — the best part of the night is always after dessert.",
  },
  {
    id: "brunch",
    day: "Sunday",
    date: "September 13, 2026",
    name: "Farewell Brunch",
    time: "10:00 AM – 1:00 PM",
    venue: "The Garden Courtyard",
    address: "Via Regina 12, Lake Como, Italy",
    dressCode: "Casual",
    description:
      "One last meal together before you head home. Drop in any time — coffee, pastries, and goodbyes.",
  },
];

export type EngagementPhoto = {
  id: string;
  caption: string;
  /**
   * Path to the photo, e.g. `/images/engagement/01.jpg` (add files under
   * `public/images/engagement/`). Leave unset to show an elegant placeholder
   * frame with just the caption until you have a real photo to drop in.
   */
  src?: string;
};

export const engagementPhotos: EngagementPhoto[] = [
  { id: "1", caption: "Where it all began" },
  { id: "2", caption: "Adventures together" },
  { id: "3", caption: "Golden hour" },
  { id: "4", caption: "Just the two of us" },
  { id: "5", caption: "Silly & in love" },
  { id: "6", caption: "The proposal" },
];

export type StoryMoment = {
  year: string;
  title: string;
  description: string;
};

export const story: StoryMoment[] = [
  {
    year: "2018",
    title: "How we met",
    description:
      "We were introduced by mutual friends at a rooftop dinner in San Francisco and talked until the restaurant closed.",
  },
  {
    year: "2020",
    title: "Our first trip",
    description:
      "A spontaneous road trip up the coast turned into our favorite tradition and the start of a hundred more adventures.",
  },
  {
    year: "2023",
    title: "Moving in",
    description:
      "We adopted a very opinionated cat, filled our kitchen with too many cookbooks, and made a home together.",
  },
  {
    year: "2025",
    title: "The proposal",
    description:
      "On a quiet evening on the shores of Lake Como — the same place we'll say our vows — we said yes to forever.",
  },
];

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

export type Hotel = {
  name: string;
  description: string;
  distance: string;
  bookingNote: string;
};

export const hotels: Hotel[] = [
  {
    name: "Hotel Lago Grande",
    description:
      "Our room block is here, a short shuttle ride from the venue. Mention 'Rohit & Sophia' when booking.",
    distance: "5 min from venue",
    bookingNote: "Group rate ends August 1, 2026",
  },
  {
    name: "Villa Flora Inn & Spa",
    description:
      "A boutique option with a spa and pool, ideal for a longer lakeside weekend.",
    distance: "12 min from venue",
    bookingNote: "Limited rooms — book early",
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
      "Each event has its own dress code listed on the Schedule. The ceremony and reception are formal / black-tie optional. When in doubt, dress to celebrate!",
  },
  {
    question: "Can I bring a plus-one?",
    answer:
      "Your invitation will specify the number of guests in your party. If you have questions, please reach out to us directly.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "We love your little ones! There's a kids' meal option on the RSVP form. Let us know in your response so we can plan accordingly.",
  },
  {
    question: "Is there parking?",
    answer:
      "Yes, complimentary valet and self-parking are available at the venue. We'll also run a shuttle from the room-block hotel.",
  },
  {
    question: "What's the weather like?",
    answer:
      "September on Lake Como is warm and sunny by day (mid 70s°F) and cool in the evening (upper 50s°F). Bring a light layer for the night.",
  },
  {
    question: "When should I RSVP by?",
    answer: "Please send your response no later than August 1, 2026.",
  },
  {
    question: "Are pets allowed?",
    answer: "Only Coco.",
  },
];

export type RegistryItem = {
  name: string;
  description: string;
  url: string;
};

export const registry: RegistryItem[] = [
  {
    name: "Our Honeymoon Fund",
    description: "Help us toast to married life on our honeymoon in Greece.",
    url: "#",
  },
  {
    name: "The Home Registry",
    description: "A few things we're excited about for our new home together.",
    url: "#",
  },
  {
    name: "A Charitable Gift",
    description: "Prefer to give back? Donate to a cause close to our hearts.",
    url: "#",
  },
];

/** Deadline shown on the RSVP form. */
export const rsvpDeadline = "August 1, 2026";
