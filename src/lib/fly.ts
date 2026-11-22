"use client";

import { gsap, reducedMotion } from "./gsap";

/** Bounce the cart button. */
export function bumpCart() {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target) return;
  gsap.fromTo(target, { scale: 1 }, { scale: 1.22, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
}

/**
 * Clone `source` (an image or an SVG plate) and throw it along an arc into the cart.
 * Resolves when it lands.
 */
export function flyToCart(source: Element | null | undefined) {
  return new Promise<void>((resolve) => {
    const target = document.querySelector<HTMLElement>("[data-cart-target]");
    if (!source || !target || reducedMotion()) {
      bumpCart();
      return resolve();
    }
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const size = Math.min(from.width, from.height, 220);
    const ghost = document.createElement("div");
    ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${from.left + from.width / 2 - size / 2}px`,
      top: `${from.top + from.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      zIndex: "95",
      pointerEvents: "none",
      borderRadius: "999px",
      overflow: "hidden",
      boxShadow: "0 30px 60px -20px rgba(30,15,5,.55)",
    } as CSSStyleDeclaration);
    const clone = source.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, { width: "100%", height: "100%", objectFit: "cover", transform: "none", position: "static" });
    clone.removeAttribute("id");
    ghost.appendChild(clone);
    document.body.appendChild(ghost);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const lift = Math.min(260, Math.abs(dy) * 0.45 + 120);

    gsap
      .timeline({
        onComplete: () => {
          ghost.remove();
          bumpCart();
          resolve();
        },
      })
      .to(ghost, { scale: 1.08, duration: 0.18, ease: "power2.out" })
      .to(ghost, {
        duration: 0.85,
        ease: "power2.inOut",
        motionPath: {
          path: [
            { x: dx * 0.35, y: Math.min(0, dy) - lift },
            { x: dx, y: dy },
          ],
          curviness: 1.25,
        },
        scale: 0.12,
        rotate: 300,
      })
      .to(ghost, { autoAlpha: 0, duration: 0.12 }, "-=0.1");
  });
}
