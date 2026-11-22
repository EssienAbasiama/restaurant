import type { StaticImageData } from "next/image";
import { img } from "./images";

export type Opts = Record<string, string | string[]>;

export type Choice = { id: string; label: string; price?: number; note?: string };
export type OptionGroup = {
  id: string;
  label: string;
  hint?: string;
  type: "single" | "multi";
  choices: Choice[];
  default: string | string[];
};

export type Callout = { x: number; y: number; label: string; note: string };

export type Signature = {
  slug: string;
  name: string;
  short: string;
  region: "naija" | "world";
  origin: { city: string; country: string; coords: string };
  tagline: string;
  story: string;
  price: number;
  heat: 0 | 1 | 2 | 3;
  time: string;
  kcal: number;
  theme: { bg: string; accent: string; deep: string; glow: string };
  callouts: Callout[];
  photo?: StaticImageData;
  options: OptionGroup[];
  pairs: string[];
};

const spice = (labels = ["Mild", "Medium", "Naija hot", "Ata rodo overload"]): OptionGroup => ({
  id: "spice",
  label: "Heat",
  hint: "Our pepper is not playing.",
  type: "single",
  default: "1",
  choices: labels.map((label, i) => ({ id: String(i), label })),
});

const swallow = (def: string): OptionGroup => ({
  id: "swallow",
  label: "Swallow",
  hint: "Hand-pounded and moulded to order.",
  type: "single",
  default: def,
  choices: [
    { id: "pounded-yam", label: "Pounded yam" },
    { id: "eba", label: "Eba" },
    { id: "amala", label: "Amala" },
    { id: "semo", label: "Semovita" },
    { id: "fufu", label: "Fufu" },
  ],
});

