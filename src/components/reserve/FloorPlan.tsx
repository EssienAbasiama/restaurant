"use client";

export type Zone = { id: string; name: string; seats: string; vibe: string; min?: number; max?: number };

export const ZONES: Zone[] = [
  { id: "belt", name: "The Belt Bar", seats: "Counter seats, 1–4", vibe: "Plates glide past your elbow. Best for sushi, small chops and people-watching.", max: 4 },
  { id: "main", name: "Main Room", seats: "Tables for 2–8", vibe: "The heart of it: candlelight, clinking glasses, jollof arriving in waves.", max: 8 },
  { id: "garden", name: "Garden Terrace", seats: "Tables for 2–6", vibe: "Fairy lights, ferns and the Lagos breeze. Our favourite for sunset suya.", max: 6 },
  { id: "chef", name: "Chef's Table", seats: "Up to 6, tasting menu", vibe: "Front row at the pass. The chef sends out things that aren't on the menu.", max: 6 },
  { id: "owambe", name: "Owambe Room", seats: "Private, 6–14", vibe: "A private room for celebrations. Aso-ebi optional, dancing encouraged.", min: 6 },
];

export const zoneAllowed = (z: Zone, guests: number) => (z.min ? guests >= z.min : true) && (z.max ? guests <= z.max : true);

