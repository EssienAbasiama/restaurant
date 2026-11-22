"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, useGSAP, reducedMotion } from "@/lib/gsap";
import { categories, menu, signatures, type Category, type MenuItem, type Signature, type Tag } from "@/lib/menu";
import { money } from "@/lib/format";
import { useOrder } from "@/lib/useOrder";
import { DishArt } from "@/components/art/DishArt";
import { ArrowRight, Fish, Leaf, Pepper, Plus, Users } from "@/components/ui/icons";
import { TLink } from "@/components/shell/Transition";
import { enterDelay } from "@/components/shell/Transition";

type Filter = Category | "signature" | "all";

const TAGS: { id: Tag; label: string; Icon: (p: { size?: number }) => React.ReactNode }[] = [
  { id: "spicy", label: "Spicy", Icon: (p) => <Pepper {...p} /> },
  { id: "veg", label: "Veggie", Icon: (p) => <Leaf {...p} /> },
  { id: "seafood", label: "Seafood", Icon: (p) => <Fish {...p} /> },
  { id: "share", label: "For sharing", Icon: (p) => <Users {...p} /> },
];

const sigTags = (s: Signature): Tag[] => [
  ...(s.heat >= 2 ? (["spicy"] as Tag[]) : []),
  ...(["afang"].includes(s.slug) ? (["seafood"] as Tag[]) : []),
  ...(["suya"].includes(s.slug) ? (["share"] as Tag[]) : []),
];

