"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";
import { img } from "@/lib/images";

const DISHES: [string, StaticImageData][] = [
  ["Party Jollof", img.chickenJollof],
  ["Tonkotsu", img.tonkotsu],
  ["Egusi", img.egusi],
  ["Carbonara", img.carbonara],
  ["Suya", img.suyaGrill],
  ["Margherita", img.margherita],
  ["Puff-Puff", img.puffPuff],
  ["Sushi", img.sushiBoat],
];
const CITIES = ["Lagos", "Tokyo", "Enugu", "Rome", "Kano", "Naples", "Calabar", "Buenos Aires"];

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mq-row flex w-max whitespace-nowrap will-change-transform ${className ?? ""}`}>
      <div className="flex shrink-0 items-center">{children}</div>
      <div className="flex shrink-0 items-center" aria-hidden>
        {children}
      </div>
    </div>
  );
}

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-[0.35em] h-[0.45em] w-[0.45em] shrink-0 text-palm" aria-hidden>
    <path d="M12 0l2.6 8.4L24 12l-9.4 3.6L12 24l-2.6-8.4L0 12l9.4-3.6Z" fill="currentColor" />
  </svg>
);

export function Marquee() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>(".mq-row", ref.current);
      const tweens = rows.map((r, i) =>
        gsap.fromTo(r, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: i % 2 ? 48 : 40, ease: "none", repeat: -1 }),
      );
      let dir = 1;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          dir = self.direction;
          const boost = 1 + Math.min(5, Math.abs(v) / 260);
          tweens.forEach((t) => gsap.to(t, { timeScale: boost * dir, duration: 0.2, overwrite: true }));
          tweens.forEach((t) => gsap.to(t, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" }));
        },
      });
      gsap.from(ref.current, { rotate: -2.5, scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="What's cooking" className="relative z-[2] -mt-6 overflow-hidden bg-ink py-7 text-paper shadow-[0_-30px_60px_-30px_rgba(0,0,0,.4)] sm:py-10">
      <Row className="display text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.05]">
        {DISHES.map(([name, src]) => (
          <span key={name} className="flex items-center">
            <span className="px-[0.2em]">{name}</span>
            <span className="relative mx-[0.15em] inline-block h-[0.82em] w-[1.5em] overflow-hidden rounded-full">
              <Image src={src} alt="" fill sizes="160px" className="object-cover" placeholder="blur" />
            </span>
          </span>
        ))}
      </Row>
      <Row className="display-i mt-1 text-[clamp(2.2rem,5.6vw,5.2rem)] leading-[1.05] text-paper/40">
        {CITIES.map((c) => (
          <span key={c} className="flex items-center">
            <span className="px-[0.2em]">{c}</span>
            <Star />
          </span>
        ))}
      </Row>
    </section>
  );
}
