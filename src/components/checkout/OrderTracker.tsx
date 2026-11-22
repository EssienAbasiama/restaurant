"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { useStore, useStoreHydrated } from "@/lib/store";
import { money } from "@/lib/format";
import { nowMs } from "@/lib/ids";
import { site } from "@/lib/site";
import { DishArt } from "@/components/art/DishArt";
import { Steam } from "@/components/art/Steam";
import { EmptyPlate } from "@/components/shell/CartDrawer";
import { Thumb } from "@/components/ui/Thumb";
import { ArrowRight, Bag, Check, Scooter, Star } from "@/components/ui/icons";
import { TLink } from "@/components/shell/Transition";

/** Demo pacing (seconds since the order was placed). */
const T = [0, 5, 12, 19, 36];

const ROUTE = "M86 262 C150 250 170 196 236 200 C300 204 312 150 372 140 C430 130 452 92 520 84";

function Confetti({ fire }: { fire: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fire || !ref.current || reducedMotion()) return;
    const colors = ["#E2621B", "#F2B23A", "#2E5B3A", "#C3301E", "#F5EEE3", "#1F2A55"];
    const bits = Array.from({ length: 70 }, (_, i) => {
      const el = document.createElement("span");
      const w = 6 + Math.random() * 8;
      Object.assign(el.style, {
        position: "absolute",
        left: "50%",
        top: "45%",
        width: `${w}px`,
        height: `${i % 3 === 0 ? w : w * 0.4}px`,
        borderRadius: i % 3 === 0 ? "999px" : "2px",
        background: colors[i % colors.length],
      });
      ref.current!.appendChild(el);
      return el;
    });
    gsap.to(bits, {
      physics2D: { velocity: "random(380, 820)", angle: "random(-160, -20)", gravity: 1100 },
      rotation: "random(-720, 720)",
      duration: 2.6,
      ease: "none",
      onComplete: () => bits.forEach((b) => b.remove()),
    });
  }, [fire]);
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-visible" />;
}

