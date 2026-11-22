"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (lenis) lenis.scrollTo(target, { immediate, offset: typeof target === "number" ? 0 : -20, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const l = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
