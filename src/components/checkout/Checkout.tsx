"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { cartSubtotal, useStore, useStoreHydrated, type Order } from "@/lib/store";
import { menuById, type MenuItem } from "@/lib/menu";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { useOrder } from "@/lib/useOrder";
import { Thumb } from "@/components/ui/Thumb";
import { EmptyPlate } from "@/components/shell/CartDrawer";
import { ArrowRight, Bag, Check, Minus, Pin, Plus, Scooter } from "@/components/ui/icons";
import { TLink, enterDelay, useGo } from "@/components/shell/Transition";

const AREAS = [
  { id: "lekki", label: "Lekki", fee: 1500, eta: 25 },
  { id: "vi", label: "Victoria Island", fee: 2000, eta: 30 },
  { id: "ikoyi", label: "Ikoyi", fee: 2000, eta: 30 },
  { id: "ajah", label: "Ajah", fee: 3000, eta: 45 },
  { id: "yaba", label: "Yaba", fee: 3500, eta: 50 },
  { id: "ikeja", label: "Ikeja", fee: 4500, eta: 60 },
];
const TIPS = [0, 5, 10, 15];
const PAY = [
  { id: "pod", title: "Pay on arrival", sub: "Cash, transfer or POS when it lands" },
  { id: "transfer", title: "Bank transfer", sub: "Demo only — no account details shown" },
  { id: "card", title: "Card", sub: "Demo only — no card is charged" },
];
const PROMOS: Record<string, number> = { JOLLOF10: 0.1, OWAMBE: 0.15 };

function Section({ n, title, children, hint }: { n: number; title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="co-fade rounded-[28px] bg-paper p-5 shadow-[0_20px_60px_-40px_rgba(29,20,16,.5)] sm:p-7">
      <header className="mb-5 flex items-baseline gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-paper">{n}</span>
        <h2 className="display text-[1.9rem] leading-none">{title}</h2>
        {hint && <span className="ml-auto hidden text-xs font-semibold text-ink-3 sm:block">{hint}</span>}
      </header>
      {children}
    </section>
  );
}

function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const [initial] = useState(value);
  useEffect(() => {
    const o = { v: shown.current };
    shown.current = value;
    gsap.to(o, { v: value, duration: 0.6, ease: "power2.out", onUpdate: () => void (ref.current && (ref.current.textContent = money(o.v))) });
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {money(initial)}
    </span>
  );
}

