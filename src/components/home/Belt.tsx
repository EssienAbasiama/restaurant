"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";
import { beltItems, tiers, type BeltItem, type BeltTier } from "@/lib/menu";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { useStore } from "@/lib/store";
import { useOrder } from "@/lib/useOrder";
import { BeltPlate } from "@/components/art/BeltArt";
import { ArrowRight } from "@/components/ui/icons";

type Geo = {
  w: number;
  h: number;
  vertical: boolean;
  x0: number;
  y0: number;
  r: number;
  L: number;
  P: number;
  belt: number;
  plate: number;
  d: string;
  count: number;
};

function computeGeo(w: number, h: number): Geo {
  const vertical = w < 760;
  const pad = vertical ? 14 : 36;
  const belt = vertical ? 92 : 128;
  const plate = vertical ? 74 : 104;
  const half = belt / 2;
  let x0: number, y0: number, r: number, L: number, d: string;
  if (vertical) {
    r = (w - pad * 2 - belt) / 2;
    x0 = pad + half;
    y0 = pad + half;
    L = Math.max(0, h - pad * 2 - belt - 2 * r);
    d = `M${x0 + 2 * r} ${y0 + r} V${y0 + r + L} A${r} ${r} 0 0 1 ${x0} ${y0 + r + L} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + 2 * r} ${y0 + r} Z`;
  } else {
    r = (h - pad * 2 - belt) / 2;
    x0 = pad + half;
    y0 = pad + half;
    L = Math.max(0, w - pad * 2 - belt - 2 * r);
    d = `M${x0 + r} ${y0} H${x0 + r + L} A${r} ${r} 0 0 1 ${x0 + r + L} ${y0 + 2 * r} H${x0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
  }
  const P = 2 * L + 2 * Math.PI * r;
  const count = Math.max(10, Math.floor(P / (plate * 1.42)));
  return { w, h, vertical, x0, y0, r, L, P, belt, plate, d, count };
}

/** Point on the stadium centreline at arc-length s (clockwise). */
function pointAt(g: Geo, s: number): [number, number] {
  const { x0, y0, r, L } = g;
  const arc = Math.PI * r;
  let t = ((s % g.P) + g.P) % g.P;
  if (!g.vertical) {
    if (t < L) return [x0 + r + t, y0];
    t -= L;
    if (t < arc) {
      const a = -Math.PI / 2 + t / r;
      return [x0 + r + L + Math.cos(a) * r, y0 + r + Math.sin(a) * r];
    }
    t -= arc;
    if (t < L) return [x0 + r + L - t, y0 + 2 * r];
    t -= L;
    const a = Math.PI / 2 + t / r;
    return [x0 + r + Math.cos(a) * r, y0 + r + Math.sin(a) * r];
  }
  if (t < L) return [x0 + 2 * r, y0 + r + t];
  t -= L;
  if (t < arc) {
    const a = t / r;
    return [x0 + r + Math.cos(a) * r, y0 + r + L + Math.sin(a) * r];
  }
  t -= arc;
  if (t < L) return [x0, y0 + r + L - t];
  t -= L;
  const a = Math.PI + t / r;
  return [x0 + r + Math.cos(a) * r, y0 + r + Math.sin(a) * r];
}

function PlateStack() {
  const plates = useStore((s) => s.plates);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(plates.length);
  const total = plates.reduce((n, p) => n + (tiers[p.tier as BeltTier]?.price ?? 0), 0);
  const shown = plates.slice(-10);

  useEffect(() => {
    if (plates.length > prev.current && ref.current) {
      const top = ref.current.querySelector(".stack-plate:last-child");
      if (top) gsap.fromTo(top, { y: -90, rotate: -12, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.7, ease: "bounce.out" });
    }
    prev.current = plates.length;
  }, [plates.length]);

  return (
    <div className="flex items-end gap-5">
      <div ref={ref} className="relative flex h-[110px] w-[70px] flex-col-reverse items-center sm:h-[150px] sm:w-[92px]" aria-hidden>
        <span className="absolute bottom-[-6px] h-3 w-[74px] rounded-[50%] bg-black/40 blur-[3px] sm:w-[96px]" />
        {shown.length === 0 && <span className="mb-2 h-[16px] w-[66px] rounded-[50%] border-2 border-dashed border-paper/25 sm:h-[18px] sm:w-[86px]" />}
        {shown.map((p, i) => {
          const t = tiers[p.tier as BeltTier];
          return (
            <span
              key={`${p.at}-${i}`}
              className="stack-plate relative -mt-[9px] block h-[16px] w-[66px] rounded-[50%] sm:h-[18px] sm:w-[86px]"
              style={{ background: `linear-gradient(180deg, ${t.color} 0 45%, ${t.rim} 46% 100%)`, boxShadow: "inset 0 2px 0 rgba(255,255,255,.35), 0 2px 2px rgba(0,0,0,.35)" }}
            />
          );
        })}
      </div>
      <div>
        <p className="eyebrow text-paper/50">Your stack</p>
        <p className="display whitespace-nowrap text-3xl tabular-nums text-paper sm:text-4xl">
          {plates.length} <span className="text-base text-paper/50 sm:text-xl">{plates.length === 1 ? "plate" : "plates"}</span>
        </p>
        <p className="text-sm font-bold tabular-nums text-plantain">{money(total)}</p>
        {plates.length > 0 && (
          <button type="button" onClick={() => setCartOpen(true)} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-paper underline-offset-4 hover:underline">
            Settle up <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Belt() {
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const plateEls = useRef<(HTMLButtonElement | null)[]>([]);
  const slats = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const motion = useRef({ offset: 0, speed: 1, boost: 1 });
  const away = useRef<Set<number>>(new Set());
  const [hovered, setHovered] = useState<number | null>(null);
  const { addBelt } = useOrder();

  const items: BeltItem[] = useMemo(() => {
    const n = geo?.count ?? 16;
    return Array.from({ length: n }, (_, i) => beltItems[i % beltItems.length]);
  }, [geo?.count]);

  const place = () => {
    const g = geoRef.current;
    if (!g) return;
    const gap = g.P / g.count;
    const o = motion.current.offset;
    for (let i = 0; i < g.count; i++) {
      const el = plateEls.current[i];
      if (!el) continue;
      const [x, y] = pointAt(g, i * gap + o);
      el.style.transform = `translate3d(${x - g.plate / 2}px, ${y - g.plate / 2}px, 0)`;
    }
    if (slats.current) slats.current.style.strokeDashoffset = String(-o);
  };

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      const g = computeGeo(el.clientWidth, el.clientHeight);
      geoRef.current = g;
      setGeo(g);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(place, [geo, items]);

  useGSAP(
    () => {
      const reduce = reducedMotion();
      const tick = (_t: number, dt: number) => {
        const m = motion.current;
        m.offset += (dt / 1000) * 62 * m.speed * m.boost;
        place();
      };
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (reduce) return;
          if (self.isActive) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        },
        onUpdate: (self) => {
          const v = Math.abs(self.getVelocity());
          motion.current.boost = 1 + Math.min(4, v / 500);
          gsap.to(motion.current, { boost: 1, duration: 1.4, delay: 0.15, ease: "power2.out", overwrite: true });
        },
      });
      gsap.from(".belt-head > *", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: section.current, start: "top 70%" } });
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: section },
  );

  const setSpeed = (v: number) => gsap.to(motion.current, { speed: v, duration: 0.6, ease: "power2.out" });

  const grab = async (i: number) => {
    const el = plateEls.current[i];
    if (!el || away.current.has(i)) return;
    away.current.add(i);
    const svg = el.querySelector("svg");
    const item = items[i];
    gsap.to(el.querySelector(".plate-inner"), { scale: 1.25, duration: 0.15, ease: "power2.out" });
    await addBelt(item, svg);
    gsap.set(el.querySelector(".plate-inner"), { scale: 0, autoAlpha: 0 });
    window.setTimeout(() => {
      gsap.to(el.querySelector(".plate-inner"), { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2.2)" });
      away.current.delete(i);
    }, 2600);
  };

  const g = geo;
  const legend = (Object.keys(tiers) as BeltTier[]).map((k) => ({ k, ...tiers[k] }));

  return (
    <section id="belt" ref={section} aria-label="The Belt — sushi and small chops conveyor" className="relative overflow-hidden bg-night py-16 text-paper md:py-10" onPointerEnter={() => setSpeed(0.55)} onPointerLeave={() => setSpeed(1)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(226,98,27,.18), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgba(31,42,85,.5), transparent 70%)" }}
      />

      <div className="belt-head relative mx-auto max-w-[1480px] px-5 sm:px-10 md:hidden">
        <p className="eyebrow mb-3 flex items-center gap-3 text-palm">
          <span className="h-px w-10 bg-current" /> {site.beltHours}
        </p>
        <h2 className="display text-6xl">The Belt</h2>
        <p className="mt-3 max-w-md text-paper/70">Sushi and Naija small chops, gliding past on colour-coded plates. Tap what calls you.</p>
      </div>

      <div ref={box} className="relative mx-auto mt-8 h-[min(1100px,172vw)] w-full max-w-[1520px] md:mt-0 md:h-[min(92svh,820px)] md:min-h-[640px]">
        {g && (
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <path d={g.d} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth={g.belt + 40} style={{ filter: "blur(18px)" }} />
            <path d={g.d} fill="none" stroke="#6E747A" strokeWidth={g.belt + 18} />
            <path d={g.d} fill="none" stroke="#C9CDD2" strokeWidth={g.belt + 12} />
            <path d={g.d} fill="none" stroke="#3A3532" strokeWidth={g.belt + 8} />
            <path d={g.d} fill="none" stroke="#1B1613" strokeWidth={g.belt} />
            <path ref={slats} d={g.d} fill="none" stroke="#2C2420" strokeWidth={g.belt - 8} strokeDasharray="4 24" />
            <path d={g.d} fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth={g.belt * 0.55} />
          </svg>
        )}

        {/* the island */}
        {g && (
          <div
            className="absolute flex flex-col justify-center gap-6 md:flex-row md:items-center md:justify-between"
            style={
              g.vertical
                ? { left: g.x0 + g.belt / 2 + 14, right: g.w - (g.x0 + 2 * g.r) + g.belt / 2 + 14, top: g.y0 + g.belt / 2 + 20, bottom: g.h - (g.y0 + 2 * g.r + g.L) + g.belt / 2 + 20 }
                : { left: g.x0 + g.r * 0.55, right: g.w - (g.x0 + 2 * g.r + g.L) + g.r * 0.55, top: g.y0 + g.belt / 2 + 24, bottom: g.h - (g.y0 + 2 * g.r) + g.belt / 2 + 24 }
            }
          >
            <div className="belt-head hidden max-w-md md:block">
              <p className="eyebrow mb-3 flex items-center gap-3 text-palm">
                <span className="h-px w-10 bg-current" /> {site.beltHours}
              </p>
              <h2 className="display text-[clamp(3.5rem,7vw,7rem)]">The Belt</h2>
              <p className="mt-3 text-lg text-paper/70">Sushi and Naija small chops, gliding past on colour-coded plates. Hover to slow it down, click to grab. Plates stack up like a real kaiten bar.</p>
            </div>
            <div className="flex flex-col gap-6">
              <ul className="grid grid-cols-2 gap-1.5 sm:gap-2" aria-label="Plate prices">
                {legend.map((t) => (
                  <li key={t.k} className="flex items-center gap-1.5 rounded-full bg-paper/[0.06] py-1 pl-1 pr-2 sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3">
                    <span className="h-6 w-6 rounded-full border-[5px]" style={{ borderColor: t.color, background: "#F6F3EC" }} />
                    <span className="text-xs font-bold tabular-nums sm:text-sm">{money(t.price)}</span>
                  </li>
                ))}
              </ul>
              <PlateStack />
            </div>
          </div>
        )}

        {/* plates */}
        {g &&
          items.map((it, i) => (
            <button
              key={`${it.id}-${i}`}
              ref={(el) => void (plateEls.current[i] = el)}
              type="button"
              onClick={() => grab(i)}
              onPointerEnter={() => {
                setHovered(i);
                setSpeed(0.08);
              }}
              onPointerLeave={() => {
                setHovered(null);
                setSpeed(0.55);
              }}
              onFocus={() => {
                setHovered(i);
                setSpeed(0);
              }}
              onBlur={() => {
                setHovered(null);
                setSpeed(1);
              }}
              aria-label={`Grab ${it.name}, ${tiers[it.tier].label} plate, ${money(tiers[it.tier].price)}`}
              className="group absolute left-0 top-0 rounded-full will-change-transform focus-visible:outline-offset-4"
              style={{ width: g.plate, height: g.plate, zIndex: hovered === i ? 30 : 2 }}
            >
              <span className="plate-inner block h-full w-full transition-transform duration-300 ease-[var(--ease-silk)] group-hover:-translate-y-1.5 group-hover:scale-[1.14]">
                <BeltPlate item={it} className="h-full w-full drop-shadow-[0_10px_10px_rgba(0,0,0,.45)]" />
              </span>
              <span
                className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink shadow-xl transition-all duration-300 ${
                  hovered === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                {it.name} · {money(tiers[it.tier].price)}
              </span>
            </button>
          ))}
      </div>
    </section>
  );
}
