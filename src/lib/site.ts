/**
 * One place to rename, re-brand or re-attribute the whole site.
 * `author` powers the "Designed & built by" credit in the footer — set it to
 * your own name + LinkedIn so the people your post sends here can find you.
 */
export const site = {
  name: "Àdùn",
  ascii: "Adun",
  meaning: "Yoruba for deliciousness",
  tagline: "Lagos-born. World-fed.",
  description:
    "Àdùn is a (concept) Lagos restaurant where smoky party jollof, egusi and suya share one revolving table with tonkotsu, carbonara and a sushi belt.",
  url: "https://adun.example",
  address: ["Admiralty Way", "Lekki Phase 1, Lagos"],
  email: "hello@adun.example",
  hours: [
    { days: "Mon – Thu", time: "12:00 – 22:30" },
    { days: "Fri – Sat", time: "12:00 – 00:30" },
    { days: "Sunday", time: "13:00 – 22:00" },
  ],
  beltHours: "The Belt runs daily 12:00 – 17:00",
  author: {
    name: "Essien Abasiama",
    url: "https://essienabasiama.vercel.app",
  },
  socials: {
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    linkedin: "https://www.linkedin.com/",
  },
  vat: 0.075,
  freeDeliveryFrom: 40000,
} as const;
