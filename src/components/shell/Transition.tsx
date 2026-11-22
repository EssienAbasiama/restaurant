"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "./SmoothScroll";
import { site } from "@/lib/site";
import { RouteWatcher } from "./RouteWatcher";

type Ctx = { go: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ go: () => {} });
export const useGo = () => useContext(TransitionCtx).go;

/** Seconds a page should wait before running its entrance animation. */
export const enterDelay = () => {
  if (typeof window === "undefined") return 0.2;
  const w = window as unknown as { __adunNav?: number };
  return w.__adunNav && performance.now() - w.__adunNav < 1500 ? 0.55 : 0.15;
};

const PANELS = [
  ["#1d1410", "#e2621b", "#f2b23a"],
  ["#1f2a55", "#f5eee3", "#e2621b"],
  ["#c3301e", "#1d1410", "#f2b23a"],
  ["#2e5b3a", "#f2b23a", "#f5eee3"],
  ["#1d1410", "#c3301e", "#f5eee3"],
];

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const go = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(url.hash);
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;
      if (reducedMotion() || !curtain.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = url.pathname;
      const el = curtain.current;
      const panels = el.querySelectorAll(".cpanel");
      gsap.killTweensOf(panels);
      gsap.set(el, { visibility: "visible" });
      const tl = gsap.timeline({
        onComplete: () => {
          (window as unknown as { __adunNav?: number }).__adunNav = performance.now();
          router.push(href);
        },
      });
      tl.fromTo(panels, { yPercent: -101 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut", stagger: 0.045 });
      tl.fromTo(el.querySelector(".clabel"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.25");
      // safety: never leave the curtain stuck
      window.setTimeout(() => {
        if (busy.current && pending.current) reveal();
      }, 4500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  const reveal = useCallback(() => {
    const el = curtain.current;
    if (!el) return;
    pending.current = null;
    const panels = el.querySelectorAll(".cpanel");
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    gsap
      .timeline({
        delay: 0.12,
        onComplete: () => {
          gsap.set(el, { visibility: "hidden" });
          busy.current = false;
        },
      })
      .to(el.querySelector(".clabel"), { autoAlpha: 0, y: -16, duration: 0.25 })
      .to(panels, { yPercent: 101, duration: 0.7, ease: "power3.inOut", stagger: 0.05 }, "<");
  }, []);

  const onRoute = useCallback(() => {
    if (pending.current) reveal();
  }, [reveal]);

  return (
    <TransitionCtx.Provider value={{ go }}>
      <RouteWatcher onChange={onRoute} />
      {children}
      <div ref={curtain} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[80] flex">
        {PANELS.map(([a, b, c], i) => (
          <div
            key={i}
            className="cpanel h-full flex-1"
            style={{
              transform: "translateY(-101%)",
              background: `repeating-linear-gradient(0deg, ${a} 0 26px, ${b} 26px 30px, ${a} 30px 54px, ${c} 54px 56px), ${a}`,
            }}
          />
        ))}
        <div className="clabel invisible absolute inset-0 grid place-items-center">
          <div className="rounded-full bg-paper px-7 py-4 text-center shadow-2xl">
            <span className="display text-4xl text-ink">{site.name}</span>
            <span className="eyebrow mt-1 block text-ink-3">plating…</span>
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

/** next/link that plays the curtain. */
export function TLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: React.ComponentProps<typeof Link> & { href: string }) {
  const go = useGo();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (href.startsWith("http")) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