export function OrderTracker() {
  const order = useStore((s) => s.order);
  const add = useStore((s) => s.add);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const hydrated = useStoreHydrated();
  const [now, setNow] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const plate = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const shownStage = useRef(-1);

  useEffect(() => {
    const tick = () => setNow(nowMs());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const elapsed = order && now ? (now - order.placedAt) / 1000 : 0;
  const status = T.reduce((s, t, i) => (elapsed >= t ? i : s), 0);
  const delivery = order?.mode === "delivery";
  const featured = useMemo(() => order?.lines.find((l) => l.thumb.kind === "art")?.thumb, [order]);
  const slug = featured && featured.kind === "art" ? featured.slug : "party-jollof";
  const opts = featured && featured.kind === "art" ? featured.opts : undefined;

  const steps = [
    { t: "Order received", d: `Thanks, ${order?.name ?? "friend"}. The ticket just hit the rail.` },
    { t: "In the pot", d: "Our pot station has fired your order. Smells like Saturday." },
    { t: "Plating", d: "Garnish on, edges wiped, one last taste for quality." },
    delivery ? { t: "On the way", d: `Your rider is crossing ${order?.area ?? "Lagos"}. Hold tight.` } : { t: "Ready at the counter", d: "Say your name at the pass. It's still steaming." },
    delivery ? { t: "Delivered", d: "Knock knock. Enjoy every bite." } : { t: "Collected", d: "Enjoy every bite." },
  ];

  /* build the plate stage by stage */
  useLayoutEffect(() => {
    const root = plate.current;
    if (!root || !order || now === null) return;
    const show = (stages: number[]) => stages.flatMap((s) => Array.from(root.querySelectorAll(`[data-stage="${s}"]`)));
    const allowed = status === 0 ? [0] : status === 1 ? [0, 1, 2] : [0, 1, 2, 3, 4, 5];
    const hide = [0, 1, 2, 3, 4, 5].filter((s) => !allowed.includes(s));
    if (shownStage.current === -1) {
      gsap.set(show(hide), { autoAlpha: 0 });
      gsap.set(show(allowed), { autoAlpha: 1 });
    } else if (status !== shownStage.current) {
      const fresh = show(allowed).filter((el) => getComputedStyle(el).visibility === "hidden");
      if (!reducedMotion()) gsap.fromTo(fresh, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: "back.out(1.8)" });
      else gsap.set(fresh, { autoAlpha: 1 });
      gsap.fromTo(root, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }
    shownStage.current = status;
  }, [status, order, now]);

  /* rider along the route */
  useEffect(() => {
    if (!delivery || !route.current || !rider.current) return;
    const p = Math.min(1, Math.max(0, (elapsed - T[3]) / (T[4] - T[3])));
    const len = route.current.getTotalLength();
    const pt = route.current.getPointAtLength(p * len);
    rider.current.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    route.current.style.strokeDashoffset = String(len * (1 - p));
    route.current.style.strokeDasharray = String(len);
  }, [elapsed, delivery]);

  if (!hydrated || now === null) return <div className="min-h-svh" />;

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-5 pt-28 text-center">
        <EmptyPlate className="w-52" />
        <h1 className="display mt-8 text-6xl">No order on the rail.</h1>
        <p className="mt-3 text-lg text-ink-2">Once you place an order, you can watch it come together right here.</p>
        <TLink href="/menu" className="btn btn-primary mt-8">
          Start an order <ArrowRight size={18} />
        </TLink>
      </div>
    );
  }

  const left = Math.max(0, Math.ceil(order.eta * (1 - Math.min(1, elapsed / T[4]))));
  const done = status === 4;

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-28 sm:px-8 md:pt-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-palm">Order {order.id}</p>
          <h1 className="display mt-2 text-[clamp(3rem,6.5vw,5.6rem)]">{done ? (delivery ? "Delivered. Dig in." : "Collected. Dig in.") : steps[status].t + "…"}</h1>
        </div>
        <div className="rounded-full bg-ink px-5 py-3 text-paper">
          {done ? (
            <span className="flex items-center gap-2 font-bold">
              <Check size={18} /> Enjoy, {order.name}
            </span>
          ) : (
            <span className="font-bold tabular-nums">
              {delivery ? <Scooter size={18} className="mr-2 inline" /> : <Bag size={18} className="mr-2 inline" />}~{left} min {delivery ? "to your door" : "to the counter"}
            </span>
          )}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-paper-2 p-6 sm:p-10">
          <Confetti fire={done} />
          <div className="relative mx-auto aspect-square w-[min(80vw,480px)]">
            <div className="absolute inset-[5%] translate-y-[3%] rounded-full bg-[#2c1a10]/25 blur-xl" />
            <div ref={plate} className="relative h-full w-full">
              <DishArt slug={slug} opts={opts} className="h-full w-full" label="Your order being plated" />
            </div>
            {status >= 2 && (
              <div className="pointer-events-none absolute -top-[24%] left-[18%] h-[80%] w-[64%]">
                <Steam className="h-full w-full" />
              </div>
            )}
          </div>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-ink-3">Live from the pass · demo pacing</p>
        </div>

        <div className="space-y-5">
          <ol className="rounded-[28px] bg-paper p-6 shadow-[0_20px_60px_-40px_rgba(29,20,16,.5)]">
            {steps.map((s, i) => (
              <li key={s.t} className="relative flex gap-4 pb-5 last:pb-0">
                {i < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 transition-colors duration-700 ${i < status ? "bg-leaf" : "bg-ink/10"}`} />}
                <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-500 ${i < status || done ? "bg-leaf text-paper" : i === status ? "bg-palm text-paper" : "bg-ink/10 text-ink-3"}`}>
                  {i < status || done ? <Check size={15} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  {i === status && !done && <span className="pulse-ring absolute inset-0 rounded-full bg-palm/50" />}
                </span>
                <div className={i > status ? "opacity-40" : ""}>
                  <p className="font-bold">{s.t}</p>
                  <p className="text-sm text-ink-2">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          {delivery ? (
            <div className="overflow-hidden rounded-[28px] bg-[#EFE6D4]">
              <svg viewBox="0 0 600 340" className="block w-full" role="img" aria-label="Rider route map">
                <path d="M0 230 C120 210 200 300 330 280 C450 262 520 320 600 300 V340 H0 Z" fill="#9CC3D6" />
                <path d="M0 250 C120 230 200 320 330 300" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" />
                {["M0 120 H600", "M0 180 C200 170 380 190 600 160", "M140 0 V340", "M300 0 C290 120 320 220 300 340", "M460 0 V240", "M0 60 C200 80 380 40 600 70"].map((d) => (
                  <path key={d} d={d} stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
                ))}
                {[
                  [40, 20, 70, 60],
                  [190, 70, 80, 40],
                  [350, 90, 70, 50],
                  [500, 180, 70, 40],
                  [200, 200, 70, 50],
                ].map(([x, y, w, h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill="#E2D5BC" />
                ))}
                <path d={ROUTE} stroke="#1D1410" strokeOpacity="0.15" strokeWidth="6" fill="none" strokeDasharray="2 10" strokeLinecap="round" />
                <path ref={route} d={ROUTE} stroke="#E2621B" strokeWidth="6" fill="none" strokeLinecap="round" />
                <g transform="translate(86 262)">
                  <circle r="16" fill="#1D1410" />
                  <text y="5" textAnchor="middle" fontSize="15" fontFamily="var(--font-fraunces), serif" fill="#F5EEE3">
                    À
                  </text>
                </g>
                <g transform="translate(520 84)">
                  <circle r="20" fill="#E2621B" opacity="0.25" />
                  <circle r="9" fill="#E2621B" stroke="#fff" strokeWidth="3" />
                </g>
                <g ref={rider} transform="translate(86 262)">
                  <circle r="15" fill="#fff" stroke="#1D1410" strokeWidth="2" />
                  <g transform="translate(-9 -9) scale(0.75)" stroke="#1D1410" strokeWidth="2" fill="none" strokeLinecap="round">
                    <circle cx="6" cy="17" r="2.6" />
                    <circle cx="18" cy="17" r="2.6" />
                    <path d="M8.6 17h6.8l2.2-6.5H20M14 6.5h2.6l1 4M4 12.5h6l1.5 4.5" />
                  </g>
                </g>
              </svg>
              <div className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-bold">{site.name} → {order.area}</span>
                <span className="text-ink-3">Rider: Emeka · 4.9 ★</span>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] bg-ink p-6 text-paper">
              <p className="eyebrow text-palm">Pickup</p>
              <p className="display mt-2 text-3xl">Counter 3, by the belt.</p>
              <p className="mt-1 text-paper/70">{site.address.join(", ")}</p>
            </div>
          )}

          <div className="rounded-[28px] bg-paper p-6 shadow-[0_20px_60px_-40px_rgba(29,20,16,.5)]">
            <p className="display text-2xl">Receipt</p>
            <ul className="mt-3 space-y-2">
              {order.lines.map((l) => (
                <li key={l.key} className="flex items-center gap-3 text-sm">
                  <div className="h-9 w-9 shrink-0">
                    <Thumb thumb={l.thumb} size={36} className="h-9 w-9" />
                  </div>
                  <span className="flex-1 truncate">
                    {l.qty}× {l.name}
                  </span>
                  <span className="font-semibold tabular-nums">{money(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 font-bold">
              <span>Total paid on arrival</span>
              <span className="tabular-nums">{money(order.total)}</span>
            </div>
          </div>

          {done && (
            <div className="rounded-[28px] bg-plantain/25 p-6">
              <p className="display text-2xl">{rating ? "Thank you. The chefs saw that." : "How was it?"}</p>
              <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rate your meal">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={(e) => {
                      setRating(n);
                      gsap.fromTo(e.currentTarget, { scale: 1.5, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(3)" });
                    }}
                    className={`transition-colors ${n <= rating ? "text-palm" : "text-ink/20 hover:text-palm/60"}`}
                  >
                    <Star size={34} />
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    order.lines.forEach((l) => add({ ...l }));
                    setCartOpen(true);
                  }}
                >
                  Order it again
                </button>
                <TLink href="/reserve" className="btn btn-ghost">
                  Book a table next time
                </TLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