function SignatureCard({ s }: { s: Signature }) {
  const { addSignature } = useOrder();
  const art = useRef<HTMLDivElement>(null);
  return (
    <article className="mcard group relative col-span-2 overflow-hidden rounded-[28px] p-5 sm:p-7" style={{ background: s.theme.bg }} data-flip-id={`sig-${s.slug}`}>
      <div className="flex h-full flex-col gap-5 sm:flex-row sm:items-center">
        <TLink href={`/menu/${s.slug}`} className="relative mx-auto block aspect-square w-[68%] shrink-0 sm:w-[46%]" aria-label={`Customize ${s.name}`}>
          <div className="absolute inset-[6%] rounded-full bg-black/20 blur-xl transition-transform duration-700 group-hover:scale-105" />
          <div ref={art} className="relative h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:rotate-[24deg] group-hover:scale-[1.04]">
            <DishArt slug={s.slug} className="h-full w-full" />
          </div>
        </TLink>
        <div className="flex flex-1 flex-col">
          <p className="eyebrow" style={{ color: s.theme.accent }}>
            {s.region === "naija" ? "Naija classic" : "Around the world"} · {s.origin.city}
          </p>
          <h3 className="display mt-2 text-[2.4rem] leading-[0.95]" style={{ color: s.theme.deep }}>
            {s.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{s.tagline}</p>
          <div className="mt-3 flex gap-0.5" style={{ color: s.theme.accent }} aria-label={`Heat ${s.heat} of 3`}>
            {[0, 1, 2].map((h) => (
              <Pepper key={h} size={16} filled={h < s.heat} className={h < s.heat ? "" : "opacity-30"} />
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="display text-3xl tabular-nums" style={{ color: s.theme.deep }}>
              {money(s.price)}
            </span>
            <div className="flex gap-2">
              <TLink href={`/menu/${s.slug}`} className="btn btn-ghost btn-sm" style={{ color: s.theme.deep }}>
                Customize
              </TLink>
              <button type="button" className="btn btn-primary btn-sm !px-3.5" aria-label={`Add ${s.name} to order`} onClick={() => addSignature(s, undefined, 1, art.current?.querySelector("svg"))}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useOrder();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <article className="mcard group flex flex-col" data-flip-id={item.id}>
      <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-paper-3">
        <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw" placeholder="blur" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-[1.07]" />
        <div className="absolute left-3 top-3 flex gap-1">
          {item.tags.includes("new") && <span className="rounded-full bg-palm px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-paper">New</span>}
          {item.tags.includes("spicy") && (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-paper/90 text-pepper" title="Spicy">
              <Pepper size={13} filled />
            </span>
          )}
          {item.tags.includes("veg") && (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-paper/90 text-leaf" title="Vegetarian">
              <Leaf size={13} />
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addItem(item, ref.current?.querySelector("img"))}
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink shadow-lg transition-all duration-300 hover:scale-110 hover:bg-ink hover:text-paper"
          aria-label={`Add ${item.name} to order`}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="display text-[1.45rem] leading-tight">{item.name}</h3>
          <p className="mt-1 text-sm leading-snug text-ink-2">{item.desc}</p>
          <p className="mt-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">{item.origin}</p>
        </div>
        <span className="shrink-0 pt-1 font-bold tabular-nums">{money(item.price)}</span>
      </div>
    </article>
  );
}

export function MenuView() {
  const root = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<Filter>("all");
  const [tags, setTags] = useState<Tag[]>([]);
  const flipState = useRef<Flip.FlipState | null>(null);

  const capture = () => {
    if (!reducedMotion()) flipState.current = Flip.getState(".mcard", { props: "opacity" });
  };

  const showSig = (s: Signature) => (cat === "all" || cat === "signature") && tags.every((t) => sigTags(s).includes(t));
  const showItem = (m: MenuItem) => (cat === "all" || cat === m.category) && tags.every((t) => m.tags.includes(t));
  const visibleCount = signatures.filter(showSig).length + menu.filter(showItem).length;

  useLayoutEffect(() => {
    const st = flipState.current;
    if (!st) return;
    flipState.current = null;
    Flip.from(st, {
      duration: 0.65,
      ease: "power3.inOut",
      stagger: 0.015,
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.03, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }),
    });
  }, [cat, tags]);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const d = enterDelay();
      gsap.from(".mh-char", { yPercent: 110, stagger: 0.04, duration: 1.1, ease: "expo.out", delay: d });
      gsap.from(".mh-fade", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8, delay: d + 0.3 });
      gsap.from(".mh-plate", { rotate: -120, scale: 0.6, autoAlpha: 0, stagger: 0.12, duration: 1.4, ease: "expo.out", delay: d + 0.1 });
      gsap.to(".mh-plate", { rotate: "+=90", ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
      gsap.from(".mcard", { y: 50, autoAlpha: 0, stagger: 0.04, duration: 0.8, delay: d + 0.4 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pb-28">
      <header className="relative mx-auto max-w-[1480px] overflow-hidden px-5 pb-10 pt-32 sm:px-10 sm:pt-40">
        <div className="relative z-[1] max-w-3xl">
          <p className="mh-fade eyebrow mb-4 flex items-center gap-3 text-palm">
            <span className="h-px w-10 bg-current" /> Lagos-born. World-fed.
          </p>
          <h1 className="display text-[clamp(4rem,11vw,10rem)]" aria-label="The Menu">
            {"The Menu".split(" ").map((w, i) => (
              <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                {Array.from(w).map((c, j) => (
                  <span key={j} className="mh-char inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="mh-fade mt-4 max-w-xl text-lg text-ink-2">
            Naija classics from the pot station, the world from the other side of the pass, and a belt of sushi and small chops in between. Tap any signature plate to build it your way.
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-24 top-24 hidden h-[460px] w-[620px] md:block">
          <DishArt slug="party-jollof" className="mh-plate absolute right-24 top-0 h-[320px] w-[320px] drop-shadow-2xl" />
          <DishArt slug="tonkotsu" className="mh-plate absolute right-[330px] top-[150px] h-[230px] w-[230px] drop-shadow-2xl" />
          <DishArt slug="margherita" className="mh-plate absolute right-0 top-[270px] h-[200px] w-[200px] drop-shadow-2xl" />
        </div>
      </header>

      <div className="sticky top-[76px] z-30 mb-8">
        <div className="mx-auto max-w-[1480px] px-3 sm:px-8">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-full bg-paper/85 p-1.5 shadow-[0_10px_40px_-20px_rgba(29,20,16,.45)] backdrop-blur-xl" data-lenis-prevent-horizontal role="toolbar" aria-label="Filter the menu">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                className="chip shrink-0 !shadow-none"
                onClick={() => {
                  if (cat === c.id) return;
                  capture();
                  setCat(c.id as Filter);
                }}
              >
                {c.label}
              </button>
            ))}
            <span className="mx-1 h-6 w-px shrink-0 bg-ink/15" />
            {TAGS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={tags.includes(id)}
                className="chip shrink-0 !shadow-none"
                onClick={() => {
                  capture();
                  setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
                }}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1480px] px-5 sm:px-10">
        <p className="mb-6 text-sm font-semibold text-ink-3" aria-live="polite">
          {visibleCount} {visibleCount === 1 ? "dish" : "dishes"}
          {tags.length > 0 && ` · ${tags.map((t) => TAGS.find((x) => x.id === t)?.label).join(", ")}`}
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {signatures.map((s) => (
            <div key={s.slug} className="mcard-wrap contents">
              <div className={showSig(s) ? "contents" : "hidden"}>
                <SignatureCard s={s} />
              </div>
            </div>
          ))}
          {menu.map((m) => (
            <div key={m.id} className={showItem(m) ? "contents" : "hidden"}>
              <ItemCard item={m} />
            </div>
          ))}
        </div>
        {visibleCount === 0 && (
          <div className="py-24 text-center">
            <p className="display text-4xl">Nothing matches that combo.</p>
            <button
              type="button"
              className="btn btn-primary mt-6"
              onClick={() => {
                capture();
                setTags([]);
                setCat("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <TLink href="/#belt" className="group mt-20 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[32px] bg-night p-8 text-paper sm:flex-row sm:items-center sm:p-12">
          <div>
            <p className="eyebrow text-palm">12:00 – 17:00 daily</p>
            <p className="display mt-2 text-5xl sm:text-6xl">Sushi & small chops on The Belt</p>
            <p className="mt-2 text-paper/70">Colour-coded plates from {money(2500)}. Grab, stack, repeat.</p>
          </div>
          <span className="btn btn-light shrink-0">
            Ride the belt <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </TLink>
      </div>
    </div>
  );
}
