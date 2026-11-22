"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blob } from "@/components/art/kit";
import { site } from "@/lib/site";

const SEAL_EDGE = blob(50, 50, 46, 45, { n: 14, j: 0.07, seed: 7 });
const CRACK = "M50 0 L46 22 L55 38 L44 55 L54 72 L47 100";

export function WaxSeal({ size = 56, className, half }: { size?: number; className?: string; half?: "l" | "r" }) {
  const id = `seal-${half ?? "f"}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}-g`} cx="40%" cy="36%">
          <stop offset="0" stopColor="#D9443A" />
          <stop offset="0.55" stopColor="#A9201A" />
          <stop offset="1" stopColor="#6A0C08" />
        </radialGradient>
        {half && (
          <clipPath id={`${id}-c`}>
            <path d={half === "l" ? `M-10 -10 H50 L46 22 L55 38 L44 55 L54 72 L47 110 H-10 Z` : `M110 -10 H50 L46 22 L55 38 L44 55 L54 72 L47 110 H110 Z`} />
          </clipPath>
        )}
      </defs>
      <g clipPath={half ? `url(#${id}-c)` : undefined}>
        <path d={SEAL_EDGE} fill="#000" opacity="0.28" transform="translate(2 4)" />
        <path d={SEAL_EDGE} fill={`url(#${id}-g)`} />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#5E0A06" strokeWidth="3" opacity="0.7" />
        <circle cx="50" cy="51" r="31" fill="none" stroke="#E8685A" strokeWidth="1" opacity="0.6" />
        <text x="50" y="66" textAnchor="middle" fontSize="44" fontFamily="var(--font-fraunces), Georgia, serif" fontWeight="600" fill="#E8685A" opacity="0.55" transform="translate(0.8 1.4)">
          À
        </text>
        <text x="50" y="66" textAnchor="middle" fontSize="44" fontFamily="var(--font-fraunces), Georgia, serif" fontWeight="600" fill="#6A0C08">
          À
        </text>
        <ellipse cx="34" cy="28" rx="10" ry="4" fill="#fff" opacity="0.25" transform="rotate(-30 34 28)" />
      </g>
      {half && <path d={CRACK} stroke="#3A0604" strokeWidth="1.4" fill="none" opacity="0.6" />}
    </svg>
  );
}

export type EnvelopeHandle = { open: () => Promise<void>; close: () => Promise<void> };

type Props = {
  width?: number;
  title?: string;
  sub?: string;
  onOpen?: () => void;
  interactive?: boolean;
  className?: string;
  letter?: React.ReactNode;
};

/**
 * A reservation envelope with a wax seal. Hover lifts the flap and the card peeks;
 * click cracks the seal, opens the flap and slides the invitation out.
 */