/** Top-down floor plan; zones are buttons. */
export function FloorPlan({ value, onChange, guests }: { value: string; onChange: (id: string) => void; guests: number }) {
  const zone = (id: string, children: React.ReactNode, label: string) => {
    const z = ZONES.find((x) => x.id === id)!;
    const ok = zoneAllowed(z, guests);
    const on = value === id;
    return (
      <g
        role="radio"
        aria-checked={on}
        aria-disabled={!ok}
        aria-label={`${z.name}${ok ? "" : " — not available for this party size"}`}
        tabIndex={ok ? 0 : -1}
        onClick={() => ok && onChange(id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && ok && onChange(id)}
        className={`group outline-none ${ok ? "cursor-pointer" : "cursor-not-allowed opacity-35"}`}
      >
        {children}
        <text className="pointer-events-none select-none" fontFamily="var(--font-manrope), sans-serif" fontSize="12" fontWeight="800" letterSpacing="1.4" fill={on ? "#E2621B" : "#4A3B32"}>
          {label}
        </text>
      </g>
    );
  };
  const area = (on: boolean) => ({
    fill: on ? "rgba(226,98,27,.16)" : "rgba(29,20,16,.03)",
    stroke: on ? "#E2621B" : "rgba(29,20,16,.18)",
    strokeWidth: on ? 2.5 : 1.2,
    className: "transition-all duration-300 group-hover:fill-[rgba(226,98,27,.1)] group-focus-visible:stroke-[#E2621B]",
  });

  return (
    <svg viewBox="0 0 600 380" className="w-full" role="radiogroup" aria-label="Choose where to sit">
      <rect x="4" y="4" width="592" height="372" rx="22" fill="#FBF7EF" stroke="#D9CDB8" strokeWidth="2" />
      {/* kitchen */}
      <rect x="20" y="262" width="150" height="100" rx="12" fill="#E8DFD0" />
      <text x="34" y="350" fontSize="11" fontWeight="800" letterSpacing="1.4" fill="#85725F" fontFamily="var(--font-manrope), sans-serif">
        KITCHEN
      </text>
      {[40, 75, 110, 145].map((x) => (
        <circle key={x} cx={x} cy="290" r="9" fill="#D6CAB6" />
      ))}
      {/* entrance */}
      <path d="M270 376 h70" stroke="#E2621B" strokeWidth="5" strokeLinecap="round" />
      <text x="276" y="366" fontSize="10" fontWeight="800" letterSpacing="1.2" fill="#E2621B" fontFamily="var(--font-manrope), sans-serif">
        ENTRANCE
      </text>

      {zone(
        "belt",
        <>
          <rect x="20" y="20" width="300" height="110" rx="14" {...area(value === "belt")} />
          <rect x="50" y="48" width="240" height="54" rx="27" fill="none" stroke="#2C2420" strokeWidth="12" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={66 + i * 19} cy={i % 2 ? 48 : 102} r="4.5" fill={["#3E8E5A", "#2F5FA8", "#C3301E", "#D6A02A"][i % 4]} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={`s${i}`} cx={62 + i * 24} cy="122" r="5" fill="#B9A88E" />
          ))}
          <g transform="translate(34 40)" />
        </>,
        "",
      )}
      <text x="34" y="40" fontSize="12" fontWeight="800" letterSpacing="1.4" fill={value === "belt" ? "#E2621B" : "#4A3B32"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
        THE BELT BAR
      </text>

      {zone(
        "main",
        <>
          <rect x="190" y="150" width="230" height="200" rx="14" {...area(value === "main")} />
          {[
            [240, 200],
            [320, 200],
            [240, 290],
            [320, 290],
            [380, 245],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="20" fill="#E2D5BC" />
              {[0, 90, 180, 270].map((a) => (
                <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 29} cy={y + Math.sin((a * Math.PI) / 180) * 29} r="5" fill="#B9A88E" />
              ))}
            </g>
          ))}
        </>,
        "",
      )}
      <text x="204" y="170" fontSize="12" fontWeight="800" letterSpacing="1.4" fill={value === "main" ? "#E2621B" : "#4A3B32"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
        MAIN ROOM
      </text>

      {zone(
        "garden",
        <>
          <rect x="440" y="20" width="140" height="230" rx="14" {...area(value === "garden")} />
          {[
            [470, 70],
            [550, 120],
            [470, 170],
            [552, 210],
            [500, 230],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={10 + (i % 2) * 5} fill="#7DA56A" opacity="0.7" />
          ))}
          {[
            [515, 80],
            [510, 170],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 16} y={y - 12} width="32" height="24" rx="6" fill="#E2D5BC" />
              <circle cx={x - 24} cy={y} r="5" fill="#B9A88E" />
              <circle cx={x + 24} cy={y} r="5" fill="#B9A88E" />
            </g>
          ))}
        </>,
        "",
      )}
      <text x="452" y="40" fontSize="12" fontWeight="800" letterSpacing="1.4" fill={value === "garden" ? "#E2621B" : "#4A3B32"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
        GARDEN
      </text>

      {zone(
        "chef",
        <>
          <rect x="20" y="150" width="150" height="100" rx="14" {...area(value === "chef")} />
          <rect x="40" y="200" width="110" height="22" rx="6" fill="#2C2420" />
          {[52, 76, 100, 124, 140].map((x) => (
            <circle key={x} cx={x} cy="236" r="5" fill="#B9A88E" />
          ))}
        </>,
        "",
      )}
      <text x="34" y="172" fontSize="12" fontWeight="800" letterSpacing="1.4" fill={value === "chef" ? "#E2621B" : "#4A3B32"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
        CHEF&apos;S TABLE
      </text>

      {zone(
        "owambe",
        <>
          <rect x="440" y="266" width="140" height="96" rx="14" {...area(value === "owambe")} />
          <rect x="462" y="296" width="96" height="40" rx="20" fill="#E2D5BC" />
          {[470, 490, 510, 530, 550].map((x) => (
            <g key={x}>
              <circle cx={x} cy="288" r="4.5" fill="#B9A88E" />
              <circle cx={x} cy="344" r="4.5" fill="#B9A88E" />
            </g>
          ))}
        </>,
        "",
      )}
      <text x="452" y="286" fontSize="11" fontWeight="800" letterSpacing="1.2" fill={value === "owambe" ? "#E2621B" : "#4A3B32"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
        OWAMBE ROOM
      </text>
    </svg>
  );
}
