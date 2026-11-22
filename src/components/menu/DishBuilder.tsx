"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, Draggable, useGSAP, reducedMotion } from "@/lib/gsap";
import { defaultOpts, describeOpts, menuById, priceFor, signatures, type MenuItem, type OptionGroup, type Opts } from "@/lib/menu";
import { money, pad2 } from "@/lib/format";
import { useOrder } from "@/lib/useOrder";
import { useStore } from "@/lib/store";
import { DishArt } from "@/components/art/DishArt";
import { Steam } from "@/components/art/Steam";
import { ArrowLeft, ArrowRight, Check, Clock, Flame, Minus, Pepper, Plus } from "@/components/ui/icons";
import { TLink, enterDelay, useGo } from "@/components/shell/Transition";

function Segmented({ g, value, onChange, accent }: { g: OptionGroup; value: string; onChange: (v: string) => void; accent: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const btn = wrap.current?.querySelector<HTMLElement>(`[data-v="${value}"]`);
    if (!btn || !pill.current) return;
    gsap.to(pill.current, { x: btn.offsetLeft, y: btn.offsetTop, width: btn.offsetWidth, height: btn.offsetHeight, duration: 0.45, ease: "power3.out" });
  }, [value]);
  return (
    <div ref={wrap} role="radiogroup" aria-label={g.label} className="relative flex flex-wrap gap-1 rounded-[22px] bg-ink/[0.05] p-1">
      <span ref={pill} aria-hidden className="absolute left-0 top-0 rounded-[18px] shadow-md" style={{ background: accent }} />
      {g.choices.map((c) => (
        <button
          key={c.id}
          type="button"
          role="radio"
          aria-checked={value === c.id}
          data-v={c.id}
          onClick={() => onChange(c.id)}
          className={`relative z-[1] flex-1 whitespace-nowrap rounded-[18px] px-3.5 py-2.5 text-sm font-bold transition-colors duration-300 ${value === c.id ? "text-paper" : "text-ink-2 hover:text-ink"}`}
        >
          {c.label}
          {c.price ? <span className="ml-1 opacity-70">+{money(c.price)}</span> : null}
        </button>
      ))}
    </div>
  );
}

function PairCard({ item }: { item: MenuItem }) {
  const { addItem } = useOrder();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-paper p-2 pr-3 shadow-sm">
      <div ref={ref} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" placeholder="blur" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{item.name}</p>
        <p className="text-xs text-ink-3">{money(item.price)}</p>
      </div>
      <button type="button" onClick={() => addItem(item, ref.current?.querySelector("img"))} className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-palm" aria-label={`Add ${item.name}`}>
        <Plus size={16} />
      </button>
    </div>
  );
}

