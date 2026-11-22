"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { menuById, type MenuItem } from "@/lib/menu";
import { money } from "@/lib/format";
import { useOrder } from "@/lib/useOrder";
import { Plus, ArrowRight } from "@/components/ui/icons";
import { TLink } from "@/components/shell/Transition";

const IDS = ["puff-puff", "pepper-soup", "sushi-boat", "efo-riro", "burger", "gyoza", "croaker-dodo", "takoyaki", "chapman", "tiramisu", "zobo", "mochi"];

function Card({ item, i }: { item: MenuItem; i: number }) {
  const { addItem } = useOrder();
  const imgRef = useRef<HTMLDivElement>(null);
  const tall = i % 3 === 0;
  return (
    <article className={`g-card group relative w-[78vw] shrink-0 snap-center sm:w-[44vw] md:w-[clamp(260px,24vw,380px)] ${i % 2 ? "md:mt-24" : ""}`}>
      <div ref={imgRef} className={`relative overflow-hidden rounded-[24px] bg-paper-3 ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 768px) 26vw, 80vw"
          placeholder="blur"
          className="g-img scale-[1.18] object-cover transition-[filter] duration-500 group-hover:saturate-[1.15]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">{item.origin}</span>
        <button
          type="button"
          onClick={() => addItem(item, imgRef.current?.querySelector("img"))}
          className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-ink text-paper shadow-xl transition-transform duration-500 hover:scale-110 hover:bg-palm"
          aria-label={`Add ${item.name} to order`}
        >
          <Plus />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display text-2xl leading-tight">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-2">{item.desc}</p>
        </div>
        <p className="shrink-0 pt-1 font-bold tabular-nums">{money(item.price)}</p>
      </div>
    </article>
  );
}

export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = IDS.map(menuById).filter(Boolean) as MenuItem[];

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth + 80;
        const h = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".g-img", t).forEach((im) => {
          gsap.fromTo(im, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: im, containerAnimation: h, start: "left right", end: "right left", scrub: true } });
        });
        gsap.to(".g-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${dist()}`, scrub: true } });
      });
      gsap.from(".g-head > *", { y: 40, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Beyond the table" className="relative overflow-hidden bg-paper py-20 md:flex md:h-svh md:min-h-[720px] md:flex-col md:justify-center md:py-0">
      <div className="g-head mx-auto flex w-full max-w-[1480px] flex-wrap items-end justify-between gap-6 px-5 sm:px-10">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-3 text-palm">
            <span className="h-px w-10 bg-current" /> Beyond the table
          </p>
          <h2 className="display text-[clamp(2.6rem,5.4vw,5rem)]">
            Small plates, <span className="display-i text-palm">big</span> feelings.
          </h2>
        </div>
        <TLink href="/menu" className="btn btn-ghost">
          Full menu <ArrowRight size={18} />
        </TLink>
      </div>
      <div className="no-scrollbar mt-10 overflow-x-auto md:mt-12 md:overflow-visible" data-lenis-prevent-horizontal>
        <div ref={track} className="flex w-max snap-x snap-mandatory items-start gap-5 px-5 sm:px-10 md:gap-8">
          {items.map((it, i) => (
            <Card key={it.id} item={it} i={i} />
          ))}
          <TLink href="/menu" className="group grid aspect-[4/5] w-[60vw] shrink-0 place-items-center rounded-[24px] bg-ink text-paper sm:w-[30vw] md:mt-12 md:w-[clamp(240px,20vw,320px)]">
            <span className="text-center">
              <span className="display block text-5xl">See it all</span>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-palm">
                35+ dishes <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </TLink>
        </div>
      </div>
      <div className="mx-auto mt-10 hidden h-px w-full max-w-[1480px] px-10 md:block">
        <div className="h-px bg-ink/10">
          <div className="g-progress h-px origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}
