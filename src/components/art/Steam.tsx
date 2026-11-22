"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";

const WISPS = [
  "M100 250 C70 210 130 190 100 150 C72 112 128 96 102 56",
  "M88 250 C60 214 112 196 86 160 C62 126 104 104 84 70",
  "M114 250 C142 214 92 194 118 158 C142 124 98 106 118 64",
  "M100 250 C124 220 80 200 102 168 C124 136 84 118 104 84",
  "M94 250 C70 220 122 202 96 172 C74 146 116 128 92 96",
];

/** Rising steam. Rendered above a dish; wisps loop forever with drift. */
export function Steam({ className, intensity = 1, play = true }: { className?: string; intensity?: number; play?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!play || reducedMotion()) return;
      const wisps = gsap.utils.toArray<SVGPathElement>(".wisp", ref.current);
      wisps.forEach((w, i) => {
        const len = w.getTotalLength();
        gsap.set(w, { strokeDasharray: `${len * 0.42} ${len}`, transformOrigin: "50% 100%" });
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.75 + Math.random() * 0.5, repeatDelay: Math.random() * 0.4 });
        tl.fromTo(
          w,
          { strokeDashoffset: len * 0.5, y: 30, scaleX: 0.7, opacity: 0 },
          { strokeDashoffset: -len * 0.9, y: -60, scaleX: 1.35, duration: 3.6 + Math.random(), ease: "sine.inOut" },
        )
          .to(w, { opacity: 0.85 * intensity, duration: 1.2, ease: "sine.out" }, 0)
          .to(w, { opacity: 0, duration: 1.4, ease: "sine.in" }, ">-0.2");
        gsap.to(w, { x: (i % 2 ? 1 : -1) * (8 + Math.random() * 10), duration: 2 + Math.random(), yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 260" className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id="steam-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="steam-blur">
        {WISPS.map((d, i) => (
          <path key={i} className="wisp" d={d} stroke="url(#steam-g)" strokeWidth={i % 2 ? 16 : 22} strokeLinecap="round" fill="none" opacity="0" />
        ))}
      </g>
    </svg>
  );
}
