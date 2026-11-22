"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BeltKind, Opts } from "./menu";

export type Thumb =
  | { kind: "art"; slug: string; opts?: Opts }
  | { kind: "img"; src: string }
  | { kind: "belt"; item: BeltKind };

export type CartLine = {
  key: string;
  id: string;
  name: string;
  unit: number;
  qty: number;
  thumb: Thumb;
  meta?: string;
};

export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  mode: "delivery" | "pickup";
  name: string;
  area?: string;
  eta: number;
  placedAt: number;
};

export type Reservation = {
  code: string;
  guests: number;
  date: string;
  time: string;
  seat: string;
  name: string;
  occasion?: string;
};

export type Toast = { id: number; title: string; body?: string; thumb?: Thumb };

type State = {
  cart: CartLine[];
  cartOpen: boolean;
  order?: Order;
  reservation?: Reservation;
  toasts: Toast[];
  plates: { tier: string; at: number }[];
  add: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setCartOpen: (v: boolean) => void;
  placeOrder: (o: Order) => void;
  saveReservation: (r: Reservation) => void;
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
  stackPlate: (tier: string) => void;
  resetPlates: () => void;
};

let toastId = 1;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,
      toasts: [],
      plates: [],
      add: (line) => {
        const qty = line.qty ?? 1;
        const existing = get().cart.find((l) => l.key === line.key);
        if (existing) {
          set({ cart: get().cart.map((l) => (l.key === line.key ? { ...l, qty: l.qty + qty } : l)) });
        } else {
          set({ cart: [...get().cart, { ...line, qty }] });
        }
      },
      setQty: (key, qty) =>
        set({
          cart: qty <= 0 ? get().cart.filter((l) => l.key !== key) : get().cart.map((l) => (l.key === key ? { ...l, qty } : l)),
        }),
      remove: (key) => set({ cart: get().cart.filter((l) => l.key !== key) }),
      clear: () => set({ cart: [], plates: [] }),
      setCartOpen: (v) => set({ cartOpen: v }),
      placeOrder: (o) => set({ order: o, cart: [], plates: [] }),
      saveReservation: (r) => set({ reservation: r }),
      toast: (t) => {
        const id = toastId++;
        set({ toasts: [...get().toasts.slice(-2), { ...t, id }] });
        setTimeout(() => get().dismiss(id), 3600);
      },
      dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
      stackPlate: (tier) => set({ plates: [...get().plates, { tier, at: Date.now() }] }),
      resetPlates: () => set({ plates: [] }),
    }),
    {
      name: "adun-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ cart: s.cart, order: s.order, reservation: s.reservation, plates: s.plates }),
    },
  ),
);

export const cartCount = (cart: CartLine[]) => cart.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (cart: CartLine[]) => cart.reduce((n, l) => n + l.qty * l.unit, 0);

/** True once the persisted cart/order has been restored from localStorage. */
export function useStoreHydrated() {
  return useSyncExternalStore(
    (cb) => useStore.persist.onFinishHydration(cb),
    () => useStore.persist.hasHydrated(),
    () => false,
  );
}
