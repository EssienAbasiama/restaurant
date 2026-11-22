"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { useStore } from "@/lib/store";
import { site } from "@/lib/site";
import { downloadIcs } from "@/lib/ics";
import { Envelope, type EnvelopeHandle } from "@/components/ui/Envelope";
import { ArrowLeft, ArrowRight, Calendar, Check, Minus, Plus, Users } from "@/components/ui/icons";
import { TLink, enterDelay } from "@/components/shell/Transition";
import { FloorPlan, ZONES, zoneAllowed } from "./FloorPlan";
import { rng } from "@/components/art/kit";

type Phase = "intro" | "form" | "sealing" | "sealed";
type Day = { iso: string; dow: string; d: number; mon: string; full: boolean; few: boolean };

const STEPS = ["Guests", "Date", "Time", "Seat", "Details"];
const OCCASIONS = ["Just hungry", "Birthday", "Anniversary", "Date night", "Business", "Owambe"];
const LUNCH = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
const DINNER = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

/** Stable pseudo-availability so the same date/time always looks the same. */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return rng(h >>> 0)();
};

function Plates({ n }: { n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(n);
  useLayoutEffect(() => {
    const els = ref.current?.children;
    if (!els) return;
    if (n > prev.current && !reducedMotion()) gsap.fromTo(els[n - 1], { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.5)" });
    prev.current = n;
  }, [n]);
  return (
    <div ref={ref} className="flex min-h-[44px] flex-wrap justify-center gap-1.5" aria-hidden>
      {Array.from({ length: Math.min(n, 14) }, (_, i) => (
        <span key={i} className="grid h-10 w-10 place-items-center rounded-full border-[5px] border-[#2A4A9A] bg-white shadow-sm">
          <span className="h-3 w-3 rounded-full" style={{ background: ["#E2621B", "#F2B23A", "#2E5B3A", "#C3301E"][i % 4] }} />
        </span>
      ))}
    </div>
  );
}

export function Reserve() {
  const reservation = useStore((s) => s.reservation);
  const save = useStore((s) => s.saveReservation);
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(2);
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seat, setSeat] = useState("main");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [occasion, setOccasion] = useState("Just hungry");
  const [err, setErr] = useState<Record<string, string>>({});
  const [code, setCode] = useState("");
  const env = useRef<EnvelopeHandle>(null);
  const env2 = useRef<EnvelopeHandle>(null);
  const card = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const dir = useRef(1);

  /* dates are generated on the client so they're always "from today" */
  useEffect(() => {
    const out: Day[] = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const r = hash(iso);
      out.push({ iso, dow: d.toLocaleDateString("en-NG", { weekday: "short" }), d: d.getDate(), mon: d.toLocaleDateString("en-NG", { month: "short" }), full: i > 0 && r < 0.12, few: r > 0.7 });
    }
    setDays(out);
    setDate(out[0].iso);
  }, []);

  /* intro: the envelope opens itself, then the letter becomes the form */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, (enterDelay() + 0.5) * 1000));
      if (cancelled) return;
      await env.current?.open();
      if (cancelled) return;
      if (reducedMotion()) {
        setPhase("form");
        return;
      }
      await gsap.to(".rs-intro", { y: 120, autoAlpha: 0, duration: 0.5, ease: "power2.in" });
      setPhase("form");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (phase !== "form" || !card.current || reducedMotion()) return;
    gsap.fromTo(card.current, { y: 140, scale: 0.55, rotate: -4, autoAlpha: 0 }, { y: 0, scale: 1, rotate: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.2)" });
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "form" || !body.current || reducedMotion()) return;
    gsap.fromTo(body.current.children, { x: 40 * dir.current, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04, ease: "power3.out" });
  }, [step, phase]);

  const day = days.find((d) => d.iso === date);
  const slotState = (t: string) => {
    const r = hash(`${date}|${t}`);
    return { full: r < 0.22, last: r > 0.82 };
  };
  const zone = ZONES.find((z) => z.id === seat)!;

  const canNext = () => {
    if (step === 1) return !!date && !day?.full;
    if (step === 2) return !!time && !slotState(time).full;
    if (step === 3) return zoneAllowed(zone, guests);
    return true;
  };

  const next = () => {
    if (step === 4) return seal();
    if (!canNext()) return;
    dir.current = 1;
    setStep((s) => s + 1);
  };
  const back = () => {
    dir.current = -1;
    setStep((s) => Math.max(0, s - 1));
  };

  useEffect(() => {
    // keep the chosen seat valid as the party size changes
    if (!zoneAllowed(zone, guests)) setSeat(ZONES.find((z) => zoneAllowed(z, guests))?.id ?? "main");
  }, [guests, zone]);

  const seal = async () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Whose name is on the invite?";
    if (!/^[0-9+\s-]{7,}$/.test(form.phone.trim())) e.phone = "A number we can text the confirmation to.";
    setErr(e);
    if (Object.keys(e).length) {
      gsap.fromTo(card.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      return;
    }
    const c = `ÀDÙN-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCode(c);
    save({ code: c, guests, date, time, seat: zone.name, name: form.name.trim(), occasion });
    if (!reducedMotion()) await gsap.to(card.current, { y: 160, scale: 0.4, rotate: 6, autoAlpha: 0, duration: 0.55, ease: "power3.in" });
    setPhase("sealing");
  };

  useLayoutEffect(() => {
    if (phase !== "sealing") return;
    env2.current?.setOpen();
    const run = async () => {
      if (!reducedMotion()) {
        gsap.fromTo(".rs-seal-wrap", { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 });
        await new Promise((r) => setTimeout(r, 650));
        await env2.current?.close();
        burst();
      }
      setPhase("sealed");
    };
    run();
  }, [phase]);

  const burst = () => {
    const host = root.current?.querySelector(".rs-burst");
    if (!host) return;
    const petals = Array.from({ length: 36 }, (_, i) => {
      const el = document.createElement("span");
      Object.assign(el.style, { position: "absolute", left: "50%", top: "50%", width: "12px", height: "9px", borderRadius: "60% 0 60% 0", background: ["#E05A9A", "#F28DBA", "#C2185B", "#F2B23A"][i % 4] });
      host.appendChild(el);
      return el;
    });
    gsap.to(petals, {
      physics2D: { velocity: "random(260, 560)", angle: "random(-170, -10)", gravity: 520 },
      rotation: "random(-540, 540)",
      duration: 3,
      ease: "none",
      onComplete: () => petals.forEach((p) => p.remove()),
    });
  };

  const when = day && time ? `${new Date(`${date}T${time}`).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })} at ${time}` : "";

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (err[k]) setErr((x) => ({ ...x, [k]: "" }));
    },
  });

  return (
    <div ref={root} className="relative mx-auto flex min-h-svh max-w-[1100px] flex-col items-center justify-center px-4 pb-16 pt-28 sm:px-8">
      <div className="rs-burst pointer-events-none absolute inset-0 z-30" aria-hidden />

      {phase === "intro" && (
        <div className="rs-intro flex flex-col items-center text-center">
          <p className="eyebrow text-palm">Reservations</p>
          <h1 className="display mt-3 text-[clamp(3rem,8vw,6.5rem)]">You&apos;re invited.</h1>
          <p className="mt-3 max-w-md text-ink-2">Breaking the seal…</p>
          <div className="mt-36 sm:mt-44">
            <Envelope ref={env} width={300} interactive={false} letter={<span className="display text-2xl text-ink">A table at {site.name}</span>} />
          </div>
        </div>
      )}

      {phase === "form" && (
        <div ref={card} className="relative w-full max-w-[860px] overflow-hidden rounded-[30px] bg-[#FFFBF2] shadow-[0_40px_100px_-40px_rgba(29,20,16,.55)]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 31px, rgba(29,20,16,.035) 31px 32px)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 px-6 py-5 sm:px-8">
            <div>
              <p className="eyebrow text-palm">A table at {site.name}</p>
              <h1 className="display mt-1 text-4xl">{["How many of you?", "Which day?", "What time?", "Where would you like to sit?", "Last thing: who's coming?"][step]}</h1>
            </div>
            <ol className="flex gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
              {STEPS.map((s, i) => (
                <li key={s} title={s} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === step ? 34 : 12, background: i <= step ? "var(--color-palm)" : "rgb(29 20 16 / .15)" }} />
              ))}
            </ol>
          </div>

          <div ref={body} className="min-h-[340px] px-6 py-8 sm:px-8">
            {step === 0 && (
              <>
                <div className="flex items-center justify-center gap-6">
                  <button type="button" className="icon-btn h-14 w-14 bg-ink/5 hover:bg-ink/10" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests">
                    <Minus />
                  </button>
                  <p className="display w-32 text-center text-[6rem] leading-none tabular-nums" aria-live="polite">
                    {guests}
                  </p>
                  <button type="button" className="icon-btn h-14 w-14 bg-ink text-paper hover:bg-palm" onClick={() => setGuests((g) => Math.min(14, g + 1))} aria-label="More guests">
                    <Plus />
                  </button>
                </div>
                <p className="mt-2 text-center text-sm font-semibold text-ink-3">{guests === 1 ? "Solo. Respect." : guests >= 8 ? "That's an owambe. We love it." : `${guests} guests`}</p>
                <div className="mt-6">
                  <Plates n={guests} />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[2, 4, 6, 8].map((n) => (
                    <button key={n} type="button" aria-pressed={guests === n} onClick={() => setGuests(n)} className="chip">
                      <Users size={15} /> {n}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="no-scrollbar -mx-2 flex snap-x gap-2 overflow-x-auto px-2 pb-2" data-lenis-prevent-horizontal role="radiogroup" aria-label="Date">
                  {days.map((d, i) => (
                    <button
                      key={d.iso}
                      type="button"
                      role="radio"
                      aria-checked={date === d.iso}
                      disabled={d.full}
                      onClick={() => setDate(d.iso)}
                      className={`relative flex w-[76px] shrink-0 snap-start flex-col items-center rounded-2xl py-3 transition-all duration-300 ${
                        date === d.iso ? "-translate-y-1 bg-ink text-paper shadow-lg" : d.full ? "bg-ink/[0.03] text-ink/30 line-through" : "bg-ink/[0.05] hover:bg-ink/10"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">{i === 0 ? "Today" : i === 1 ? "Tmrw" : d.dow}</span>
                      <span className="display mt-1 text-3xl leading-none">{d.d}</span>
                      <span className="mt-1 text-[0.7rem] font-semibold opacity-60">{d.mon}</span>
                      {d.few && !d.full && <span className="absolute -top-1.5 right-1 rounded-full bg-palm px-1.5 text-[0.6rem] font-bold text-paper">Few left</span>}
                    </button>
                  ))}
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
                  <Calendar size={16} /> Struck-through days are fully booked. We hold a few counter seats for walk-ins every day.
                </p>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {[
                  ["Lunch", LUNCH],
                  ["Dinner", DINNER],
                ].map(([label, list]) => (
                  <div key={label as string}>
                    <p className="mb-2 text-sm font-bold">{label as string}</p>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`${label} times`}>
                      {(list as string[]).map((t) => {
                        const s = slotState(t);
                        return (
                          <button key={t} type="button" role="radio" aria-checked={time === t} disabled={s.full} onClick={() => setTime(t)} className={`chip relative tabular-nums ${s.full ? "line-through opacity-35" : ""}`}>
                            {t}
                            {s.last && !s.full && <span className="absolute -right-1 -top-2 rounded-full bg-pepper px-1.5 text-[0.58rem] font-bold text-paper">Last table</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid items-start gap-6 md:grid-cols-[1.4fr_1fr]">
                <FloorPlan value={seat} onChange={setSeat} guests={guests} />
                <div>
                  <p className="eyebrow text-palm">{zone.seats}</p>
                  <p className="display mt-2 text-3xl">{zone.name}</p>
                  <p className="mt-2 text-ink-2">{zone.vibe}</p>
                  {!zoneAllowed(zone, guests) && <p className="mt-3 text-sm font-bold text-pepper">Not available for {guests} guests.</p>}
                  <div className="mt-5 flex flex-wrap gap-1.5 md:hidden">
                    {ZONES.map((z) => (
                      <button key={z.id} type="button" aria-pressed={seat === z.id} disabled={!zoneAllowed(z, guests)} onClick={() => setSeat(z.id)} className="chip !h-9 text-xs disabled:opacity-35">
                        {z.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="field" data-invalid={!!err.name}>
                  <span>Name on the invite</span>
                  <input autoComplete="name" placeholder="Tolu Adeyemi" {...field("name")} />
                  {err.name && <em className="mt-1.5 block text-xs font-bold not-italic text-pepper">{err.name}</em>}
                </label>
                <label className="field" data-invalid={!!err.phone}>
                  <span>Phone</span>
                  <input autoComplete="tel" inputMode="tel" placeholder="+234 801 234 5678" {...field("phone")} />
                  {err.phone && <em className="mt-1.5 block text-xs font-bold not-italic text-pepper">{err.phone}</em>}
                </label>
                <label className="field sm:col-span-2">
                  <span>Email (optional)</span>
                  <input type="email" autoComplete="email" placeholder="you@example.com" {...field("email")} />
                </label>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-bold">What&apos;s the occasion?</p>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((o) => (
                      <button key={o} type="button" aria-pressed={occasion === o} onClick={() => setOccasion(o)} className="chip">
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="field sm:col-span-2">
                  <span>Anything we should know? (optional)</span>
                  <textarea placeholder="Allergies, a cake surprise, the high chair…" {...field("notes")} />
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-6 py-4 sm:px-8">
            <button type="button" onClick={back} disabled={step === 0} className="btn btn-ghost btn-sm disabled:opacity-30">
              <ArrowLeft size={16} /> Back
            </button>
            <p className="hidden truncate text-sm font-semibold text-ink-3 sm:block">
              {guests} {guests === 1 ? "guest" : "guests"}
              {step > 0 && day && ` · ${day.dow} ${day.d} ${day.mon}`}
              {step > 1 && time && ` · ${time}`}
              {step > 2 && ` · ${zone.name}`}
            </p>
            <button type="button" onClick={next} disabled={!canNext()} className={`btn ${step === 4 ? "btn-palm" : "btn-primary"}`}>
              {step === 4 ? "Seal the invitation" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {(phase === "sealing" || phase === "sealed") && (
        <div className="flex flex-col items-center text-center">
          <div className="rs-seal-wrap mt-10">
            <Envelope
              ref={env2}
              width={340}
              interactive={false}
              letter={
                <span className="px-3 text-center">
                  <span className="display block text-xl text-ink">{form.name || "You"}</span>
                  <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
                    Table for {guests} · {time}
                  </span>
                </span>
              }
            />
          </div>
          {phase === "sealed" && (
            <div className="mt-12 animate-[fadeIn_.6s_ease]">
              <p className="eyebrow text-palm">Sealed · {code}</p>
              <h1 className="display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">See you soon, {form.name.split(" ")[0] || reservation?.name}.</h1>
              <p className="mx-auto mt-3 max-w-lg text-lg text-ink-2">
                Table for {guests} on {when}, {zone.name.toLowerCase().startsWith("the") ? "at " + zone.name : "in the " + zone.name}. We&apos;ll text {form.phone} if anything changes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-primary" onClick={() => downloadIcs({ code, start: new Date(`${date}T${time}`), guests, seat: zone.name, name: form.name })}>
                  <Calendar size={18} /> Add to calendar
                </button>
                <TLink href="/menu" className="btn btn-ghost">
                  Pre-order from the menu <ArrowRight size={18} />
                </TLink>
              </div>
              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-3">
                <Check size={14} /> Concept site: this booking lives only in your browser.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
