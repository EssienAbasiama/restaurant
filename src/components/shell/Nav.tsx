"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cartCount, useStore } from "@/lib/store";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Bowl, Close, Envelope, Menu } from "@/components/ui/icons";
import { getLenis } from "./SmoothScroll";
import { TLink, useGo } from "./Transition";
import { RouteWatcher } from "./RouteWatcher";

const LINKS = [
  { href: "/menu", label: "Menu", img: img.naijaSpread },
  { href: "/#belt", label: "The Belt", img: img.sushiBoat },
  { href: "/#story", label: "Our story", img: img.chefFire },
  { href: "/reserve", label: "Reserve", img: img.diningRoom },
];

export function Nav() {
  const header = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverImg, setHoverImg] = useState(0);
  const overlay = useRef<HTMLDivElement>(null);
  const cart = useStore((s) => s.cart);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const count = cartCount(cart);
  const go = useGo();

  useEffect(() => {
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const down = y > last && y > 160;
      if (down !== hidden && !open) {
        hidden = down;
        gsap.to(header.current, { yPercent: down ? -130 : 0, duration: 0.5, ease: "power3.out" });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const onRoute = useCallback(() => {
    gsap.set(header.current, { yPercent: 0 });
  }, []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    if (open) {
      getLenis()?.stop();
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(el, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".mlink"), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.3 });
    } else {
      getLenis()?.start();
      gsap.to(el, { clipPath: "circle(0% at 92% 4%)", duration: 0.6, ease: "expo.inOut", onComplete: () => void gsap.set(el, { visibility: "hidden" }) });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <RouteWatcher onChange={onRoute} />
      <header ref={header} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          aria-label="Main"
          className={`mx-auto flex h-[60px] max-w-[1480px] items-center justify-between rounded-full pl-4 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:pl-5 ${
            scrolled ? "bg-paper/80 shadow-[0_10px_40px_-20px_rgba(29,20,16,.5)] backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <TLink href="/" aria-label={`${site.name} home`}>
            <Logo />
          </TLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.slice(0, 3).map((l) => (
              <li key={l.href}>
                <TLink href={l.href} className="rounded-full px-4 py-2 text-[0.92rem] font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink">
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <TLink href="/reserve" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              <Envelope size={17} /> Reserve
            </TLink>
            <button
              type="button"
              data-cart-target
              onClick={() => setCartOpen(true)}
              className="btn btn-primary btn-sm !px-4"
              aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
            >
              <Bowl size={18} />
              <span className="tabular-nums">{count}</span>
            </button>
            <button type="button" className="icon-btn hover:bg-ink/5 lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <Menu />
            </button>
          </div>
        </nav>
      </header>

      <div ref={overlay} className="invisible fixed inset-0 z-[70] bg-ink text-paper" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="flex h-full flex-col px-6 pb-8 pt-5 sm:px-10">
          <div className="flex items-center justify-between">
            <Logo light />
            <button type="button" className="icon-btn bg-paper/10 hover:bg-paper/20" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Close />
            </button>
          </div>
          <div className="grid flex-1 items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <button
                    type="button"
                    onMouseEnter={() => setHoverImg(i)}
                    onFocus={() => setHoverImg(i)}
                    onClick={() => {
                      setOpen(false);
                      window.setTimeout(() => go(l.href), 250);
                    }}
                    className="mlink display block text-left text-[clamp(3rem,11vw,6.5rem)] leading-[1.02] text-paper transition-colors hover:text-palm"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[2rem] md:block">
              {LINKS.map((l, i) => (
                <Image
                  key={l.href}
                  src={l.img}
                  alt=""
                  fill
                  sizes="40vw"
                  placeholder="blur"
                  className="object-cover transition-[opacity,transform] duration-700"
                  style={{ opacity: hoverImg === i ? 1 : 0, transform: hoverImg === i ? "scale(1)" : "scale(1.08)" }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 text-sm text-paper/60">
            <p>
              {site.address.join(", ")} · <span className="text-paper/80">{site.hours[0].time}</span>
            </p>
            <p className="eyebrow text-palm">{site.tagline}</p>
          </div>
        </div>
      </div>
    </>
  );
}
