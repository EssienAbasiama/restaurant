"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useStore, type Toast } from "@/lib/store";
import { Thumb } from "@/components/ui/Thumb";

function ToastCard({ t }: { t: Toast }) {
  const ref = useRef<HTMLDivElement>(null);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const dismiss = useStore((s) => s.dismiss);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" });
  }, []);
  return (
    <div ref={ref} className="pointer-events-auto flex w-full items-center gap-3 rounded-[22px] bg-ink p-2 pr-3 text-paper shadow-2xl sm:w-[360px]">
      {t.thumb && (
        <div className="h-12 w-12 shrink-0">
          <Thumb thumb={t.thumb} size={48} className="h-12 w-12" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{t.title}</p>
        {t.body && <p className="truncate text-xs text-paper/60">{t.body}</p>}
      </div>
      <button
        type="button"
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-palm hover:text-paper"
        onClick={() => {
          setCartOpen(true);
          dismiss(t.id);
        }}
      >
        View order
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-3 z-[76] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:items-start">
      {toasts.map((t) => (
        <ToastCard key={t.id} t={t} />
      ))}
    </div>
  );
}