export function DishBuilder({ slug }: { slug: string }) {
  const sig = signatures.find((s) => s.slug === slug)!;
  const idx = signatures.indexOf(sig);
  const prev = signatures[(idx - 1 + signatures.length) % signatures.length];
  const next = signatures[(idx + 1) % signatures.length];
  const [opts, setOpts] = useState<Opts>(() => defaultOpts(sig));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const spinner = useRef<HTMLDivElement>(null);
  const seen = useRef<WeakSet<Element>>(new WeakSet());
  const priceEl = useRef<HTMLSpanElement>(null);
  const shownPrice = useRef(priceFor(sig, opts) * qty);
  const { addSignature } = useOrder();
  const setCartOpen = useStore((s) => s.setCartOpen);
  const go = useGo();
  const total = priceFor(sig, opts) * qty;
  const [initialTotal] = useState(total);
  const pairs = useMemo(() => sig.pairs.map(menuById).filter(Boolean) as MenuItem[], [sig]);
  const t = sig.theme;

  /* entrance + spin-to-drag */
  useGSAP(
    () => {
      const d = enterDelay();
      if (!reducedMotion()) {
        gsap.from(".db-plate", { rotate: -160, scale: 0.7, autoAlpha: 0, duration: 1.6, ease: "expo.out", delay: d });
        gsap.from(".db-fade", { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.8, delay: d + 0.25 });
        gsap.from(".db-char", { yPercent: 110, stagger: 0.03, duration: 1, ease: "expo.out", delay: d + 0.15 });
      }
      const [dr] = Draggable.create(spinner.current, { type: "rotation", inertia: true, cursor: "grab", activeCursor: "grabbing" });
      root.current?.querySelectorAll(".db-plate [data-piece], .db-plate [data-bit]").forEach((el) => seen.current.add(el));
      return () => dr?.kill();
    },
    { scope: root },
  );

  /* animate any new ingredients that appear after an option change */
  useLayoutEffect(() => {
    const els = Array.from(plate.current?.querySelectorAll("[data-piece], [data-bit]") ?? []);
    const fresh = els.filter((el) => !seen.current.has(el));
    els.forEach((el) => seen.current.add(el));
    if (!fresh.length || reducedMotion()) return;
    gsap.from(fresh, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: { amount: 0.4, from: "random" }, ease: "back.out(2.4)" });
    gsap.fromTo(plate.current, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  }, [opts]);

  /* tween the price */
  useEffect(() => {
    const o = { v: shownPrice.current };
    shownPrice.current = total;
    gsap.to(o, { v: total, duration: 0.5, ease: "power2.out", onUpdate: () => document.querySelectorAll(".db-price").forEach((el) => (el.textContent = money(o.v))) });
  }, [total]);

  const set = (g: OptionGroup, id: string) =>
    setOpts((o) => {
      if (g.type === "single") return { ...o, [g.id]: id };
      const cur = (o[g.id] as string[]) ?? [];
      return { ...o, [g.id]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });

  const add = async () => {
    await addSignature(sig, opts, qty, plate.current?.querySelector("svg"));
    setAdded(true);
  };

  const summary = describeOpts(sig, opts);

  return (
    <div ref={root} className="relative" style={{ background: `linear-gradient(180deg, ${t.bg} 0%, ${t.bg} 55%, var(--color-paper) 100%)` }}>
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 pb-32 pt-28 sm:px-10 md:grid-cols-[1.05fr_1fr] md:gap-16 md:pt-32">
        {/* plate */}
        <div className="md:sticky md:top-24 md:h-[calc(100svh-7rem)]">
          <div className="relative flex h-full flex-col items-center justify-center">
            <div className="relative aspect-square w-[min(86vw,560px)] md:w-[min(42vw,72svh)]">
              <div className="absolute inset-[4%] rounded-full blur-3xl" style={{ background: t.glow, opacity: 0.55 }} />
              <div className="absolute inset-[3%] translate-y-[3%] rounded-full bg-[#2c1a10]/30 blur-xl" />
              <div className="db-plate relative h-full w-full">
                <div ref={spinner} className="h-full w-full touch-none">
                  <div ref={plate} className="h-full w-full">
                    <DishArt slug={sig.slug} opts={opts} className="h-full w-full" label={`${sig.name}: ${summary || "house style"}`} />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-[26%] left-[18%] h-[80%] w-[64%]">
                <Steam className="h-full w-full" />
              </div>
            </div>
            <p className="db-fade mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: t.accent }} /> Drag the plate to spin it
            </p>
            {sig.photo && (
              <figure className="db-fade absolute bottom-0 right-0 hidden w-40 rotate-3 overflow-hidden rounded-2xl bg-paper p-1.5 shadow-xl lg:block">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={sig.photo} alt={`${sig.name}, photographed`} fill sizes="160px" className="object-cover" placeholder="blur" />
                </div>
                <figcaption className="px-1 pb-0.5 pt-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-ink-3">The real thing</figcaption>
              </figure>
            )}
          </div>
        </div>

        {/* options */}
        <div>
          <nav aria-label="Breadcrumb" className="db-fade flex items-center gap-2 text-sm font-semibold text-ink-3">
            <TLink href="/menu" className="hover:text-ink">
              Menu
            </TLink>
            <span>/</span>
            <span>{sig.region === "naija" ? "Naija classics" : "Around the world"}</span>
          </nav>
          <p className="db-fade eyebrow mt-6" style={{ color: t.accent }}>
            No. {pad2(idx + 1)} · {sig.origin.city}, {sig.origin.country}
          </p>
          <h1 className="display mt-2 text-[clamp(3.2rem,6.5vw,6.2rem)]" style={{ color: t.deep }} aria-label={sig.name}>
            {sig.name.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                {Array.from(w).map((c, j) => (
                  <span key={j} className="db-char inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="db-fade mt-4 max-w-xl text-lg leading-relaxed text-ink-2">{sig.story}</p>

          <dl className="db-fade mt-6 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-paper/70 px-3 py-1.5 text-sm font-bold">
              <dt className="sr-only">Heat</dt>
              <dd className="flex" style={{ color: t.accent }}>
                {[0, 1, 2].map((h) => (
                  <Pepper key={h} size={15} filled={h < sig.heat} className={h < sig.heat ? "" : "opacity-30"} />
                ))}
              </dd>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-paper/70 px-3 py-1.5 text-sm font-bold">
              <dt className="sr-only">Ready in</dt>
              <Clock size={15} />
              <dd>{sig.time}</dd>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-paper/70 px-3 py-1.5 text-sm font-bold">
              <dt className="sr-only">Energy</dt>
              <Flame size={15} />
              <dd>{sig.kcal} kcal</dd>
            </div>
          </dl>

          <div className="mt-10 space-y-8">
            {sig.options.map((g) => (
              <fieldset key={g.id} className="db-fade">
                <legend className="mb-3 flex w-full items-baseline justify-between gap-4">
                  <span className="display text-2xl">{g.label}</span>
                  {g.hint && <span className="text-xs font-semibold text-ink-3">{g.hint}</span>}
                </legend>
                {g.type === "single" ? (
                  <Segmented g={g} value={opts[g.id] as string} onChange={(v) => set(g, v)} accent={t.deep} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {g.choices.map((c) => {
                      const on = ((opts[g.id] as string[]) ?? []).includes(c.id);
                      return (
                        <button key={c.id} type="button" aria-pressed={on} onClick={() => set(g, c.id)} className="chip !h-11">
                          <span className={`grid h-5 w-5 place-items-center rounded-full transition-colors ${on ? "bg-palm text-paper" : "bg-ink/10"}`}>{on ? <Check size={13} /> : <Plus size={13} />}</span>
                          {c.label}
                          {c.price ? <span className="opacity-60">+{money(c.price)}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                )}
                {g.choices.find((c) => c.id === opts[g.id] && c.note) && <p className="mt-2 text-xs italic text-ink-3">{g.choices.find((c) => c.id === opts[g.id])?.note}</p>}
              </fieldset>
            ))}
          </div>

          {/* add (desktop) */}
          <div className="db-fade mt-10 hidden items-center gap-4 rounded-[26px] bg-ink p-3 text-paper md:flex">
            <div className="flex items-center gap-1 rounded-full bg-paper/10 p-1">
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10" onClick={() => setQty((q) => q + 1)} aria-label="More">
                <Plus size={16} />
              </button>
            </div>
            <button type="button" onClick={add} className="btn btn-palm flex-1 !h-14 text-base">
              Add to order · <span className="db-price tabular-nums">{money(initialTotal)}</span>
            </button>
          </div>
          {added && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <Check size={16} className="text-leaf" /> In your order.
              <button type="button" className="link-u font-bold" onClick={() => setCartOpen(true)}>
                Review order
              </button>
              <span className="text-ink-3">or</span>
              <button type="button" className="link-u font-bold" onClick={() => go("/checkout")}>
                checkout now
              </button>
            </div>
          )}

          {pairs.length > 0 && (
            <div className="db-fade mt-12">
              <p className="display mb-3 text-2xl">Pairs well with</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {pairs.map((p) => (
                  <PairCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          )}

          <div className="db-fade mt-14 grid grid-cols-2 gap-3">
            <TLink href={`/menu/${prev.slug}`} className="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-ink/5">
              <ArrowLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              <DishArt slug={prev.slug} className="h-12 w-12 shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs text-ink-3">Previous</span>
                <span className="block truncate font-bold">{prev.name}</span>
              </span>
            </TLink>
            <TLink href={`/menu/${next.slug}`} className="group flex items-center justify-end gap-3 rounded-2xl p-3 text-right transition-colors hover:bg-ink/5">
              <span className="min-w-0">
                <span className="block text-xs text-ink-3">Next</span>
                <span className="block truncate font-bold">{next.name}</span>
              </span>
              <DishArt slug={next.slug} className="h-12 w-12 shrink-0" />
              <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </TLink>
          </div>
        </div>
      </div>

      {/* add (mobile sticky) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/90 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full bg-ink/5 p-1">
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">
              <Minus size={16} />
            </button>
            <span className="w-5 text-center font-bold tabular-nums">{qty}</span>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full" onClick={() => setQty((q) => q + 1)} aria-label="More">
              <Plus size={16} />
            </button>
          </div>
          <button type="button" onClick={add} className="btn btn-palm !h-12 flex-1">
            Add · <span className="db-price tabular-nums">{money(initialTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
