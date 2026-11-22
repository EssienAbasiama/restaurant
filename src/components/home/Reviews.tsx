"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { money } from "@/lib/format";
import { Star } from "@/components/ui/icons";

const TICKETS = [
  { table: "07", time: "19:42", who: "Tolu, Lekki", items: [["2", "Party Jollof", 27000], ["1", "Zobo", 2500]], quote: "Came for the jollof, stayed because I physically couldn't move. The bottom-pot bits deserve their own line on the menu." },
  { table: "12", time: "13:05", who: "Kenji, Ikoyi", items: [["1", "Tonkotsu", 16500], ["1", "Puff-Puff", 3500]], quote: "Tasted like Fukuoka at 1am. Then puff-puff for dessert. Best decision I have made this year." },
  { table: "03", time: "20:18", who: "Amaka, Yaba", items: [["1", "Egusi & Pounded Yam", 15000], ["1", "Chapman", 3500]], quote: "My mum asked who made the egusi. I said 'me'. Àdùn, please forgive me." },
  { table: "21", time: "21:30", who: "Marco, Victoria Island", items: [["1", "Carbonara", 17500], ["1", "Tiramisu", 6500]], quote: "No cream. Correct. I am Roman and I am crying a little bit." },
  { table: "Belt", time: "14:11", who: "Halima, Surulere", items: [["5", "Plates off the belt", 18500]], quote: "Salmon nigiri, then suya, then puff-puff, then more salmon. The belt knows me now." },
] as const;

export function Reviews() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".tk", {
        y: -220,
        rotate: (i) => (i % 2 ? 14 : -12),
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.4,
        ease: "elastic.out(1, 0.55)",
        scrollTrigger: { trigger: ".tk-rail", start: "top 78%" },
      });
    },
    { scope: ref },
  );

  const swing = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
    gsap.fromTo(e.currentTarget, { rotate: dir * 7 }, { rotate: Number(e.currentTarget.dataset.rest), duration: 1.6, ease: "elastic.out(1.2, 0.25)" });
  };

  return (
    <section ref={ref} aria-label="Overheard at the table" className="relative overflow-hidden bg-paper-2 py-28 md:py-36">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-10">
        <p className="eyebrow mb-4 flex items-center gap-3 text-palm">
          <span className="h-px w-10 bg-current" /> Overheard at the table
        </p>
        <h2 className="display max-w-3xl text-[clamp(2.6rem,5.4vw,5rem)]">
          Straight off the <span className="display-i text-palm">ticket rail.</span>
        </h2>
      </div>
      <div className="tk-rail relative mt-14">
        <div className="absolute inset-x-0 top-3 h-3 bg-gradient-to-b from-[#C9CDD2] via-[#8D9399] to-[#5E646A] shadow-[0_6px_12px_-4px_rgba(0,0,0,.35)]" />
        <div className="no-scrollbar relative flex snap-x gap-5 overflow-x-auto px-5 pb-10 pt-0 sm:px-10 lg:justify-center" data-lenis-prevent-horizontal>
          {TICKETS.map((t, i) => {
            const rest = [-2, 1.5, -1, 2.5, -1.5][i];
            const total = t.items.reduce((n, it) => n + it[2], 0);
            return (
              <article
                key={t.who}
                data-rest={rest}
                onPointerEnter={swing}
                className="tk relative w-[270px] shrink-0 snap-center origin-top pt-6"
                style={{ transform: `rotate(${rest}deg)` }}
              >
                <span className="absolute left-1/2 top-0 h-7 w-4 -translate-x-1/2 rounded-sm bg-gradient-to-b from-[#B7BCC2] to-[#6E747A] shadow" />
                <div
                  className="relative bg-[#FFFDF7] px-5 pb-6 pt-5 font-mono text-[0.78rem] text-ink shadow-[0_18px_30px_-16px_rgba(29,20,16,.45)]"
                  style={{
                    WebkitMaskImage: "radial-gradient(circle 5px at 8px 100%, transparent 98%, #000) -8px 0 / 16px 100% repeat-x",
                    maskImage: "radial-gradient(circle 5px at 8px 100%, transparent 98%, #000) -8px 0 / 16px 100% repeat-x",
                  }}
                >
                  <div className="flex justify-between border-b border-dashed border-ink/25 pb-2 text-[0.7rem] font-bold uppercase tracking-wider">
                    <span>Table {t.table}</span>
                    <span>{t.time}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {t.items.map(([q, name, p]) => (
                      <li key={name} className="flex gap-1">
                        <span>{q}×</span>
                        <span className="truncate">{name}</span>
                        <span className="flex-1 translate-y-[-3px] border-b border-dotted border-ink/30" />
                        <span className="tabular-nums">{money(p)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex justify-between border-t border-dashed border-ink/25 pt-1 font-bold">
                    <span>TOTAL</span>
                    <span className="tabular-nums">{money(total)}</span>
                  </div>
                  <p className="display-i mt-4 font-[family-name:var(--font-display)] text-[1.15rem] leading-snug text-ink-2">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex text-palm" aria-label="5 out of 5">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} size={14} />
                      ))}
                    </span>
                    <span className="text-[0.7rem] font-bold">— {t.who}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="px-5 text-center text-xs text-ink-3 sm:px-10">Illustrative tickets for this concept. Hover one to give it a swing.</p>
      </div>
    </section>
  );
}
