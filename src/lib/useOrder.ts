"use client";

import { useCallback } from "react";
import { describeOpts, defaultOpts, priceFor, tiers, type BeltItem, type MenuItem, type Opts, type Signature } from "./menu";
import { useStore } from "./store";
import { flyToCart } from "./fly";
import { money } from "./format";

const keyOf = (id: string, o?: Opts) =>
  id +
  (o
    ? "|" +
      Object.keys(o)
        .sort()
        .map((k) => `${k}=${Array.isArray(o[k]) ? [...(o[k] as string[])].sort().join("+") : o[k]}`)
        .join("&")
    : "");

export function useOrder() {
  const add = useStore((s) => s.add);
  const toast = useStore((s) => s.toast);
  const stackPlate = useStore((s) => s.stackPlate);

  const addSignature = useCallback(
    async (sig: Signature, opts: Opts = defaultOpts(sig), qty = 1, source?: Element | null) => {
      const unit = priceFor(sig, opts);
      const meta = describeOpts(sig, opts);
      const fly = flyToCart(source);
      add({ key: keyOf(sig.slug, opts), id: sig.slug, name: sig.name, unit, qty, thumb: { kind: "art", slug: sig.slug, opts }, meta });
      await fly;
      toast({ title: `${qty > 1 ? `${qty} × ` : ""}${sig.name} added`, body: `${money(unit * qty)} · ${meta || "House style"}`, thumb: { kind: "art", slug: sig.slug, opts } });
    },
    [add, toast],
  );

  const addItem = useCallback(
    async (item: MenuItem, source?: Element | null, qty = 1) => {
      const fly = flyToCart(source);
      add({ key: item.id, id: item.id, name: item.name, unit: item.price, qty, thumb: { kind: "img", src: item.image.src } });
      await fly;
      toast({ title: `${item.name} added`, body: money(item.price), thumb: { kind: "img", src: item.image.src } });
    },
    [add, toast],
  );

  const addBelt = useCallback(
    async (item: BeltItem, source?: Element | null) => {
      const t = tiers[item.tier];
      const fly = flyToCart(source);
      add({ key: `belt-${item.id}`, id: item.id, name: item.name, unit: t.price, qty: 1, thumb: { kind: "belt", item: item.id }, meta: `${t.label} plate · from The Belt` });
      stackPlate(item.tier);
      await fly;
      toast({ title: `${item.name} off the belt`, body: `${t.label} plate · ${money(t.price)}`, thumb: { kind: "belt", item: item.id } });
    },
    [add, toast, stackPlate],
  );

  return { addSignature, addItem, addBelt };
}
