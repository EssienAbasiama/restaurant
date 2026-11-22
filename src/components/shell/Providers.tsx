"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { SmoothScroll } from "./SmoothScroll";
import { TransitionProvider } from "./Transition";
import { Nav } from "./Nav";
import { CartDrawer } from "./CartDrawer";
import { Toaster } from "./Toaster";
import { Preloader } from "./Preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  return (
    <TransitionProvider>
      <SmoothScroll />
      <Preloader />
      <Nav />
      {children}
      <CartDrawer />
      <Toaster />
      <div className="grain" aria-hidden />
    </TransitionProvider>
  );
}
