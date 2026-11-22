# Launch kit

Everything you need to post Àdùn on LinkedIn, TikTok and Instagram. Replace `[link]` with your deployed URL and adjust the voice so it sounds like you.

---

## 1. Shot list (30–40 s, works for all three)

Record from the deployed site (or `npm run build && npm start`) so it's buttery. Add `?demo=slow` when you want the table to spin by itself.

| Time | Shot | On-screen text (TikTok / Reels) |
| --- | --- | --- |
| 0–3 s | Preloader → table spins into place → "Party Jollof" rises | *Restaurant websites show you a menu.* |
| 3–7 s | Drag the lazy-Susan: Jollof → Tonkotsu → Egusi. Let the background shift. | *This one spins.* |
| 7–10 s | Pause on a dish: steam + callouts drawing in | *Steam. Ingredients. Before you order.* |
| 10–15 s | Scroll into "Anatomy of a party jollof", rice raining onto the plate | *Built grain by grain* |
| 15–20 s | The Belt: hover to slow it, grab 2–3 plates, the stack grows | *Sushi + small chops on a belt* |
| 20–25 s | Dish builder: switch swallow / add moi moi / crank the heat | *Every option redraws the plate* |
| 25–30 s | Checkout → order tracker, rider crosses the map, confetti | *…and you can track the rider* |
| 30–35 s | Tap the envelope → floor plan → wax seal stamps shut | *Even the reservation is an invitation.* |
| End | Logo + `[link]` | *Link in bio* |

**Tips:** 60 fps, cursor small or hidden, one action per beat, no fast scrolling (it reads as jitter on phones). For vertical, Chrome DevTools at **390×844**.

---

## 2. LinkedIn

> Post the 1080×1350 (or 16:9) video natively, then put the link in the **first comment**. LinkedIn throttles posts with outbound links in the body.

**𝗠𝗼𝘀𝘁 𝗿𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁 𝘄𝗲𝗯𝘀𝗶𝘁𝗲𝘀 𝘀𝗵𝗼𝘄 𝘆𝗼𝘂 𝗮 𝗺𝗲𝗻𝘂. 𝗜 𝘄𝗮𝗻𝘁𝗲𝗱 𝘁𝗵𝗶𝘀 𝗼𝗻𝗲 𝘁𝗼 𝗺𝗮𝗸𝗲 𝘆𝗼𝘂 𝗵𝘂𝗻𝗴𝗿𝘆.**

Meet Àdùn (Yoruba for *deliciousness*), a concept restaurant where party jollof, egusi and suya share one revolving table with tonkotsu, carbonara and margherita.

What's happening in the video:

→ A wooden lazy-Susan of signature plates. Spin it and the whole scene shifts with you: colour, city, price, heat.
→ Steam rising off the plate, and ingredient callouts that draw themselves in so you know what's in it before you order.
→ A scroll section that builds a plate of party jollof grain by grain, bottom-pot smoke included.
→ A conveyor belt of sushi and Naija small chops. Grab a plate and it stacks up like a real kaiten bar.
→ A dish builder where choosing eba over pounded yam actually changes the drawing.
→ Checkout, live order tracking with a rider crossing Lagos, and a reservation that seals itself with wax.

How I approached it:

1. Start with one feeling: "make the menu feel alive and make people hungry."
2. Pick one big idea, the revolving table, and protect it.
3. Draw every dish in code (SVG) so lighting and angle match, then animate the ingredients separately.
4. Layer the motion: table first, then steam, then callouts, then the small delights. One star per moment.

Built with Next.js, GSAP and a lot of jollof-related research.

Live link in the comments 👇
What would you add to make it even more mouth-watering?

#webdesign #uxdesign #frontend #gsap #nextjs #nigeria #lagos #creativedevelopment

*First comment:* `Try it here (best on desktop, but the phone version spins too): [link]`

---

## 3. TikTok

**Caption** (keep it short; the video carries it):

> POV: the restaurant website spins 🍛🍜 Party jollof → tonkotsu → egusi on a lazy-Susan, sushi on a belt, and a wax-sealed reservation. Link in bio. #webdesign #frontend #gsap #nigeriantiktok #jollof #uidesign #creativecoding

**Hooks to test** (first 1.5 s text on screen):
- "Restaurant websites are boring. So I built this."
- "I made a website that spins like a lazy-Susan"
- "Rate this restaurant website 1–10 🇳🇬"

**Pinned comment:** `Full site: [link] (try dragging the table)`

---

## 4. Instagram

**Reel caption:**

> Most restaurant sites show you a menu. This one serves it.
>
> Àdùn, a concept I designed and built: a revolving table of Naija classics and world favourites, steam on every plate, a sushi + small chops belt, a dish builder that redraws your plate, live rider tracking and a wax-sealed reservation. 🍛🍣🍝
>
> Link in bio. Which dish are you spinning to first?
>
> #webdesign #uiux #gsap #nextjs #creativedeveloper #lagos #naijafood #jollof #interactiondesign

**Carousel (if you also post stills), 1080×1350:**
1. Hero with the share card (`docs/screens/share-card.png`): "Most restaurant sites show you a menu."
2. Lazy-Susan close-up: "Spin the table. The scene shifts with you."
3. Anatomy of a party jollof: "Built grain by grain."
4. The Belt: "Sushi & small chops. Grab, stack, repeat."
5. Dish builder: "Eba or pounded yam? The plate changes."
6. Reservation sealed: "Even the booking is an invitation. Link in bio."

**Story:** a 10 s clip of the belt plus a link sticker to `[link]`.

---

## 5. Before you post

- [ ] Set `author.name` / `author.url` in `src/lib/site.ts` (the footer links to you)
- [ ] Set `site.url` to the real domain so the share card resolves
- [ ] Paste the link into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to warm the preview
- [ ] Open the link on your phone once before posting