export const signatures: Signature[] = [
  {
    slug: "party-jollof",
    name: "Party Jollof",
    short: "Jollof",
    region: "naija",
    origin: { city: "Lagos", country: "Nigeria", coords: "6.5244° N, 3.3792° E" },
    tagline: "Smoky, owambe-style jollof with the bottom-pot char everyone fights for.",
    story:
      "Long-grain rice cooked low and slow in a fried ata base of tomatoes, tatashe and scotch bonnet, then left to kiss the bottom of the pot until the whole room smells like a Saturday party.",
    price: 13500,
    heat: 2,
    time: "15 min",
    kcal: 860,
    theme: { bg: "#F7DCC6", accent: "#D2461B", deep: "#4F1707", glow: "#FFB37A" },
    callouts: [
      { x: 118, y: 262, label: "Party smoke", note: "Bottom-pot char, on purpose" },
      { x: 296, y: 132, label: "Dodo", note: "Ripe plantain, fried to amber" },
      { x: 292, y: 262, label: "Peppered chicken", note: "Marinated overnight in ata rodo" },
      { x: 150, y: 160, label: "Bay leaf", note: "The quiet hero" },
    ],
    photo: img.chickenJollof,
    options: [
      {
        id: "protein",
        label: "Protein",
        type: "single",
        default: "chicken",
        choices: [
          { id: "chicken", label: "Peppered chicken" },
          { id: "turkey", label: "Peppered turkey", price: 2500 },
          { id: "fish", label: "Grilled croaker", price: 3500 },
        ],
      },
      {
        id: "extras",
        label: "On the side",
        type: "multi",
        default: [],
        choices: [
          { id: "dodo", label: "Extra dodo", price: 1500 },
          { id: "moimoi", label: "Moi moi", price: 1800 },
          { id: "egg", label: "Boiled egg", price: 600 },
        ],
      },
      spice(),
    ],
    pairs: ["zobo", "chapman", "puff-puff"],
  },
  {
    slug: "tonkotsu",
    name: "Tonkotsu Ramen",
    short: "Tonkotsu",
    region: "world",
    origin: { city: "Tokyo", country: "Japan", coords: "35.6762° N, 139.6503° E" },
    tagline: "Eighteen-hour pork bone broth, silky as velvet and twice as rich.",
    story:
      "Pork bones rolled at a hard boil for eighteen hours until the broth turns opaque and creamy, poured over springy noodles, torched chashu and a soy-cured egg with a molten middle.",
    price: 16500,
    heat: 0,
    time: "10 min",
    kcal: 920,
    theme: { bg: "#EFE6D6", accent: "#A12C22", deep: "#261611", glow: "#FFD9A0" },
    callouts: [
      { x: 150, y: 128, label: "Ajitama", note: "6½-minute soy-cured egg" },
      { x: 302, y: 196, label: "Chashu", note: "Rolled pork belly, torched" },
      { x: 236, y: 300, label: "18-hour broth", note: "Pork bone, boiled hard" },
      { x: 108, y: 238, label: "Noodles", note: "Thin, springy, made daily" },
    ],
    photo: img.tonkotsu,
    options: [
      {
        id: "broth",
        label: "Broth",
        type: "single",
        default: "classic",
        choices: [
          { id: "classic", label: "Classic" },
          { id: "black", label: "Black garlic", price: 800 },
          { id: "red", label: "Red fire", price: 800 },
        ],
      },
      {
        id: "firmness",
        label: "Noodle firmness",
        type: "single",
        default: "katame",
        choices: [
          { id: "barikata", label: "Barikata" },
          { id: "katame", label: "Katame" },
          { id: "futsu", label: "Futsū" },
          { id: "yawame", label: "Yawame" },
        ],
      },
      {
        id: "extras",
        label: "Toppings",
        type: "multi",
        default: [],
        choices: [
          { id: "chashu", label: "Extra chashu", price: 3000 },
          { id: "egg", label: "Ajitama", price: 1200 },
          { id: "nori", label: "Nori", price: 600 },
          { id: "corn", label: "Corn & butter", price: 1500 },
        ],
      },
      spice(["None", "A kick", "Hot", "Tokyo fire"]),
    ],
    pairs: ["gyoza", "matcha", "sake"],
  },
  {
    slug: "egusi",
    name: "Egusi & Pounded Yam",
    short: "Egusi",
    region: "naija",
    origin: { city: "Enugu", country: "Nigeria", coords: "6.4584° N, 7.5464° E" },
    tagline: "Melon-seed soup thick enough to stand a spoon in, with assorted meat.",
    story:
      "Ground melon seeds fried in palm oil until they bloom into soft curds, folded with ugu leaves, stockfish and a proper assorted: shaki, ponmo and beef. Served in a calabash with swallow pounded to order.",
    price: 15000,
    heat: 1,
    time: "12 min",
    kcal: 1040,
    theme: { bg: "#F1E5BF", accent: "#B7741A", deep: "#3F2C0B", glow: "#FFD86E" },
    callouts: [
      { x: 296, y: 132, label: "Pounded yam", note: "Pounded to order, never from a pack" },
      { x: 112, y: 258, label: "Egusi curds", note: "Melon seeds, fried till fluffy" },
      { x: 186, y: 206, label: "Assorted", note: "Shaki, ponmo & beef" },
      { x: 128, y: 168, label: "Ugu", note: "Fluted pumpkin leaves" },
    ],
    photo: img.egusi,
    options: [
      swallow("pounded-yam"),
      {
        id: "extras",
        label: "Add to the pot",
        type: "multi",
        default: [],
        choices: [
          { id: "stockfish", label: "Stockfish", price: 2500 },
          { id: "goat", label: "Goat meat", price: 3000 },
          { id: "ponmo", label: "Extra ponmo", price: 1200 },
        ],
      },
      spice(),
    ],
    pairs: ["zobo", "pepper-soup", "dodo"],
  },
  {
    slug: "carbonara",
    name: "Carbonara",
    short: "Carbonara",
    region: "world",
    origin: { city: "Rome", country: "Italy", coords: "41.9028° N, 12.4964° E" },
    tagline: "Guanciale, pecorino, yolk and pepper. No cream. Ever.",
    story:
      "Bronze-cut pasta tossed off the heat with whipped yolks, Pecorino Romano and the rendered fat of crisp guanciale until it turns glossy. Finished with pepper toasted in the pan.",
    price: 17500,
    heat: 0,
    time: "12 min",
    kcal: 780,
    theme: { bg: "#F3ECD7", accent: "#B98419", deep: "#33240E", glow: "#FFE08A" },
    callouts: [
      { x: 252, y: 140, label: "Guanciale", note: "Cured pork cheek, crisped" },
      { x: 150, y: 150, label: "Pecorino Romano", note: "Aged 8 months" },
      { x: 236, y: 262, label: "No cream", note: "Yolks & pasta water only" },
      { x: 140, y: 250, label: "Black pepper", note: "Toasted & cracked" },
    ],
    photo: img.carbonara,
    options: [
      {
        id: "pasta",
        label: "Pasta",
        type: "single",
        default: "spaghetti",
        choices: [
          { id: "spaghetti", label: "Spaghetti" },
          { id: "rigatoni", label: "Rigatoni" },
        ],
      },
      {
        id: "extras",
        label: "Make it extra",
        type: "multi",
        default: [],
        choices: [
          { id: "guanciale", label: "Extra guanciale", price: 2500 },
          { id: "yolk", label: "Cured yolk on top", price: 800 },
          { id: "truffle", label: "Shaved truffle", price: 6000 },
        ],
      },
      spice(["Light", "Classic", "Roman", "Pepper storm"]),
    ],
    pairs: ["tiramisu", "palm-spritz", "cacio-e-pepe"],
  },
  {
    slug: "suya",
    name: "Kano Suya",
    short: "Suya",
    region: "naija",
    origin: { city: "Kano", country: "Nigeria", coords: "12.0022° N, 8.5920° E" },
    tagline: "Flame-kissed beef in an eleven-spice yaji, served on newspaper like it should be.",
    story:
      "Thin-cut beef rubbed with our yaji (roasted groundnut, ginger, cayenne and eight more), grilled over open coals and handed over on newspaper with raw red onion, tomato and cabbage.",
    price: 12000,
    heat: 2,
    time: "14 min",
    kcal: 640,
    theme: { bg: "#ECD8C3", accent: "#902F13", deep: "#33140A", glow: "#FFB070" },
    callouts: [
      { x: 304, y: 286, label: "Yaji", note: "11 spices, groundnut-dusted" },
      { x: 196, y: 196, label: "Suya", note: "Thin-cut, coal-grilled" },
      { x: 118, y: 138, label: "Red onion", note: "Raw, sharp, essential" },
      { x: 290, y: 128, label: "Tomato", note: "To cool the fire. Slightly." },
    ],
    photo: img.suyaGrill,
    options: [
      {
        id: "meat",
        label: "Meat",
        type: "single",
        default: "beef",
        choices: [
          { id: "beef", label: "Beef" },
          { id: "chicken", label: "Chicken" },
          { id: "ram", label: "Ram", price: 3000 },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        type: "multi",
        default: [],
        choices: [
          { id: "kilishi", label: "Kilishi strips", price: 2000 },
          { id: "yam", label: "Fried yam", price: 2000 },
          { id: "onions", label: "Extra onions", price: 300 },
        ],
      },
      spice(),
    ],
    pairs: ["chapman", "zobo", "dodo"],
  },
  {
    slug: "margherita",
    name: "Margherita",
    short: "Margherita",
    region: "world",
    origin: { city: "Naples", country: "Italy", coords: "40.8518° N, 14.2681° E" },
    tagline: "48-hour dough, 90 seconds at 485°C, leopard spots and all.",
    story:
      "Cold-fermented dough stretched by hand, San Marzano tomatoes crushed with sea salt, torn fior di latte and basil, blistered in our wood-fired oven for ninety seconds.",
    price: 14000,
    heat: 0,
    time: "8 min",
    kcal: 820,
    theme: { bg: "#F3DCD4", accent: "#C0321D", deep: "#3D120A", glow: "#FFB59A" },
    callouts: [
      { x: 342, y: 236, label: "Leopard crust", note: "485°C, 90 seconds" },
      { x: 200, y: 200, label: "Fior di latte", note: "Torn by hand" },
      { x: 128, y: 262, label: "San Marzano", note: "Crushed with sea salt" },
      { x: 262, y: 128, label: "Basil", note: "Added after the fire" },
    ],
    photo: img.margherita,
    options: [
      {
        id: "size",
        label: "Size",
        type: "single",
        default: "12",
        choices: [
          { id: "10", label: '10"' },
          { id: "12", label: '12"', price: 3500 },
        ],
      },
      {
        id: "extras",
        label: "Toppings",
        type: "multi",
        default: [],
        choices: [
          { id: "burrata", label: "Burrata", price: 4000 },
          { id: "nduja", label: "Nduja", price: 2500 },
          { id: "honey", label: "Scotch bonnet honey", price: 1500 },
        ],
      },
      spice(["None", "Chilli flakes", "Hot", "Inferno"]),
    ],
    pairs: ["palm-spritz", "tiramisu", "burger"],
  },
  {
    slug: "afang",
    name: "Afang Soup",
    short: "Afang",
    region: "naija",
    origin: { city: "Calabar", country: "Nigeria", coords: "4.9757° N, 8.3417° E" },
    tagline: "Hand-shredded okazi and waterleaf, periwinkles and palm oil, Calabar style.",
    story:
      "Okazi leaves shredded paper-thin by hand and simmered with waterleaf, periwinkles, kpomo, beef and dried fish in palm oil, the way Calabar mothers have cooked it for generations.",
    price: 16000,
    heat: 1,
    time: "12 min",
    kcal: 980,
    theme: { bg: "#DDE6D0", accent: "#2F5C2A", deep: "#13240F", glow: "#C9E58A" },
    callouts: [
      { x: 152, y: 178, label: "Okazi & waterleaf", note: "Hand-shredded, paper-thin" },
      { x: 226, y: 252, label: "Periwinkles", note: "From the creeks, cleaned twice" },
      { x: 84, y: 250, label: "Palm oil", note: "Red, fragrant, unrefined" },
      { x: 300, y: 104, label: "Fufu", note: "Fermented cassava, smooth" },
    ],
    options: [
      swallow("fufu"),
      {
        id: "extras",
        label: "Add to the pot",
        type: "multi",
        default: [],
        choices: [
          { id: "snail", label: "Giant snail", price: 4500 },
          { id: "stockfish", label: "Stockfish", price: 2500 },
          { id: "periwinkle", label: "Extra periwinkles", price: 1200 },
        ],
      },
      spice(),
    ],
    pairs: ["pepper-soup", "zobo", "puff-puff"],
  },
  {
    slug: "asado",
    name: "Asado Ribeye",
    short: "Asado",
    region: "world",
    origin: { city: "Buenos Aires", country: "Argentina", coords: "34.6037° S, 58.3816° W" },
    tagline: "28-day dry-aged ribeye off the coals, sliced, with chimichurri.",
    story:
      "A thick-cut, 28-day dry-aged ribeye cooked over hardwood coals, rested, sliced against the grain and finished with flaky salt and a bright, garlicky chimichurri.",
    price: 32000,
    heat: 1,
    time: "20 min",
    kcal: 1120,
    theme: { bg: "#E7DED5", accent: "#7A2A1C", deep: "#24130E", glow: "#FFB28F" },
    callouts: [
      { x: 214, y: 186, label: "Dry-aged ribeye", note: "28 days, sliced to order" },
      { x: 288, y: 268, label: "Chimichurri", note: "Parsley, garlic, chilli, vinegar" },
      { x: 120, y: 290, label: "Roast potatoes", note: "Duck-fat crisp" },
      { x: 300, y: 118, label: "Charred lemon", note: "Squeeze over everything" },
    ],
    photo: img.steak,
    options: [
      {
        id: "doneness",
        label: "Doneness",
        type: "single",
        default: "medium-rare",
        choices: [
          { id: "rare", label: "Rare" },
          { id: "medium-rare", label: "Medium rare" },
          { id: "medium", label: "Medium" },
          { id: "well", label: "Well done", note: "We'll allow it." },
        ],
      },
      {
        id: "side",
        label: "Side",
        type: "single",
        default: "potatoes",
        choices: [
          { id: "potatoes", label: "Roast potatoes" },
          { id: "fries", label: "Fries" },
          { id: "dodo", label: "Dodo" },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        type: "multi",
        default: [],
        choices: [
          { id: "marrow", label: "Bone marrow butter", price: 3500 },
          { id: "chimi", label: "Extra chimichurri", price: 800 },
        ],
      },
      spice(["Mild", "Medium", "Hot", "Argentine-Naija"]),
    ],
    pairs: ["palm-spritz", "salmon", "sake"],
  },
];

export const signatureBySlug = (slug: string) => signatures.find((s) => s.slug === slug);

export const defaultOpts = (s: Signature): Opts =>
  Object.fromEntries(s.options.map((g) => [g.id, Array.isArray(g.default) ? [...g.default] : g.default]));

export const priceFor = (s: Signature, o: Opts) => {
  let total = s.price;
  for (const g of s.options) {
    const v = o[g.id];
    const ids = Array.isArray(v) ? v : [v];
    for (const id of ids) total += g.choices.find((c) => c.id === id)?.price ?? 0;
  }
  return total;
};

export const describeOpts = (s: Signature, o: Opts) =>
  s.options
    .flatMap((g) => {
      const v = o[g.id];
      const ids = Array.isArray(v) ? v : [v];
      return ids
        .filter((id) => id !== g.default || g.type === "single")
        .map((id) => g.choices.find((c) => c.id === id)?.label)
        .filter(Boolean)
        .map((l) => (g.id === "spice" ? `${l} heat` : l));
    })
    .join(" · ");

/* ------------------------------------------------------------------ */

export type Category = "naija" | "world" | "small-chops" | "sweets" | "drinks";
export type Tag = "spicy" | "veg" | "seafood" | "share" | "new";

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: Category;
  tags: Tag[];
  image: StaticImageData;
  origin: string;
};

export const categories: { id: Category | "signature" | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "signature", label: "The Table" },
  { id: "naija", label: "Naija classics" },
  { id: "world", label: "Around the world" },
  { id: "small-chops", label: "Small chops & sides" },
  { id: "sweets", label: "Sweet things" },
  { id: "drinks", label: "Drinks" },
];