export function Checkout() {
  const root = useRef<HTMLDivElement>(null);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const placeOrder = useStore((s) => s.placeOrder);
  const { addItem } = useOrder();
  const go = useGo();
  const hydrated = useStoreHydrated();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [area, setArea] = useState(AREAS[0].id);
  const [slot, setSlot] = useState("asap");
  const [slots, setSlots] = useState<{ id: string; label: string }[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tip, setTip] = useState(10);
  const [pay, setPay] = useState("pod");
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const toggle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const list = [{ id: "asap", label: "ASAP · ~20 min" }];
    const start = new Date(now);
    start.setMinutes(Math.ceil((now.getMinutes() + 35) / 15) * 15, 0, 0);
    for (let i = 0; i < 6; i++) {
      const t = new Date(start.getTime() + i * 15 * 60000);
      list.push({ id: t.toISOString(), label: t.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) });
    }
    setSlots(list);
  }, []);

  useLayoutEffect(() => {
    const pill = toggle.current?.querySelector<HTMLElement>(".mode-pill");
    const btn = toggle.current?.querySelector<HTMLElement>(`[data-mode="${mode}"]`);
    if (pill && btn) gsap.to(pill, { x: btn.offsetLeft - 4, width: btn.offsetWidth, duration: 0.5, ease: "power3.out" });
  }, [mode, hydrated]);

  useGSAP(
    () => {
      if (reducedMotion() || !hydrated) return;
      gsap.from(".co-fade", { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.9, delay: enterDelay() });
    },
    { scope: root, dependencies: [hydrated] },
  );

  const a = AREAS.find((x) => x.id === area)!;
  const sub = cartSubtotal(cart);
  const discount = applied ? Math.round(sub * PROMOS[applied]) : 0;
  const delivery = mode === "delivery" ? (sub - discount >= site.freeDeliveryFrom ? 0 : a.fee) : 0;
  const vat = Math.round((sub - discount) * site.vat);
  const tipAmt = Math.round((sub - discount) * (tip / 100));
  const total = sub - discount + delivery + vat + tipAmt;

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
    },
  });

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setApplied(code);
      setPromoMsg(`${code} applied — ${PROMOS[code] * 100}% off. Enjoy.`);
    } else {
      setApplied(null);
      setPromoMsg("That code isn't on the menu. Try JOLLOF10.");
    }
  };

  const submit = async () => {
    if (placing) return;
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Who should we shout for?";
    if (!/^[0-9+\s-]{7,}$/.test(form.phone.trim())) er.phone = "We need a number the rider can call.";
    if (mode === "delivery" && form.address.trim().length < 6) er.address = "Where should the jollof land?";
    setErrors(er);
    if (Object.keys(er).length) {
      const first = root.current?.querySelector<HTMLElement>(`[data-field="${Object.keys(er)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first) gsap.fromTo(first, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, reducedMotion() ? 200 : 1600));
    const order: Order = {
      id: `ÀD-${Math.floor(1000 + Math.random() * 9000)}`,
      lines: cart,
      total,
      mode,
      name: form.name.trim().split(" ")[0],
      area: mode === "delivery" ? a.label : undefined,
      eta: mode === "delivery" ? a.eta : 20,
      placedAt: Date.now(),
    };
    placeOrder(order);
    go("/order");
  };

  const suggestions = ["puff-puff", "zobo", "dodo", "chapman"].map(menuById).filter(Boolean) as MenuItem[];

  if (hydrated && cart.length === 0 && !placing) {
    return (
      <div ref={root} className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pb-20 pt-32 text-center">
        <EmptyPlate className="w-52" />
        <h1 className="display mt-8 text-6xl">Nothing to check out.</h1>
        <p className="mt-3 max-w-md text-lg text-ink-2">Your plate is empty. The kitchen is very much not. Start with a few crowd-pleasers:</p>
        <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
          {suggestions.map((m) => (
            <button key={m.id} type="button" onClick={(e) => addItem(m, (e.currentTarget as HTMLElement).querySelector("img"))} className="flex items-center gap-3 rounded-2xl bg-paper p-2 pr-4 text-left shadow-sm transition-transform hover:-translate-y-0.5">
              <Thumb thumb={{ kind: "img", src: m.image.src }} size={52} />
              <span className="flex-1 font-bold">{m.name}</span>
              <span className="text-sm font-semibold text-ink-3">{money(m.price)}</span>
              <Plus size={16} />
            </button>
          ))}
        </div>
        <TLink href="/menu" className="btn btn-primary mt-8">
          Browse the full menu <ArrowRight size={18} />
        </TLink>
      </div>
    );
  }

  return (
    <div ref={root} className="mx-auto max-w-[1320px] px-4 pb-28 pt-28 sm:px-8 md:pt-32">
      <div className="co-fade mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-palm">Almost there</p>
          <h1 className="display mt-2 text-[clamp(3.2rem,7vw,6rem)]">Checkout</h1>
        </div>
        <ol className="flex items-center gap-2 text-sm font-bold" aria-label="Progress">
          {["Order", "Details", "Kitchen"].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-full ${i === 0 ? "bg-leaf text-paper" : i === 1 ? "bg-ink text-paper" : "bg-ink/10 text-ink-3"}`}>{i === 0 ? <Check size={14} /> : i + 1}</span>
              <span className={i === 2 ? "text-ink-3" : ""}>{s}</span>
              {i < 2 && <span className="h-px w-6 bg-ink/20" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <Section n={1} title="How do you want it?">
            <div ref={toggle} role="radiogroup" aria-label="Delivery or pickup" className="relative inline-flex rounded-full bg-ink/[0.06] p-1">
              <span className="mode-pill absolute bottom-1 left-1 top-1 rounded-full bg-ink" />
              {(["delivery", "pickup"] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} data-mode={m} onClick={() => setMode(m)} className={`relative z-[1] flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold capitalize transition-colors ${mode === m ? "text-paper" : "text-ink-2"}`}>
                  {m === "delivery" ? <Scooter size={17} /> : <Bag size={17} />} {m}
                </button>
              ))}
            </div>

            {mode === "delivery" ? (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-bold">Area</p>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Delivery area">
                    {AREAS.map((x) => (
                      <button key={x.id} type="button" role="radio" aria-checked={area === x.id} onClick={() => setArea(x.id)} className="chip !h-auto flex-col !items-start !gap-0 !rounded-2xl !py-2">
                        <span>{x.label}</span>
                        <span className="text-[0.7rem] font-semibold opacity-60">
                          {money(x.fee)} · ~{x.eta} min
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="field" data-field="address" data-invalid={!!errors.address}>
                  <span>Street address</span>
                  <input autoComplete="street-address" placeholder="House number, street, landmark" {...field("address")} />
                  {errors.address && <em className="mt-1.5 block text-xs font-bold not-italic text-pepper">{errors.address}</em>}
                </label>
                <label className="field">
                  <span>Note for the rider (optional)</span>
                  <input placeholder="e.g. Call at the gate, blue door" {...field("note")} />
                </label>
              </div>
            ) : (
              <div className="mt-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <Pin size={16} /> Pick up at {site.address.join(", ")}
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pickup time">
                  {slots.map((s) => (
                    <button key={s.id} type="button" role="radio" aria-checked={slot === s.id} onClick={() => setSlot(s.id)} className="chip">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Section>

          <Section n={2} title="Who's eating?">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field" data-field="name" data-invalid={!!errors.name}>
                <span>Full name</span>
                <input autoComplete="name" placeholder="Adaeze Okafor" {...field("name")} />
                {errors.name && <em className="mt-1.5 block text-xs font-bold not-italic text-pepper">{errors.name}</em>}
              </label>
              <label className="field" data-field="phone" data-invalid={!!errors.phone}>
                <span>Phone</span>
                <input autoComplete="tel" inputMode="tel" placeholder="+234 801 234 5678" {...field("phone")} />
                {errors.phone && <em className="mt-1.5 block text-xs font-bold not-italic text-pepper">{errors.phone}</em>}
              </label>
              <label className="field sm:col-span-2">
                <span>Email for the receipt (optional)</span>
                <input type="email" autoComplete="email" placeholder="you@example.com" {...field("email")} />
              </label>
            </div>
          </Section>

          <Section n={3} title="Tip the kitchen" hint="100% goes to the cooks">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tip">
              {TIPS.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tip === t} onClick={() => setTip(t)} className="chip min-w-20 justify-center">
                  {t === 0 ? "Not today" : `${t}%`}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-2">{tip >= 10 ? "The pot station just started singing. Thank you." : tip > 0 ? "Appreciated, truly." : "No wahala."}</p>
          </Section>

          <Section n={4} title="Payment">
            <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
              {PAY.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={pay === p.id}
                  onClick={() => setPay(p.id)}
                  className={`rounded-2xl p-4 text-left transition-all duration-300 ${pay === p.id ? "bg-ink text-paper shadow-lg" : "bg-ink/[0.04] hover:bg-ink/[0.08]"}`}
                >
                  <span className="flex items-center justify-between font-bold">
                    {p.title}
                    <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${pay === p.id ? "border-palm bg-palm" : "border-ink/25"}`}>{pay === p.id && <Check size={12} />}</span>
                  </span>
                  <span className={`mt-1 block text-xs ${pay === p.id ? "text-paper/70" : "text-ink-3"}`}>{p.sub}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-plantain/20 px-3 py-2 text-xs font-semibold text-ink-2">Concept site: no payment is taken and nothing you type leaves your browser.</p>
          </Section>
        </div>

        {/* summary */}
        <aside className="co-fade lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[28px] bg-ink text-paper">
            <div className="p-6 pb-4">
              <h2 className="display text-3xl">Your order</h2>
            </div>
            <ul className="max-h-[38svh] space-y-1 overflow-y-auto px-4 no-scrollbar" data-lenis-prevent>
              {cart.map((l) => (
                <li key={l.key} className="flex items-center gap-3 rounded-2xl p-2">
                  <div className="h-12 w-12 shrink-0">
                    <Thumb thumb={l.thumb} size={48} className="h-12 w-12" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{l.name}</p>
                    {l.meta && <p className="truncate text-[0.7rem] text-paper/50">{l.meta}</p>}
                  </div>
                  <div className="flex items-center gap-0.5 rounded-full bg-paper/10 p-0.5">
                    <button type="button" className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper/10" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Remove one ${l.name}`}>
                      <Minus size={13} />
                    </button>
                    <span className="w-4 text-center text-xs font-bold tabular-nums">{l.qty}</span>
                    <button type="button" className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper/10" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Add one ${l.name}`}>
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="w-20 text-right text-sm font-bold tabular-nums">{money(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-paper/10 p-6">
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="promo">
                  Promo code
                </label>
                <input
                  id="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  placeholder="Promo code"
                  className="h-11 flex-1 rounded-full bg-paper/10 px-4 text-sm font-semibold uppercase tracking-wider text-paper placeholder:normal-case placeholder:tracking-normal placeholder:text-paper/40 focus:bg-paper/15 focus:outline-none"
                />
                <button type="button" onClick={applyPromo} className="btn btn-light btn-sm">
                  Apply
                </button>
              </div>
              {promoMsg && <p className={`mt-2 text-xs font-semibold ${applied ? "text-plantain" : "text-paper/60"}`}>{promoMsg}</p>}
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between text-paper/70">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{money(sub)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-plantain">
                    <dt>{applied}</dt>
                    <dd className="tabular-nums">−{money(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-paper/70">
                  <dt>{mode === "delivery" ? `Delivery · ${a.label}` : "Pickup"}</dt>
                  <dd className="tabular-nums">{delivery === 0 ? "Free" : money(delivery)}</dd>
                </div>
                <div className="flex justify-between text-paper/70">
                  <dt>VAT (7.5%)</dt>
                  <dd className="tabular-nums">{money(vat)}</dd>
                </div>
                <div className="flex justify-between text-paper/70">
                  <dt>Kitchen tip ({tip}%)</dt>
                  <dd className="tabular-nums">{money(tipAmt)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-paper/10 pt-3">
                  <dt className="font-bold">Total</dt>
                  <dd>
                    <Counter value={total} className="display text-4xl tabular-nums" />
                  </dd>
                </div>
              </dl>
              <button type="button" onClick={submit} disabled={cart.length === 0} aria-busy={placing} className="btn btn-palm mt-5 w-full !h-14 text-base">
                {placing ? (
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-paper" style={{ animationDelay: `${i * 0.12}s` }} />
                      ))}
                    </span>
                    Sending to the kitchen…
                  </span>
                ) : (
                  <>
                    Place order · <Counter value={total} className="tabular-nums" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-paper/50">
                {mode === "delivery" ? `Rider ETA ~${a.eta} min after the kitchen fires your order.` : "We'll text you when it's on the counter."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