export const Envelope = forwardRef<EnvelopeHandle, Props>(function Envelope(
  { width = 200, title = "Find a table", sub = "Reservations", onOpen, interactive = true, className, letter },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const h = Math.round(width * 0.64);
  const flapH = Math.round(h * 0.62);
  const seal = Math.round(width * 0.27);

  const q = (s: string) => root.current?.querySelector<HTMLElement>(s) ?? null;

  const open = () =>
    new Promise<void>((resolve) => {
      if (!root.current) return resolve();
      if (reducedMotion()) return resolve();
      const tl = gsap.timeline({ onComplete: () => resolve() });
      tl.to(q(".env-seal-full"), { autoAlpha: 0, duration: 0.01 })
        .set([q(".env-seal-l"), q(".env-seal-r")], { autoAlpha: 1 })
        .to(q(".env-seal-l"), { x: -seal * 0.5, y: seal * 0.9, rotate: -38, autoAlpha: 0, duration: 0.7, ease: "power2.in" })
        .to(q(".env-seal-r"), { x: seal * 0.55, y: seal * 1.1, rotate: 42, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, "<")
        .to(q(".env-flap"), { rotateX: 180, duration: 0.55, ease: "power2.inOut" }, "<0.08")
        .set(q(".env-flap"), { zIndex: 1 }, "<0.28")
        .to(q(".env-letter"), { y: -h * 0.72, duration: 0.6, ease: "back.out(1.3)" }, "-=0.18");
    });

  const close = () =>
    new Promise<void>((resolve) => {
      if (!root.current) return resolve();
      if (reducedMotion()) return resolve();
      gsap
        .timeline({ onComplete: () => resolve() })
        .to(q(".env-letter"), { y: 0, duration: 0.5, ease: "power3.inOut" })
        .set(q(".env-flap"), { zIndex: 4 })
        .to(q(".env-flap"), { rotateX: 0, duration: 0.5, ease: "power2.inOut" })
        .set([q(".env-seal-l"), q(".env-seal-r")], { autoAlpha: 0, x: 0, y: 0, rotate: 0 })
        .fromTo(q(".env-seal-full"), { autoAlpha: 0, scale: 2.4, y: -40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "power4.in" })
        .to(root.current, { scaleY: 0.94, scaleX: 1.04, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.out" });
    });

  useImperativeHandle(ref, () => ({ open, close }));

  const hover = (on: boolean) => {
    if (!interactive || busy.current || reducedMotion()) return;
    gsap.to(q(".env-flap"), { rotateX: on ? 24 : 0, duration: 0.5, ease: "power3.out" });
    gsap.to(q(".env-letter"), { y: on ? -h * 0.18 : 0, duration: 0.5, ease: "power3.out" });
    gsap.to(q(".env-seal-full"), { rotate: on ? -10 : 0, y: on ? -6 : 0, duration: 0.5, ease: "back.out(2)" });
  };

  const click = async () => {
    if (!interactive || busy.current) return;
    busy.current = true;
    await open();
    onOpen?.();
    window.setTimeout(() => {
      busy.current = false;
    }, 1200);
  };

  const Wrapper = interactive ? "button" : "div";

  return (
    <Wrapper
      {...(interactive ? { type: "button" as const, onClick: click, "aria-label": `${title} — ${sub}` } : {})}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
      onFocus={() => hover(true)}
      onBlur={() => hover(false)}
      className={`group relative block select-none ${className ?? ""}`}
      style={{ width, height: h }}
    >
      <div ref={root} className="relative h-full w-full">
        {/* back */}
        <div className="absolute inset-0 rounded-[6px] bg-[#D9C3A0] shadow-[0_24px_40px_-18px_rgba(60,30,10,0.55)]" />
        {/* letter */}
        <div
          className="env-letter absolute left-[7%] right-[7%] top-[8%] z-[2] flex h-[86%] flex-col items-center justify-start rounded-[4px] bg-[#FFFBF2] pt-[9%] text-center shadow-sm"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 13px, rgba(29,20,16,.04) 13px 14px)" }}
        >
          {letter ?? (
            <>
              <span className="eyebrow text-[0.55rem] text-palm">{site.name}</span>
              <span className="display mt-1 text-[1.15rem] leading-none text-ink">You&apos;re invited</span>
            </>
          )}
        </div>
        {/* front pocket */}
        <svg viewBox="0 0 100 64" preserveAspectRatio="none" className="absolute inset-0 z-[3] h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="env-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EEDDC0" />
              <stop offset="1" stopColor="#E2CBA6" />
            </linearGradient>
          </defs>
          <path d="M0 4 L50 38 L100 4 V64 H0 Z" fill="url(#env-front)" />
          <path d="M0 64 L42 33 M100 64 L58 33" stroke="#C9AE86" strokeWidth="0.5" fill="none" />
          <path d="M0 4 L50 38 L100 4" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.5" fill="none" />
        </svg>
        {/* flap */}
        <div
          className="env-flap absolute inset-x-0 top-0 z-[4]"
          style={{ height: flapH, transformOrigin: "50% 0%", transform: "perspective(700px) rotateX(0deg)" }}
        >
          <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E6D1AE" />
                <stop offset="1" stopColor="#F3E4C8" />
              </linearGradient>
            </defs>
            <path d="M0 0 H100 L54 58 Q50 62 46 58 Z" fill="url(#env-flap)" />
            <path d="M0 0 L46 58 Q50 62 54 58 L100 0" stroke="#C4A87E" strokeWidth="0.6" fill="none" />
          </svg>
        </div>
        {/* seal */}
        <div className="absolute left-1/2 z-[5]" style={{ top: flapH - seal * 0.62, width: seal, height: seal, marginLeft: -seal / 2 }}>
          <WaxSeal size={seal} className="env-seal-full absolute inset-0" />
          <WaxSeal size={seal} half="l" className="env-seal-l invisible absolute inset-0" />
          <WaxSeal size={seal} half="r" className="env-seal-r invisible absolute inset-0" />
        </div>
      </div>
      {interactive && (
        <span className="absolute -bottom-9 left-0 right-0 text-center">
          <span className="eyebrow block text-[0.62rem] text-ink-3">{sub}</span>
          <span className="display text-lg leading-tight text-ink">{title}</span>
        </span>
      )}
    </Wrapper>
  );
});
