"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, Draggable, useGSAP, reducedMotion } from "@/lib/gsap";
import { signatures, type Signature } from "@/lib/menu";
import { money, pad2 } from "@/lib/format";
import { useOrder } from "@/lib/useOrder";
import { DishArt } from "@/components/art/DishArt";
import { Steam } from "@/components/art/Steam";
import { Envelope } from "@/components/ui/Envelope";
import { ArrowLeft, ArrowRight, Clock, Hand, Pepper, Plus } from "@/components/ui/icons";
import { TLink, useGo } from "@/components/shell/Transition";
import { whenReady } from "@/components/shell/Preloader";

const N = signatures.length;
const STEP = 360 / N;
const NEIGHBOR_SCALE = 0.68;

type Geo = { w: number; h: number; S: number; cx: number; cy: number; R: number; ringCy: number; mobile: boolean; disc: number };

function computeGeo(w: number, h: number): Geo {
  const mobile = w < 768;
  const S = mobile ? Math.min(w * 0.74, h * 0.36, 360) : Math.min(h * 0.46, w * 0.31, 480);
  const cy = mobile ? h * 0.585 : h * 0.62;
  const R = mobile ? Math.max(S * 1.28, w * 0.96) : Math.max(S * 1.4, w * 0.5);
  return { w, h, S, cx: w / 2, cy, R, ringCy: cy + R, mobile, disc: 2 * (R + S * (mobile ? 0.64 : 0.57)) };
}

const wrap = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;
const mod = (n: number, m: number) => ((n % m) + m) % m;