export const menu: MenuItem[] = [
  { id: "puff-puff", name: "Puff-Puff", desc: "Six warm, pillowy dough balls, dusted with sugar. Dangerously poppable.", price: 3500, category: "small-chops", tags: ["veg", "share"], image: img.puffPuff, origin: "Lagos" },
  { id: "dodo", name: "Dodo", desc: "Ripe plantain fried until the edges caramelise. Order two.", price: 3000, category: "small-chops", tags: ["veg"], image: img.dodo, origin: "Everywhere in Naija" },
  { id: "pepper-soup", name: "Seafood Pepper Soup", desc: "Clay-pot broth with prawns, fish, uziza and enough heat to clear your week.", price: 11500, category: "naija", tags: ["spicy", "seafood"], image: img.pepperSoup, origin: "Port Harcourt" },
  { id: "efo-riro", name: "Efo Riro & Swallow", desc: "Rich spinach stew with locust beans, assorted meat and pounded yam.", price: 14000, category: "naija", tags: ["spicy"], image: img.efoRiro, origin: "Ibadan" },
  { id: "rice-stew", name: "Rice & Obe Ata", desc: "Fluffy white rice, slow-fried pepper stew, boiled eggs and fried beef.", price: 10500, category: "naija", tags: ["spicy"], image: img.riceAndStew, origin: "Lagos" },
  { id: "jollof-croaker", name: "Jollof & Grilled Croaker", desc: "Party jollof with a whole charcoal-grilled croaker and pepper sauce.", price: 21000, category: "naija", tags: ["spicy", "seafood"], image: img.jollofGrilledFish, origin: "Lagos" },
  { id: "mixed-grill", name: "Mixed Suya Grill Board", desc: "Beef, chicken & gizzard skewers, grilled peppers, three dips. For sharing.", price: 22000, category: "naija", tags: ["spicy", "share"], image: img.suyaGrill, origin: "Kano" },
  { id: "obe-ata", name: "Assorted Obe Ata", desc: "A bowl of slow-fried pepper stew loaded with assorted meat. Bring bread.", price: 9500, category: "naija", tags: ["spicy"], image: img.obeAta, origin: "Abeokuta" },
  { id: "sunday-spread", name: "The Sunday Spread", desc: "Jollof, fried rice, plantain, chicken, salad and stew for four. Owambe at home.", price: 48000, category: "naija", tags: ["share"], image: img.naijaSpread, origin: "Lagos" },
  { id: "croaker-dodo", name: "Croaker & Dodo", desc: "Whole grilled croaker, sweet dodo, pickled red onion and lime.", price: 18500, category: "naija", tags: ["seafood"], image: img.fishPlantain, origin: "Port Harcourt" },
  { id: "burger", name: "Suya Smash Burger", desc: "Double smash patty, suya mayo, pickled onions, brioche. Fusion that works.", price: 12500, category: "world", tags: ["spicy", "new"], image: img.burger, origin: "Lagos × New York" },
  { id: "salmon", name: "Miso Salmon", desc: "Miso-glazed salmon, charred greens and a citrus-ginger dressing.", price: 24000, category: "world", tags: ["seafood"], image: img.salmon, origin: "Kyoto" },
  { id: "shrimp-ramen", name: "Spicy Shrimp Shoyu", desc: "Shoyu ramen, garlic prawns, jammy egg and chilli oil.", price: 17000, category: "world", tags: ["spicy", "seafood"], image: img.ramenShrimp, origin: "Tokyo" },
  { id: "cacio-e-pepe", name: "Cacio e Pepe", desc: "Tonnarelli, pecorino and a whole lot of toasted black pepper.", price: 15500, category: "world", tags: ["veg"], image: img.cacioEPepe, origin: "Rome" },
  { id: "pepperoni", name: "Pepperoni & Hot Honey", desc: "Wood-fired, cup-and-char pepperoni, scotch bonnet honey.", price: 16000, category: "world", tags: ["spicy"], image: img.pizzaBoard, origin: "Naples × Lagos" },
  { id: "maki-board", name: "Chef's Maki Board", desc: "Twelve pieces of the chef's maki, rolled at the belt.", price: 19000, category: "world", tags: ["seafood", "share"], image: img.sushiBoard, origin: "Osaka" },
  { id: "sushi-boat", name: "Sushi Boat for Two", desc: "Nigiri, maki and uramaki on a wooden boat. Sail it to your table.", price: 38000, category: "world", tags: ["seafood", "share"], image: img.sushiBoat, origin: "Osaka" },
  { id: "gyoza", name: "Pan-fried Gyoza", desc: "Six crisp-bottomed pork gyoza with black vinegar and chilli.", price: 7500, category: "small-chops", tags: ["share"], image: img.gyoza, origin: "Utsunomiya" },
  { id: "takoyaki", name: "Takoyaki", desc: "Octopus balls, okonomi sauce, kewpie and dancing bonito.", price: 7000, category: "small-chops", tags: ["seafood"], image: img.takoyaki, origin: "Osaka" },
  { id: "tiramisu", name: "Tiramisu", desc: "Savoiardi soaked in espresso and Kahlúa, mascarpone, cocoa.", price: 6500, category: "sweets", tags: ["veg"], image: img.tiramisu, origin: "Treviso" },
  { id: "mochi", name: "Grilled Mochi", desc: "Charcoal-grilled rice cakes, brushed with soy-caramel.", price: 5000, category: "sweets", tags: ["veg"], image: img.mochi, origin: "Kyoto" },
  { id: "puff-puff-sugar", name: "Puff-Puff Sundae", desc: "Warm puff-puff, vanilla ice cream, zobo syrup and toasted coconut.", price: 6000, category: "sweets", tags: ["veg", "new"], image: img.puffPuff2, origin: "Lagos" },
  { id: "zobo", name: "Zobo", desc: "Chilled hibiscus with ginger, clove and pineapple peel.", price: 2500, category: "drinks", tags: ["veg"], image: img.zobo, origin: "Kaduna" },
  { id: "chapman", name: "Chapman", desc: "Nigeria's favourite mocktail: citrus, grenadine, cucumber and bitters.", price: 3500, category: "drinks", tags: ["veg"], image: img.chapman, origin: "Lagos" },
  { id: "matcha", name: "Iced Matcha Latte", desc: "Ceremonial matcha, oat milk, a touch of honey.", price: 4000, category: "drinks", tags: ["veg"], image: img.matcha, origin: "Uji" },
  { id: "sake", name: "Sake Flight", desc: "Three pours, from crisp to cloudy. Kanpai.", price: 9000, category: "drinks", tags: [], image: img.sake, origin: "Niigata" },
  { id: "palm-spritz", name: "Palm Wine Spritz", desc: "Fresh palm wine, Aperol, prosecco and orange. Our house spritz.", price: 6500, category: "drinks", tags: ["new"], image: img.cocktailBar, origin: "Lagos × Venice" },
];

