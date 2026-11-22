"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    Draggable,
    InertiaPlugin,
    Flip,
    MotionPathPlugin,
    DrawSVGPlugin,
    CustomEase,
    SplitText,
    useGSAP,
  );
  gsap.defaults({ ease: "power3.out", duration: 0.6 });
  CustomEase.create("plate", "M0,0 C0.18,0.9 0.32,1.06 0.5,1.02 0.7,0.98 0.82,1 1,1");
  CustomEase.create("silk", "M0,0 C0.22,1 0.36,1 1,1");
}

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export {
  gsap,
  ScrollTrigger,
  Draggable,
  InertiaPlugin,
  Flip,
  MotionPathPlugin,
  DrawSVGPlugin,
  CustomEase,
  SplitText,
  useGSAP,
};
