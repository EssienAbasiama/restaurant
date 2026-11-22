"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { img } from "@/lib/images";

type Token = string | { pic: StaticImageData; alt: string };

const TEXT: Token[] = [
  "We cook the food we grew up on: smoky party jollof",
  { pic: img.chickenJollof, alt: "Jollof rice with chicken" },
  ", egusi thick enough to stand a spoon in",
  { pic: img.egusi, alt: "Egusi soup with assorted meat" },
  ", suya wrapped in yesterday's news",
  { pic: img.suyaGrill, alt: "Suya skewers on the grill" },
  " — right beside the dishes we fell for on the road. Tokyo ramen",
  { pic: img.tonkotsu, alt: "Tonkotsu ramen" },
  ", Roman carbonara",
  { pic: img.carbonara, alt: "Spaghetti carbonara" },
  ", Neapolitan fire",
  { pic: img.margherita, alt: "Margherita pizza" },
  ". One kitchen. One table. The whole world, passed to your left.",
];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>(".mw", ref.current);
      const pics = gsap.utils.toArray<HTMLElement>(".mp", ref.current);
      gsap.set(pics, { scale: 0, rotate: -12 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".m-text", start: "top 78%", end: "bottom 45%", scrub: 0.6 } });
      tl.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: "none" });
      pics.forEach((p) => {
        const idx = Number(p.dataset.at);
        tl.to(p, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }, idx * 0.05);
      });
      gsap.from(".m-sig", { autoAlpha: 0, y: 20, scrollTrigger: { trigger: ".m-sig", start: "top 92%" } });
    },
    { scope: ref },
  );

  let wi = 0;
  return (
    <section id="story" ref={ref} className="relative mx-auto max-w-[1280px] px-5 py-28 sm:px-10 sm:py-40">
      <p className="eyebrow mb-8 flex items-center gap-3 text-palm">
        <span className="h-px w-10 bg-current" /> Our story
      </p>
      <p className="m-text display text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.03em]">
        {TEXT.map((t, i) => {
          if (typeof t !== "string")
            return (
              <span key={i} data-at={wi} className="mp relative mx-[0.12em] inline-block h-[0.78em] w-[1.45em] overflow-hidden rounded-full align-[-0.06em] shadow-lg">
                <Image src={t.pic} alt={t.alt} fill sizes="140px" className="object-cover" placeholder="blur" />
              </span>
            );
          return t.split(/(\s+)/).map((w, j) => {
            if (/^\s+$/.test(w) || !w) return w;
            wi++;
            return (
              <span key={`${i}-${j}`} className="mw">
                {w}
              </span>
            );
          });
        })}
      </p>
      <div className="m-sig mt-14 flex flex-wrap items-center gap-6">
        <p className="display-i text-3xl text-ink-2">— The Àdùn kitchen</p>
        <span className="h-px flex-1 bg-ink/15" />
        <p className="max-w-sm text-sm text-ink-2">
          Two kitchens, one pass: a Naija pot station and a world station, cooking side by side. Same fire, different passports.
        </p>
      </div>
    </section>
  );
}
