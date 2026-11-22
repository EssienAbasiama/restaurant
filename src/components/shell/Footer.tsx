"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import { TLink } from "./Transition";
import { ArrowRight } from "@/components/ui/icons";

/** Adire-inspired indigo resist-dye band. */
export function AdireBand({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="56" aria-hidden>
      <defs>
        <pattern id="adire" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect width="56" height="56" fill="#1F2A55" />
          <circle cx="28" cy="28" r="12" fill="none" stroke="#E9E4F5" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="28" cy="28" r="4" fill="#E9E4F5" />
          <path d="M0 0 L10 10 M56 0 L46 10 M0 56 L10 46 M56 56 L46 46" stroke="#E9E4F5" strokeWidth="2" />
          <circle cx="0" cy="28" r="2" fill="#E9E4F5" />
          <circle cx="56" cy="28" r="2" fill="#E9E4F5" />
        </pattern>
      </defs>
      <rect width="100%" height="56" fill="url(#adire)" />
    </svg>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".f-char", {
        yPercent: 100,
        stagger: 0.05,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".f-word", start: "top 92%" },
      });
    },
    { scope: ref },
  );

  const bounce = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.fromTo(e.currentTarget, { y: 0 }, { y: -24, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" });
  };

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-paper">
      <AdireBand />
      <div className="mx-auto max-w-[1480px] px-5 pb-8 pt-16 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="display text-4xl leading-tight sm:text-5xl">
              Come hungry.
              <br />
              <span className="display-i text-palm">Leave like family.</span>
            </p>
            <TLink href="/reserve" className="btn btn-light mt-8">
              Reserve a table <ArrowRight size={18} />
            </TLink>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/50">Explore</p>
            <ul className="space-y-2 text-lg">
              {[
                ["/menu", "The menu"],
                ["/#belt", "The Belt"],
                ["/reserve", "Reservations"],
                ["/order", "Track an order"],
                ["/credits", "Photo credits"],
              ].map(([h, l]) => (
                <li key={h}>
                  <TLink href={h} className="link-u">
                    {l}
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/50">Visit</p>
            <p className="text-lg leading-relaxed">
              {site.address.map((a) => (
                <span key={a} className="block">
                  {a}
                </span>
              ))}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-paper/70">
              {site.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="tabular-nums text-paper">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/50">Follow the smoke</p>
            <ul className="space-y-2 text-lg">
              {Object.entries(site.socials).map(([k, v]) => (
                <li key={k}>
                  <a href={v} target="_blank" rel="noreferrer" className="link-u capitalize">
                    {k === "tiktok" ? "TikTok" : k === "linkedin" ? "LinkedIn" : k}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="f-word display mt-16 flex select-none justify-center overflow-hidden text-[clamp(7rem,30vw,30rem)] leading-[0.8] text-paper" style={{ paddingBottom: "0.08em" }} aria-hidden>
          {Array.from(site.name).map((c, i) => (
            <span key={i} className="f-char inline-block cursor-default transition-colors hover:text-palm" onMouseEnter={bounce}>
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.name} is a concept restaurant — not a real place (yet). Photography via Unsplash contributors.
          </p>
          <p>
            Designed &amp; built by{" "}
            <a href={site.author.url} target="_blank" rel="noreferrer" className="font-semibold text-paper underline-offset-4 hover:underline">
              {site.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
