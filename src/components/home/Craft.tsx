"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { img } from "@/lib/images";

const STATS = [
  { n: 18, suffix: "hrs", label: "Tonkotsu broth at a rolling boil", note: "Pork bones, water, fire, time. That's the recipe." },
  { n: 485, suffix: "°C", label: "Inside the wood-fired oven", note: "Ninety seconds and the crust is leopard-spotted." },
  { n: 11, suffix: "", label: "Spices in our Kano yaji", note: "Roasted groundnut is the base. The other ten are a secret." },
  { n: 3, suffix: "×", label: "Every grain of rice is washed", note: "Because sticky jollof is a crime." },
];

export function Craft() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (reducedMotion()) return;
      gsap.fromTo(q(".cr-photo"), { clipPath: "inset(18% 12% 18% 12% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: q(".cr-photo"), start: "top 85%", end: "top 25%", scrub: true } });
      gsap.fromTo(q(".cr-photo img"), { scale: 1.3, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: q(".cr-photo"), start: "top bottom", end: "bottom top", scrub: true } });
      q(".cr-num").forEach((el) => {
        const target = Number(el.dataset.n);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => void (el.textContent = String(Math.round(o.v))),
        });
      });
      gsap.from(q(".cr-row"), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9, scrollTrigger: { trigger: q(".cr-list"), start: "top 80%" } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative mx-auto grid max-w-[1480px] gap-12 px-5 py-28 sm:px-10 md:grid-cols-[1fr_1.1fr] md:gap-20 md:py-40">
      <div className="relative">
        <div className="cr-photo relative aspect-[4/5] overflow-hidden rounded-[28px] md:sticky md:top-24">
          <Image src={img.chefFire} alt="A chef finishing dishes under copper lamps" fill sizes="(min-width: 768px) 45vw, 100vw" placeholder="blur" className="object-cover" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-pepper" /> The pass · 19:42, Friday
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="eyebrow mb-5 flex items-center gap-3 text-palm">
          <span className="h-px w-10 bg-current" /> Two kitchens, one fire
        </p>
        <h2 className="display text-[clamp(2.6rem,5.4vw,5rem)]">
          Numbers we <span className="display-i text-palm">don&apos;t</span> negotiate.
        </h2>
        <ul className="cr-list mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {STATS.map((s) => (
            <li key={s.label} className="cr-row grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-6 sm:gap-x-10">
              <p className="display row-span-2 min-w-[3.2ch] text-[clamp(3.4rem,7vw,6rem)] leading-none text-ink">
                <span className="cr-num tabular-nums" data-n={s.n}>
                  {s.n}
                </span>
                <span className="text-[0.45em] text-palm">{s.suffix}</span>
              </p>
              <p className="text-lg font-bold">{s.label}</p>
              <p className="text-sm text-ink-2">{s.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
