"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { site } from "@/lib/site";

const STEPS = ["Lighting the coals", "Washing the rice (three times)", "Frying the ata base", "Pulling noodles", "Plating"];

export const markReady = () => {
  const w = window as unknown as { __adunReady?: boolean };
  w.__adunReady = true;
  window.dispatchEvent(new Event("adun:ready"));
};

/** Resolves when the first-visit preloader has lifted (immediately on later visits). */
export const whenReady = (cb: () => void) => {
  const w = window as unknown as { __adunReady?: boolean };
  if (w.__adunReady || document.documentElement.dataset.loaded) {
    cb();
    return () => {};
  }
  window.addEventListener("adun:ready", cb, { once: true });
  return () => window.removeEventListener("adun:ready", cb);
};

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (document.documentElement.dataset.loaded || reducedMotion()) {
      el.style.display = "none";
      markReady();
      return;
    }
    try {
      sessionStorage.setItem("adun-loaded", "1");
    } catch {}
    const count = { v: 0 };
    const num = el.querySelector<HTMLElement>(".pl-num");
    const step = el.querySelector<HTMLElement>(".pl-step");
    const tl = gsap.timeline();
    tl.from(el.querySelectorAll(".pl-char"), { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "expo.out" })
      .from(el.querySelector(".pl-sub"), { autoAlpha: 0, y: 10, duration: 0.5 }, "-=0.5")
      .to(
        count,
        {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(count.v);
            if (num) num.textContent = String(v).padStart(3, "0");
            if (step) step.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor(v / 21))];
          },
        },
        0.2,
      )
      .to(el.querySelector(".pl-bar"), { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.2)
      .to(el.querySelectorAll(".pl-char"), { yPercent: -110, duration: 0.6, stagger: 0.03, ease: "power3.in" }, "+=0.1")
      .to(el.querySelectorAll(".pl-fade"), { autoAlpha: 0, duration: 0.3 }, "<")
      .add(() => markReady(), "-=0.15")
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.2")
      .set(el, { display: "none" });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[85] flex flex-col items-center justify-center bg-ink text-paper"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden
    >
      <div className="display flex overflow-hidden text-[clamp(5rem,18vw,15rem)] leading-[1]" style={{ paddingBottom: "0.06em" }}>
        {Array.from(site.name).map((c, i) => (
          <span key={i} className="pl-char inline-block">
            {c}
          </span>
        ))}
      </div>
      <p className="pl-sub pl-fade eyebrow mt-4 text-paper/60">{site.meaning}</p>
      <div className="pl-fade absolute inset-x-6 bottom-8 flex items-end justify-between gap-6 sm:inset-x-10">
        <span className="pl-step text-sm text-paper/70">{STEPS[0]}</span>
        <span className="pl-num display text-5xl tabular-nums text-palm">000</span>
      </div>
      <div className="pl-fade absolute inset-x-0 bottom-0 h-1 bg-paper/10">
        <div className="pl-bar h-full origin-left scale-x-0 bg-palm" />
      </div>
    </div>
  );
}
