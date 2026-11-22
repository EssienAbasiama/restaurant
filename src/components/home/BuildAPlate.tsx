"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { DishArt } from "@/components/art/DishArt";
import { Steam } from "@/components/art/Steam";
import { pad2 } from "@/lib/format";

const STEPS = [
  { t: "The ata base", d: "Tomatoes, tatashe and scotch bonnet, blended and fried low until the oil floats to the top. No shortcuts, no tin." },
  { t: "Long grain, washed thrice", d: "Parboiled rice steamed in that base with thyme, curry and bay, lid on, heat low, patience high." },
  { t: "The party smoke", d: "We let the bottom catch on purpose. That smoky, crispy char is the whole point of party jollof." },
  { t: "Peppered chicken", d: "Marinated overnight, roasted, then tossed in a sauce of ata rodo and onions until it glistens." },
  { t: "Dodo, always", d: "Ripe plantain, fried until the edges go amber. Non-negotiable. Ask any Nigerian." },
  { t: "Serve hot. Fight for the bottom.", d: "Coleslaw on the side, steam on the top. You have about forty seconds before someone asks for a taste." },
];

export function BuildAPlate() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const L = (n: string) => q(`.bp-plate [data-layer="${n}"]`);
      const grains = q('.bp-plate [data-layer="grains"] ellipse[data-grain=""]');
      const smoke = q('.bp-plate [data-layer="grains"] ellipse[data-grain="smoke"]');
      const heat = q('.bp-plate [data-stage="5"]');
      const sheen = q('.bp-plate [data-layer="grains"] > path');
      if (reducedMotion()) return;

      gsap.set([...L("sauce"), ...L("chicken"), ...L("dodo"), ...L("slaw"), ...L("leaf"), ...heat], { autoAlpha: 0 });
      gsap.set(grains, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set([...smoke, ...sheen], { autoAlpha: 0 });
      gsap.set(q(".bp-steam"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.2}`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999))),
        },
      });
      tl.fromTo(q(".bp-plate"), { scale: 0.82, rotate: -30 }, { scale: 1, rotate: 0, duration: 1 })
        .fromTo(L("sauce"), { autoAlpha: 0, scale: 0.2, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "back.out(1.4)" }, 0.3)
        .to(grains, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: { amount: 1.6, from: "random" } }, 1.6)
        .to(sheen, { autoAlpha: 1, duration: 0.8 }, 2.8)
        .to(smoke, { autoAlpha: 1, duration: 0.3, stagger: { amount: 0.8, from: "random" } }, 3.6)
        .fromTo(L("chicken"), { autoAlpha: 0, y: -160, rotate: -40, scale: 1.3 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 1, ease: "bounce.out" }, 4.9)
        .set(L("dodo"), { autoAlpha: 1 }, 6.2)
        .from(q('.bp-plate [data-layer="dodo"] > g'), { autoAlpha: 0, x: "+=140", rotation: "+=70", duration: 0.8, stagger: 0.25, ease: "back.out(1.6)", immediateRender: true }, 6.2)
        .fromTo([...L("slaw"), ...L("leaf"), ...heat], { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(2)" }, 7.6)
        .to(q(".bp-steam"), { autoAlpha: 1, duration: 0.8 }, 8)
        .to({}, { duration: 1 });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="How we build a plate of party jollof" className="relative flex h-svh min-h-[640px] items-center overflow-hidden bg-paper-2">
      <div aria-hidden className="pointer-events-none absolute -left-[4vw] top-1/2 -translate-y-1/2 select-none">
        <span className="display outline-text block text-[38vw] leading-none text-ink/[0.07]">{pad2(step + 1)}</span>
      </div>
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-rows-[auto_1fr] items-center gap-6 px-5 sm:px-10 md:grid-cols-[1.05fr_1fr] md:grid-rows-1 md:gap-16">
        <div className="relative mx-auto aspect-square w-[min(78vw,44vh)] md:order-none md:w-[min(42vw,72vh)]">
          <div className="absolute inset-[6%] rounded-full bg-[#2c1a10]/25 blur-2xl" />
          <DishArt slug="party-jollof" className="bp-plate relative h-full w-full" label="Party jollof being plated" />
          <div className="bp-steam pointer-events-none absolute -top-[30%] left-[18%] h-[90%] w-[64%]">
            <Steam className="h-full w-full" />
          </div>
        </div>

        <div className="relative">
          <p className="eyebrow mb-4 flex items-center gap-3 text-palm">
            <span className="h-px w-10 bg-current" /> Anatomy of a party jollof
          </p>
          <ol className="relative hidden space-y-1 md:block">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-5 py-2 transition-all duration-500" style={{ opacity: i === step ? 1 : i < step ? 0.4 : 0.18 }}>
                <span className="mt-2 w-8 shrink-0 text-sm font-bold tabular-nums text-palm">{pad2(i + 1)}</span>
                <div>
                  <h3 className="display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-tight">{s.t}</h3>
                  <p className="grid transition-all duration-500" style={{ gridTemplateRows: i === step ? "1fr" : "0fr" }}>
                    <span className="overflow-hidden text-ink-2">
                      <span className="block max-w-md pt-2 leading-relaxed">{s.d}</span>
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[9.5rem] md:hidden">
            {STEPS.map((s, i) => (
              <div key={s.t} className="absolute inset-x-0 top-0 transition-all duration-500" style={{ opacity: i === step ? 1 : 0, transform: `translateY(${i === step ? 0 : i < step ? -14 : 14}px)` }} aria-hidden={i !== step}>
                <h3 className="display text-3xl leading-tight">
                  <span className="mr-2 text-base font-bold text-palm">{pad2(i + 1)}</span>
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-1 w-full max-w-md overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-palm transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