export const menuById = (id: string) => menu.find((m) => m.id === id);

/* ------------------------------------------------------------------ */

export type BeltTier = "green" | "blue" | "red" | "gold";
export const tiers: Record<BeltTier, { price: number; color: string; rim: string; label: string }> = {
  green: { price: 2500, color: "#3E8E5A", rim: "#2C6B42", label: "Green" },
  blue: { price: 3500, color: "#2F5FA8", rim: "#1F437E", label: "Blue" },
  red: { price: 4500, color: "#C3301E", rim: "#8E1F12", label: "Red" },
  gold: { price: 6000, color: "#D6A02A", rim: "#9E7212", label: "Gold" },
};

export type BeltKind =
  | "salmon-nigiri"
  | "tuna-nigiri"
  | "ebi-nigiri"
  | "tamago"
  | "salmon-maki"
  | "cucumber-maki"
  | "california"
  | "ikura"
  | "unagi"
  | "puff-puff"
  | "suya-stick"
  | "spring-rolls"
  | "samosa"
  | "meat-pie"
  | "gizdodo"
  | "chin-chin";

export type BeltItem = { id: BeltKind; name: string; tier: BeltTier; family: "sushi" | "chops" };

export const beltItems: BeltItem[] = [
  { id: "salmon-nigiri", name: "Salmon nigiri", tier: "blue", family: "sushi" },
  { id: "puff-puff", name: "Puff-puff ×3", tier: "green", family: "chops" },
  { id: "tuna-nigiri", name: "Tuna nigiri", tier: "red", family: "sushi" },
  { id: "suya-stick", name: "Suya skewer", tier: "blue", family: "chops" },
  { id: "california", name: "California roll", tier: "blue", family: "sushi" },
  { id: "gizdodo", name: "Gizdodo", tier: "red", family: "chops" },
  { id: "ikura", name: "Ikura gunkan", tier: "gold", family: "sushi" },
  { id: "samosa", name: "Samosa", tier: "green", family: "chops" },
  { id: "tamago", name: "Tamago", tier: "green", family: "sushi" },
  { id: "meat-pie", name: "Mini meat pie", tier: "green", family: "chops" },
  { id: "unagi", name: "Unagi nigiri", tier: "gold", family: "sushi" },
  { id: "spring-rolls", name: "Spring rolls", tier: "green", family: "chops" },
  { id: "salmon-maki", name: "Salmon maki", tier: "blue", family: "sushi" },
  { id: "chin-chin", name: "Chin chin", tier: "green", family: "chops" },
  { id: "ebi-nigiri", name: "Ebi nigiri", tier: "red", family: "sushi" },
  { id: "cucumber-maki", name: "Kappa maki", tier: "green", family: "sushi" },
];
