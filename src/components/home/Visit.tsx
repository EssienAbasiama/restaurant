"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { Envelope } from "@/components/ui/Envelope";
import { ArrowRight, Clock, Pin, Scooter } from "@/components/ui/icons";
import { TLink, useGo } from "@/components/shell/Transition";

export function Visit() {
  const ref = useRef<HTMLElement>(null);
  const go = useGo();

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".v-env", { y: 160, rotate: 18, autoAlpha: 0, duration: 1.3, ease: "back.out(1.3)", scrollTrigger: { trigger: ref.current, start: "top 65%" } });
      gsap.from(".v-head .char", { yPercent: 110, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".v-head", start: "top 85%" } });
      gsap.fromTo(".v-photo img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: ref },
  );

  const head = "Pull up a chair.";

  return (
    <section ref={ref} aria-label="Visit us" className="relative overflow-hidden bg-paper px-3 py-3 sm:px-5 sm:py-5">
      <div className="relative grid min-h-[86svh] overflow-hidden rounded-[32px] bg-ink text-paper md:grid-cols-[1.1fr_1fr]">
        <div className="v-photo absolute inset-0 md:relative">
          <Image src={img.diningDark} alt="The dining room at night" fill sizes="(min-width: 768px) 55vw, 100vw" placeholder="blur" className="object-cover opacity-45 md:opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-ink/20 md:to-ink" />
          <div className="v-env absolute bottom-[12%] left-1/2 hidden -translate-x-1/2 md:block">
            <Envelope width={300} title="Reserve your table" sub="You're invited" light onOpen={() => go("/reserve")} />
          </div>
        </div>
        <div className="relative z-[1] flex flex-col justify-end gap-10 p-7 pt-40 sm:p-12 md:justify-center md:p-16">
          <h2 className="v-head display text-[clamp(3.2rem,7vw,7rem)]" aria-label={head}>
            {head.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                {Array.from(w).map((c, j) => (
                  <span key={j} className="char">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="max-w-md text-lg text-paper/75">
            Counter seats at the belt, tables in the main room, and a garden terrace for long Lagos evenings. Walk-ins welcome; reservations make the jollof taste better.
          </p>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-2 text-palm">
                <Pin size={15} /> Find us
              </dt>
              <dd className="text-paper/85">
                {site.address.map((a) => (
                  <span key={a} className="block">
                    {a}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-2 text-palm">
                <Clock size={15} /> Hours
              </dt>
              <dd className="space-y-0.5 text-paper/85">
                {site.hours.map((h) => (
                  <span key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="tabular-nums">{h.time}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <TLink href="/reserve" className="btn btn-palm">
              Reserve a table <ArrowRight size={18} />
            </TLink>
            <TLink href="/menu" className="btn btn-light">
              <Scooter size={18} /> Order delivery
            </TLink>
          </div>
          <div className="md:hidden">
            <Envelope width={220} title="Reserve your table" sub="You're invited" light onOpen={() => go("/reserve")} />
            <div className="h-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
