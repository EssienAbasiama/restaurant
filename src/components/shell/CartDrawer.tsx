"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cartCount, cartSubtotal, useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { Thumb } from "@/components/ui/Thumb";
import { ArrowRight, Close, Minus, Plus, Scooter } from "@/components/ui/icons";
import { getLenis } from "./SmoothScroll";
import { useGo } from "./Transition";

export function EmptyPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <ellipse cx="104" cy="110" rx="86" ry="86" fill="#000" opacity="0.08" />
      <circle cx="100" cy="100" r="86" fill="#fff" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#2A4A9A" strokeWidth="8" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#E8E2D6" strokeWidth="2" />
      <path d="M150 40 l-60 90" stroke="#B9A88E" strokeWidth="5" strokeLinecap="round" />
      <path d="M160 48 l-60 90" stroke="#C9B89E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="76" cy="112" r="2.4" fill="#E2621B" />
      <circle cx="86" cy="124" r="1.8" fill="#E2621B" />
      <ellipse cx="118" cy="82" rx="4" ry="1.6" fill="#E8622A" transform="rotate(30 118 82)" />
    </svg>
  );
}

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const go = useGo();
  const sub = cartSubtotal(cart);
  const left = Math.max(0, site.freeDeliveryFrom - sub);
  const pct = Math.min(1, sub / site.freeDeliveryFrom);

  useEffect(() => {
    const p = panel.current;
    const s = scrim.current;
    if (!p || !s) return;
    if (open) {
      getLenis()?.stop();
      gsap.set([p, s], { visibility: "visible" });
      gsap.to(s, { opacity: 1, duration: 0.4 });
      // x: 0 clears the px offset GSAP parses from the inline translateX(105%)
      gsap.fromTo(p, { x: 0, xPercent: 105 }, { x: 0, xPercent: 0, duration: 0.7, ease: "expo.out" });
      gsap.fromTo(p.querySelectorAll(".cline"), { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.6, delay: 0.15 });
      closeBtn.current?.focus();
    } else {
      getLenis()?.start();
      gsap.to(s, { opacity: 0, duration: 0.35 });
      gsap.to(p, { xPercent: 105, duration: 0.5, ease: "power3.in", onComplete: () => void gsap.set([p, s], { visibility: "hidden" }) });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    const bar = panel.current?.querySelector(".cart-progress");
    const scooter = panel.current?.querySelector(".cart-scooter");
    if (bar) gsap.to(bar, { scaleX: pct, duration: 0.8, ease: "expo.out" });
    if (scooter) gsap.to(scooter, { left: `${pct * 100}%`, duration: 0.8, ease: "expo.out" });
  }, [pct, open]);

  return (
    <>
      <div ref={scrim} className="invisible fixed inset-0 z-[72] bg-ink/40 opacity-0 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="invisible fixed bottom-2 right-2 top-2 z-[73] flex w-[min(460px,calc(100vw-16px))] flex-col overflow-hidden rounded-[28px] bg-paper shadow-2xl"
        style={{ transform: "translateX(105%)" }}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between px-6 pb-3 pt-5">
          <div>
            <p className="eyebrow text-ink-3">Your order</p>
            <h2 className="display text-3xl">
              {cartCount(cart)} {cartCount(cart) === 1 ? "plate" : "plates"}
            </h2>
          </div>
          <button ref={closeBtn} type="button" className="icon-btn bg-ink/5 hover:bg-ink/10" onClick={() => setOpen(false)} aria-label="Close order">
            <Close />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <EmptyPlate className="w-44" />
            <h3 className="display mt-6 text-3xl">Your plate is empty.</h3>
            <p className="mt-2 max-w-xs text-ink-2">Somebody finished everything. Let&apos;s fix that.</p>
            <button
              type="button"
              className="btn btn-primary mt-6"
              onClick={() => {
                setOpen(false);
                window.setTimeout(() => go("/menu"), 300);
              }}
            >
              Browse the menu <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="mx-6 mb-2 rounded-2xl bg-ink/[0.04] p-4">
              <p className="text-sm font-semibold">
                {left > 0 ? (
                  <>
                    Add <span className="text-palm">{money(left)}</span> more for free delivery
                  </>
                ) : (
                  <>Free delivery unlocked. The rider is smiling.</>
                )}
              </p>
              <div className="relative mt-3 h-1.5 rounded-full bg-ink/10">
                <div className="cart-progress h-full origin-left scale-x-0 rounded-full bg-palm" />
                <span className="cart-scooter absolute -top-[13px] -ml-3 grid h-7 w-7 place-items-center rounded-full bg-ink text-paper" style={{ left: 0 }}>
                  <Scooter size={15} />
                </span>
              </div>
            </div>
            <ul className="flex-1 space-y-1 overflow-y-auto px-4 py-2 no-scrollbar">
              {cart.map((l) => (
                <li key={l.key} className="cline flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-ink/[0.03]">
                  <div className="h-16 w-16 shrink-0">
                    <Thumb thumb={l.thumb} size={64} className="h-16 w-16" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{l.name}</p>
                    {l.meta && <p className="truncate text-xs text-ink-3">{l.meta}</p>}
                    <p className="mt-0.5 text-sm font-semibold text-ink-2">{money(l.unit * l.qty)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-ink/5 p-1">
                    <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Remove one ${l.name}`}>
                      <Minus size={15} />
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums">{l.qty}</span>
                    <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Add one ${l.name}`}>
                      <Plus size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/10 px-6 pb-6 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-ink-2">Subtotal</span>
                <span className="display text-3xl tabular-nums">{money(sub)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-3">VAT (7.5%) and delivery calculated at checkout.</p>
              <button
                type="button"
                className="btn btn-palm mt-4 w-full !h-14 text-base"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => go("/checkout"), 300);
                }}
              >
                Checkout · {money(sub)} <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