function Title({ s, active, first }: { s: Signature; active: boolean; first: boolean }) {
  const long = s.name.length > 13;
  return (
    <h2
      aria-hidden={!active}
      className={`h-title display col-start-1 row-start-1 text-center text-[var(--scene-deep)] ${long ? "text-[clamp(2.6rem,7.4vw,7.2rem)]" : "text-[clamp(3.2rem,9.6vw,9.6rem)]"}`}
      style={{ visibility: first ? "visible" : "hidden" }}
    >
      {s.name.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          {Array.from(word).map((c, ci) => (
            <span key={ci} className="char">
              {c}
            </span>
          ))}
          {wi < s.name.split(" ").length - 1 && <span className="char">&nbsp;</span>}
        </span>
      ))}
    </h2>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const dishEls = useRef<(HTMLDivElement | null)[]>([]);
  const shadowEls = useRef<(HTMLDivElement | null)[]>([]);
  const artEls = useRef<(HTMLDivElement | null)[]>([]);
  const proxy = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const state = useRef({ rot: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(false);
  const [intro, setIntro] = useState(false);
  const [mc, setMc] = useState({ a: 0, i: 0 });
  const prevActive = useRef(0);
  const { addSignature } = useOrder();
  const go = useGo();
  const sig = signatures[active];
  const mobileCallout = mc.a === active ? mc.i : 0;

  /* ------------------------- frame render ------------------------- */
  const render = useCallback(() => {
    const g = geoRef.current;
    if (!g) return;
    const rot = state.current.rot;
    for (let i = 0; i < N; i++) {
      const el = dishEls.current[i];
      const sh = shadowEls.current[i];
      const art = artEls.current[i];
      if (!el || !sh || !art) continue;
      const e = wrap(i * STEP - rot);
      const ae = Math.abs(e);
      const t = Math.min(1, ae / STEP);
      const scale = 1 - (1 - NEIGHBOR_SCALE) * t;
      const rad = (e * Math.PI) / 180;
      const x = g.cx + g.R * Math.sin(rad) - g.S / 2;
      const y = g.ringCy - g.R * Math.cos(rad) - g.S / 2;
      const visible = ae < 125;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.visibility = visible ? "visible" : "hidden";
      el.style.zIndex = String(100 - Math.round(ae));
      art.style.transform = `rotate(${e}deg)`;
      sh.style.transform = `translate3d(${x + g.S * 0.03}px, ${y + g.S * 0.07}px, 0) scale(${scale * 1.02})`;
      sh.style.visibility = visible ? "visible" : "hidden";
      sh.style.opacity = String(1 - t * 0.35);
    }
    if (disc.current) disc.current.style.transform = `rotate(${-rot}deg)`;
    const idx = mod(Math.round(rot / STEP), N);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  /* --------------------------- geometry --------------------------- */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const update = () => {
      const g = computeGeo(el.clientWidth, el.clientHeight);
      geoRef.current = g;
      setGeo(g);
      render();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [render]);

  useEffect(() => {
    render();
  }, [geo, render]);

  /* -------------------------- rotation API ------------------------- */
  const rotateTo = useCallback(
    (target: number, duration = 1.1) => {
      tween.current?.kill();
      setSettled(false);
      tween.current = gsap.to(state.current, {
        rot: target,
        duration: reducedMotion() ? 0 : duration,
        ease: "expo.out",
        onUpdate: render,
        onComplete: () => setSettled(true),
      });
    },
    [render],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const base = Math.round(state.current.rot / STEP) * STEP;
      rotateTo(base + dir * STEP);
    },
    [rotateTo],
  );

  const goToIndex = useCallback(
    (i: number) => {
      const cur = state.current.rot;
      const delta = wrap(i * STEP - cur);
      rotateTo(Math.round((cur + delta) / STEP) * STEP);
    },
    [rotateTo],
  );

  /* ------------------------- intro + drag ------------------------- */
  useGSAP(
    () => {
      const g = geoRef.current;
      if (!g) return;
      const q = gsap.utils.selector(root);
      gsap.set(q(".h-title .char"), { yPercent: 110 });
      gsap.set(q(".h-fade"), { autoAlpha: 0, y: 24 });
      gsap.set(q(".h-side-l"), { autoAlpha: 0, x: -30 });
      gsap.set(q(".h-side-r"), { autoAlpha: 0, x: 30 });
      gsap.set(q(".h-env"), { autoAlpha: 0, y: 120, rotate: 12 });
      gsap.set(q(".h-city"), { autoAlpha: 0, scale: 0.92 });
      gsap.set(stage.current, { autoAlpha: 0 });

      const run = () => {
        const reduce = reducedMotion();
        state.current.rot = reduce ? 0 : -150;
        render();
        const tl = gsap.timeline({ onComplete: () => setIntro(true) });
        tl.to(stage.current, { autoAlpha: 1, duration: 0.5 })
          .to(state.current, { rot: 0, duration: reduce ? 0 : 2.3, ease: "expo.out", onUpdate: render, onComplete: () => setSettled(true) }, 0)
          .to(q(".h-city"), { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" }, 0.2)
          .to(q(".h-title")[0]?.querySelectorAll(".char") ?? [], { yPercent: 0, duration: 1.1, stagger: 0.035, ease: "expo.out" }, 0.35)
          .to(q(".h-fade"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.6)
          .to(q(".h-side-l, .h-side-r"), { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.1 }, 0.9)
          .to(q(".h-env"), { autoAlpha: 1, y: 0, rotate: -7, duration: 1.1, ease: "back.out(1.4)" }, 1.2);
      };
      const off = whenReady(run);

      const k = () => 180 / (Math.PI * (geoRef.current?.R ?? 600));
      let startRot = 0;
      let startX = 0;
      const [d] = Draggable.create(proxy.current, {
        type: "x",
        trigger: hit.current,
        inertia: true,
        dragClickables: true,
        minimumMovement: 6,
        onPress() {
          tween.current?.kill();
          startRot = state.current.rot;
          startX = this.x;
        },
        onDragStart() {
          setSettled(false);
          gsap.to(cursor.current, { scale: 0.8, duration: 0.3 });
        },
        onDrag() {
          state.current.rot = startRot - (this.x - startX) * k();
          render();
        },
        onThrowUpdate() {
          state.current.rot = startRot - (this.x - startX) * k();
          render();
        },
        snap: {
          x: (end: number) => {
            const endRot = startRot - (end - startX) * k();
            const snapped = Math.round(endRot / STEP) * STEP;
            return startX - (snapped - startRot) / k();
          },
        },
        onRelease() {
          gsap.to(cursor.current, { scale: 1, duration: 0.3 });
        },
        onThrowComplete() {
          setSettled(true);
        },
        onClick(e: PointerEvent) {
          const target = document
            .elementsFromPoint(e.clientX, e.clientY)
            .map((el) => (el as HTMLElement).closest<HTMLElement>("[data-dish]"))
            .find(Boolean);
          if (!target) return;
          const i = Number(target.dataset.dish);
          if (i === activeRef.current) go(`/menu/${signatures[i].slug}`);
          else goToIndex(i);
        },
      });
      return () => {
        off();
        d?.kill();
      };
    },
    { scope: root, dependencies: [geo === null] },
  );

  /* ------------------------ scene change FX ------------------------ */
  useEffect(() => {
    const prev = prevActive.current;
    prevActive.current = active;
    const q = gsap.utils.selector(root);
    const titles = q(".h-title");
    const s = signatures[active];
    gsap.to(root.current, {
      "--scene-bg": s.theme.bg,
      "--scene-accent": s.theme.accent,
      "--scene-deep": s.theme.deep,
      "--scene-glow": s.theme.glow,
      duration: 0.9,
      ease: "power2.out",
    });
    if (prev === active || !intro) return;
    const out = titles[prev]?.querySelectorAll(".char") ?? [];
    const inn = titles[active]?.querySelectorAll(".char") ?? [];
    gsap.killTweensOf([...out, ...inn]);
    gsap.to(out, { yPercent: -110, duration: 0.4, stagger: 0.012, ease: "power3.in", onComplete: () => void gsap.set(titles[prev], { visibility: "hidden" }) });
    gsap.set(titles[active], { visibility: "visible" });
    gsap.fromTo(inn, { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.022, ease: "expo.out", delay: 0.12 });
    gsap.fromTo(q(".h-swap"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.15 });
    const p = { v: signatures[prev].price };
    gsap.to(p, {
      v: s.price,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        q(".h-price").forEach((el) => (el.textContent = money(p.v)));
      },
    });
  }, [active, intro]);

  /* ----------------------- callouts after settle ---------------------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (!settled || !intro) {
        gsap.to(q(".co"), { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const lines = q(".co-line");
      gsap.set(q(".co"), { autoAlpha: 1 });
      gsap.fromTo(q(".co-dot"), { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(3)" });
      gsap.fromTo(lines, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.1 });
      gsap.fromTo(q(".co-label"), { autoAlpha: 0, x: (i, el) => (el.dataset.side === "l" ? 16 : -16) }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.35 });
    },
    { scope: root, dependencies: [settled, intro, active] },
  );

  /* ---------------------- keyboard + demo mode ----------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      const r = root.current?.getBoundingClientRect();
      if (!r || r.bottom < window.innerHeight * 0.5) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const demo = new URLSearchParams(window.location.search).get("demo");
    let id: number | undefined;
    if (demo !== null) id = window.setInterval(() => step(1), demo === "slow" ? 4800 : 3400);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (id) window.clearInterval(id);
    };
  }, [step]);

  /* mobile: cycle callout captions */
  useEffect(() => {
    if (!geo?.mobile || !settled) return;
    const id = window.setInterval(() => {
      const a = activeRef.current;
      setMc((p) => ({ a, i: p.a === a ? (p.i + 1) % signatures[a].callouts.length : 1 }));
    }, 2200);
    return () => window.clearInterval(id);
  }, [geo?.mobile, settled, active]);

  /* drag cursor follower */
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !cursor.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    gsap.to(cursor.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.5, ease: "power3.out" });
  };

  const addActive = () => {
    const el = artEls.current[activeRef.current]?.querySelector("svg");
    addSignature(signatures[activeRef.current], undefined, 1, el);
  };

  /* ------------------------------ layout ------------------------------ */
  const g = geo;
  const callouts = g
    ? (() => {
        const sc = g.S / 400;
        const items = sig.callouts.map((c, i) => {
          const ax = g.cx + (c.x - 200) * sc;
          const ay = g.cy + (c.y - 200) * sc;
          const side = c.x < 200 ? "l" : "r";
          return { ...c, i, ax, ay, side, ly: ay };
        });
        for (const side of ["l", "r"]) {
          const group = items.filter((it) => it.side === side).sort((a, b) => a.ay - b.ay);
          for (let j = 1; j < group.length; j++) if (group[j].ly - group[j - 1].ly < 64) group[j].ly = group[j - 1].ly + 64;
        }
        return items.map((it) => ({ ...it, lx: it.side === "l" ? g.cx - g.S / 2 - 46 : g.cx + g.S / 2 + 46 }));
      })()
    : [];

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Signature dishes on the revolving table"
      className="relative h-svh min-h-[660px] overflow-hidden bg-[var(--scene-bg)] text-ink"
      style={{ "--scene-bg": signatures[0].theme.bg, "--scene-accent": signatures[0].theme.accent, "--scene-deep": signatures[0].theme.deep, "--scene-glow": signatures[0].theme.glow } as React.CSSProperties}
      onPointerMove={onMove}
    >
      {/* giant city name */}
      <div aria-hidden className="h-city pointer-events-none absolute inset-x-0 grid place-items-center" style={{ top: g ? g.cy - g.S * 0.62 : "40%" }}>
        {signatures.map((s, i) => (
          <span
            key={s.slug}
            className="display outline-text col-start-1 row-start-1 whitespace-nowrap text-[clamp(6rem,24vw,26rem)] uppercase leading-none text-[var(--scene-accent)] transition-[opacity,transform] duration-700"
            style={{ opacity: i === active ? 0.16 : 0, transform: `translateX(${(i - active) * 6}%)`, transitionTimingFunction: "var(--ease-silk)" }}
          >
            {s.origin.city}
          </span>
        ))}
      </div>

      {/* glow */}
      {g && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full opacity-70 blur-3xl transition-colors duration-700"
          style={{ left: g.cx - g.S * 0.75, top: g.cy - g.S * 0.75, width: g.S * 1.5, height: g.S * 1.5, background: "radial-gradient(closest-side, var(--scene-glow), transparent)" }}
        />
      )}

      {/* the lazy susan */}
      <div ref={stage} className="absolute inset-0 isolate z-[1]" style={{ visibility: "hidden" }}>
        {g && (
          <div
            ref={disc}
            aria-hidden
            className="absolute rounded-full will-change-transform"
            style={{
              left: g.cx - g.disc / 2,
              top: g.ringCy - g.disc / 2,
              width: g.disc,
              height: g.disc,
              background:
                "repeating-radial-gradient(circle at 50% 50%, rgba(80,40,12,.0) 0 18px, rgba(80,40,12,.07) 18px 20px), conic-gradient(from 0deg, #B97C46, #A86B37, #C2874F, #9E6331, #B57842, #A56A36, #C08650, #B97C46)",
              boxShadow: "inset 0 0 0 10px #8C5A2E, inset 0 0 0 13px #D7A56C, inset 0 0 0 16px #8C5A2E, 0 -30px 80px -20px rgba(60,30,10,.45)",
            }}
          >
            {Array.from({ length: N }, (_, i) => (
              <span key={i} className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-[#7A4A22]/25" style={{ transform: `rotate(${i * STEP + STEP / 2}deg)` }} />
            ))}
            <span className="absolute inset-[22%] rounded-full shadow-[inset_0_0_0_2px_rgba(120,70,30,.35)]" />
          </div>
        )}
        {signatures.map((s, i) => (
          <div key={`sh${s.slug}`} ref={(el) => void (shadowEls.current[i] = el)} aria-hidden className="pointer-events-none absolute left-0 top-0 rounded-full" style={{ width: g?.S, height: g?.S, background: "radial-gradient(closest-side, rgba(40,18,6,.55), rgba(40,18,6,.25) 70%, transparent)", filter: "blur(6px)", transformOrigin: "50% 50%" }} />
        ))}
        {signatures.map((s, i) => (
          <div
            key={s.slug}
            ref={(el) => void (dishEls.current[i] = el)}
            data-dish={i}
            className="absolute left-0 top-0 cursor-pointer will-change-transform"
            style={{ width: g?.S, height: g?.S, transformOrigin: "50% 50%" }}
          >
            <div ref={(el) => void (artEls.current[i] = el)} className="h-full w-full will-change-transform">
              <DishArt slug={s.slug} className="h-full w-full" label={i === active ? s.name : undefined} />
            </div>
          </div>
        ))}
      </div>

      {/* drag surface */}
      {g && (
        <div
          ref={hit}
          className="absolute inset-x-0 z-[5] cursor-grab active:cursor-grabbing"
          style={{ top: g.cy - g.S * 0.55, bottom: 0, touchAction: "pan-y" }}
          onPointerEnter={() => gsap.to(cursor.current, { autoAlpha: 1, scale: 1, duration: 0.3 })}
          onPointerLeave={() => gsap.to(cursor.current, { autoAlpha: 0, scale: 0.6, duration: 0.3 })}
        />
      )}
      <div ref={proxy} className="hidden" />

      {/* steam */}
      {g && (
        <div className="pointer-events-none absolute z-[6]" style={{ left: g.cx - g.S * 0.42, top: g.cy - g.S * 1.02, width: g.S * 0.84, height: g.S * 1.1 }}>
          <Steam className="h-full w-full" play={settled || !intro} intensity={settled ? 1 : 0.5} />
        </div>
      )}

      {/* callouts (desktop) */}
      {g && !g.mobile && (
        <div className="pointer-events-none absolute inset-0 z-[7]" key={`co-${active}`}>
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            {callouts.map((c) => (
              <polyline
                key={c.i}
                className="co co-line"
                points={`${c.ax},${c.ay} ${c.side === "l" ? c.ax - 18 : c.ax + 18},${c.ly} ${c.side === "l" ? c.lx + 4 : c.lx - 4},${c.ly}`}
                fill="none"
                stroke="var(--scene-deep)"
                strokeOpacity="0.55"
                strokeWidth="1.2"
                style={{ visibility: "hidden" }}
              />
            ))}
          </svg>
          {callouts.map((c) => (
            <div key={c.i}>
              <span className="co co-dot absolute grid h-4 w-4 place-items-center" style={{ left: c.ax - 8, top: c.ay - 8, visibility: "hidden" }}>
                <span className="pulse-ring absolute inset-0 rounded-full bg-paper/70" />
                <span className="relative h-2.5 w-2.5 rounded-full border-2 border-paper bg-[var(--scene-accent)]" />
              </span>
              <div
                data-side={c.side}
                className={`co co-label absolute w-[200px] ${c.side === "l" ? "text-right" : "text-left"}`}
                style={{ left: c.side === "l" ? c.lx - 200 : c.lx, top: c.ly - 20, visibility: "hidden" }}
              >
                <p className="display text-[1.35rem] leading-tight text-[var(--scene-deep)]">{c.label}</p>
                <p className="text-[0.78rem] font-medium text-ink-2">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* headline */}
      <div className="pointer-events-none relative z-[8] mx-auto flex max-w-[1200px] flex-col items-center px-5 pt-[calc(var(--nav-h)+2vh)] sm:pt-[calc(var(--nav-h)+4vh)]">
        <p className="h-fade eyebrow flex items-center gap-2 text-[var(--scene-deep)]/70">
          <span className="tabular-nums">No. {pad2(active + 1)}</span>
          <span className="h-px w-6 bg-current opacity-40" />
          <span className="h-swap">
            {sig.region === "naija" ? "Naija classic" : "Around the world"} · {sig.origin.city}
          </span>
        </p>
        <div className="mt-2 grid w-full place-items-center">
          {signatures.map((s, i) => (
            <Title key={s.slug} s={s} active={i === active} first={i === 0} />
          ))}
        </div>
        <p className="h-fade h-swap mt-3 max-w-[34rem] text-balance text-center text-[0.95rem] font-medium leading-snug text-ink-2 sm:text-base">{sig.tagline}</p>

        {/* mobile price row */}
        <div className="h-fade pointer-events-auto mt-4 flex items-center gap-3 md:hidden">
          <span className="h-price display text-3xl tabular-nums text-[var(--scene-deep)]">{money(signatures[0].price)}</span>
          <button type="button" onClick={addActive} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add to order
          </button>
        </div>
      </div>

      {/* desktop side columns */}
      {g && !g.mobile && (
        <>
          <div className="h-side-l absolute z-[8] w-[220px]" style={{ left: "clamp(20px, 3.2vw, 56px)", top: g.cy - g.S * 0.42 }}>
            <p className="eyebrow text-ink-3">Price</p>
            <p className="h-price display mt-1 text-5xl tabular-nums text-[var(--scene-deep)]">{money(signatures[0].price)}</p>
            <button type="button" onClick={addActive} className="btn btn-primary mt-5">
              <Plus size={18} /> Add to order
            </button>
            <TLink href={`/menu/${sig.slug}`} className="mt-4 flex items-center gap-2 text-sm font-bold text-[var(--scene-deep)]">
              <span className="link-u">Customize this plate</span> <ArrowRight size={16} />
            </TLink>
          </div>
          <dl className="h-side-r absolute z-[8] w-[190px] space-y-4 text-right" style={{ right: "clamp(20px, 3.2vw, 56px)", top: g.cy - g.S * 0.42 }}>
            <div>
              <dt className="eyebrow text-ink-3">Heat</dt>
              <dd className="mt-1 flex justify-end gap-0.5 text-[var(--scene-accent)]" aria-label={`${sig.heat} of 3`}>
                {[0, 1, 2].map((h) => (
                  <Pepper key={h} size={20} filled={h < sig.heat} className={h < sig.heat ? "" : "opacity-30"} />
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-3">At your table in</dt>
              <dd className="h-swap mt-1 flex items-center justify-end gap-1.5 text-lg font-bold">
                <Clock size={18} /> {sig.time}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-3">From</dt>
              <dd className="h-swap mt-1 text-lg font-bold">
                {sig.origin.city}, {sig.origin.country}
              </dd>
              <dd className="h-swap text-xs tabular-nums text-ink-3">{sig.origin.coords}</dd>
            </div>
          </dl>
        </>
      )}

      {/* mobile callout caption */}
      {g && g.mobile && settled && intro && (
        <div className="pointer-events-none absolute inset-x-0 z-[8] flex justify-center px-6" style={{ top: g.cy + g.S * 0.5 + 6 }}>
          <p key={`${active}-${mobileCallout}`} className="animate-[fadeIn_.5s_ease] rounded-full bg-paper/85 px-3.5 py-1.5 text-center text-xs font-semibold text-ink shadow-sm backdrop-blur">
            <span className="text-[var(--scene-accent)]">●</span> {sig.callouts[mobileCallout]?.label} — <span className="text-ink-2">{sig.callouts[mobileCallout]?.note}</span>
          </p>
        </div>
      )}

      {/* controls */}
      <div className="h-fade absolute bottom-[max(18px,2.4vh)] left-0 right-0 z-[9] flex items-center justify-between px-4 sm:px-8 md:justify-center">
        <div className="flex items-center gap-2 rounded-full bg-paper/80 p-1.5 shadow-[0_10px_40px_-18px_rgba(29,20,16,.5)] backdrop-blur-md">
          <button type="button" className="icon-btn bg-ink text-paper hover:bg-[var(--scene-accent)]" onClick={() => step(-1)} aria-label="Previous dish">
            <ArrowLeft />
          </button>
          <div className="hidden items-center gap-1 px-2 sm:flex" role="tablist" aria-label="Choose a dish">
            {signatures.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.name}
                onClick={() => goToIndex(i)}
                className="group relative grid h-10 place-items-center px-1.5"
              >
                <span
                  className="block h-1.5 rounded-full transition-all duration-500"
                  style={{ width: i === active ? 34 : 10, background: i === active ? "var(--scene-accent)" : "rgb(29 20 16 / .2)" }}
                />
                <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[0.7rem] font-bold text-paper opacity-0 transition-opacity group-hover:opacity-100">
                  {s.short}
                </span>
              </button>
            ))}
          </div>
          <span className="px-2 text-sm font-bold tabular-nums sm:hidden">
            {pad2(active + 1)} <span className="text-ink-3">/ {pad2(N)}</span>
          </span>
          <button type="button" className="icon-btn bg-ink text-paper hover:bg-[var(--scene-accent)]" onClick={() => step(1)} aria-label="Next dish">
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* envelope */}
      <div className="h-env absolute bottom-[max(64px,8vh)] right-4 z-[9] sm:bottom-[max(70px,9vh)] sm:right-[clamp(20px,3.2vw,56px)]">
        <Envelope width={g?.mobile ? 118 : 172} title="Find a table" sub="Reservations" onOpen={() => go("/reserve")} />
      </div>

      {/* drag cursor */}
      <div ref={cursor} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[20] -ml-11 -mt-11 hidden h-22 w-22 place-items-center rounded-full bg-ink text-paper opacity-0 md:grid" style={{ width: 88, height: 88 }}>
        <span className="flex flex-col items-center text-[0.65rem] font-bold uppercase tracking-widest">
          <Hand size={20} />
          Drag
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {sig.name}, {money(sig.price)}. {sig.tagline}
      </p>
    </section>
  );
}
