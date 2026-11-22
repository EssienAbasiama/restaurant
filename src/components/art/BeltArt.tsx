import { useId } from "react";
import { tiers, type BeltItem, type BeltKind } from "@/lib/menu";
import { around, blob, r1, scatter, tf } from "./kit";
import { Gloss, Specks } from "./pieces";

/* Top-down sushi & small chops on kaiten plates. viewBox 0 0 120 120. */

function Rice({ x, y, rot = 0, w = 36, h = 20 }: { x: number; y: number; rot?: number; w?: number; h?: number }) {
  return (
    <g transform={tf(x, y, rot)}>
      <rect x={-w / 2 + 1} y={-h / 2 + 2} width={w} height={h} rx={h / 2.2} fill="#000" opacity="0.18" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.2} fill="#FBF8F0" />
      {scatter(14, 0, 0, Math.min(w, h) / 2.2, 3).map((p) => (
        <ellipse key={p.i} cx={r1(p.x * (w / h) * 0.9)} cy={r1(p.y)} rx="2.2" ry="1.1" fill="#E9E2D2" transform={`rotate(${r1(p.rot)} ${r1(p.x * (w / h) * 0.9)} ${r1(p.y)})`} />
      ))}
    </g>
  );
}

function Nigiri({ x, y, rot, fish, stripe, extra }: { x: number; y: number; rot: number; fish: string; stripe?: string; extra?: React.ReactNode }) {
  return (
    <g transform={tf(x, y, rot)}>
      <Rice x={0} y={2} w={36} h={18} />
      <path d="M-21 -6 C-14 -14 14 -14 22 -6 C24 4 20 10 14 11 C0 13 -14 12 -20 8 C-24 2 -24 -2 -21 -6 Z" fill={fish} />
      {stripe &&
        [-12, -4, 4, 12].map((v) => <path key={v} d={`M${v - 3} -11 q5 10 2 21`} stroke={stripe} strokeWidth="2" fill="none" opacity="0.85" />)}
      {extra}
      <Gloss x={-6} y={-6} rx={9} ry={2} o={0.4} rot={-6} />
    </g>
  );
}

function Maki({ x, y, fill, rice = "#FBF8F0", inside = false }: { x: number; y: number; fill: string; rice?: string; inside?: boolean }) {
  return (
    <g transform={tf(x, y)}>
      <circle cx="1" cy="2" r="13" fill="#000" opacity="0.2" />
      {inside ? (
        <>
          <circle r="13" fill={rice} />
          <Specks x={0} y={0} r={12} n={22} colors={["#F28C2E", "#E2621B", "#2A2420"]} seed={x + y} size={[0.7, 1.3]} />
          <circle r="7.5" fill="#1C261D" />
          <circle r="6.4" fill={fill} />
        </>
      ) : (
        <>
          <circle r="13" fill="#1C261D" />
          <circle r="11" fill={rice} />
          <circle r="5.2" fill={fill} />
        </>
      )}
      <Gloss x={-4} y={-5} rx={4} ry={1.4} o={0.4} />
    </g>
  );
}

function Ball({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x + 1.5} cy={y + 2.5} r={r} fill="#000" opacity="0.22" />
      <circle cx={x} cy={y} r={r} fill="#C97A2A" />
      <circle cx={x - 2} cy={y - 2} r={r * 0.75} fill="#E49B44" />
      <Specks x={x} y={y} r={r * 0.8} n={10} colors={["#FFFDF6", "#F6EEDC"]} seed={Math.round(x * 3 + y)} size={[0.6, 1.2]} />
      <Gloss x={x - 3} y={y - 4} rx={3.6} ry={1.4} o={0.5} />
    </g>
  );
}

function Food({ kind, u }: { kind: BeltKind; u: string }) {
  switch (kind) {
    case "salmon-nigiri":
      return (
        <>
          <Nigiri x={60} y={46} rot={-18} fish="#F2864E" stripe="#FDE2CC" />
          <Nigiri x={60} y={74} rot={-18} fish="#F2864E" stripe="#FDE2CC" />
        </>
      );
    case "tuna-nigiri":
      return (
        <>
          <Nigiri x={60} y={46} rot={-18} fish="#B3202E" extra={<path d="M-14 -4 q14 -6 30 0" stroke="#D9566A" strokeWidth="2" fill="none" opacity="0.6" />} />
          <Nigiri x={60} y={74} rot={-18} fish="#B3202E" extra={<path d="M-14 -4 q14 -6 30 0" stroke="#D9566A" strokeWidth="2" fill="none" opacity="0.6" />} />
        </>
      );
    case "ebi-nigiri":
      return (
        <>
          {[46, 74].map((y) => (
            <Nigiri
              key={y}
              x={60}
              y={y}
              rot={-18}
              fish="#FBEDE2"
              stripe="#F07848"
              extra={<path d="M20 -4 l10 -6 l-2 8 l6 4 l-10 2 Z" fill="#E2552E" />}
            />
          ))}
        </>
      );
    case "tamago":
      return (
        <>
          {[46, 74].map((y) => (
            <g key={y}>
              <Nigiri x={60} y={y} rot={-18} fish="#F6CF4A" extra={<rect x="-3" y="-13" width="7" height="25" fill="#1C261D" />} />
            </g>
          ))}
        </>
      );
    case "unagi":
      return (
        <>
          {[46, 74].map((y) => (
            <Nigiri
              key={y}
              x={60}
              y={y}
              rot={-18}
              fish="#7A4220"
              extra={
                <>
                  <path d="M-18 -2 q18 -10 38 0" stroke="#4A220E" strokeWidth="3" fill="none" />
                  <Specks x={0} y={0} r={12} n={8} colors={["#F3E3BE"]} seed={y} size={[0.7, 1.2]} />
                </>
              }
            />
          ))}
        </>
      );
    case "salmon-maki":
      return (
        <>
          {around(4, 60, 60, 15, 45).map((p) => (
            <Maki key={p.i} x={p.x} y={p.y} fill="#F2864E" />
          ))}
        </>
      );
    case "cucumber-maki":
      return (
        <>
          {around(4, 60, 60, 15, 45).map((p) => (
            <Maki key={p.i} x={p.x} y={p.y} fill="#7AB648" />
          ))}
        </>
      );
    case "california":
      return (
        <>
          {around(4, 60, 60, 15, 45).map((p) => (
            <Maki key={p.i} x={p.x} y={p.y} fill="#F4A07A" inside />
          ))}
        </>
      );
    case "ikura":
      return (
        <>
          {[44, 76].map((x) => (
            <g key={x}>
              <ellipse cx={x + 1} cy="62" rx="15" ry="19" fill="#000" opacity="0.2" />
              <ellipse cx={x} cy="60" rx="15" ry="19" fill="#1C261D" />
              <ellipse cx={x} cy="60" rx="12" ry="16" fill="#FBF8F0" />
              {scatter(12, x, 60, 10, x).map((p) => (
                <g key={p.i}>
                  <circle cx={r1(p.x)} cy={r1(p.y)} r="3.6" fill="#F0621E" />
                  <circle cx={r1(p.x - 1)} cy={r1(p.y - 1.2)} r="1.1" fill="#fff" opacity="0.8" />
                </g>
              ))}
            </g>
          ))}
        </>
      );
    case "puff-puff":
      return (
        <>
          <Ball x={48} y={50} />
          <Ball x={72} y={52} />
          <Ball x={60} y={72} r={12} />
        </>
      );
    case "suya-stick":
      return (
        <g transform="rotate(-30 60 60)">
          <rect x="16" y="58" width="88" height="4" rx="2" fill="#C9A06A" />
          {[32, 50, 68, 86].map((x, i) => (
            <g key={x}>
              <path d={blob(x + 1, 62, 9, 7, { seed: i + 3, j: 0.2 })} fill="#000" opacity="0.25" />
              <path d={blob(x, 60, 9, 7, { seed: i + 3, j: 0.2 })} fill={`url(#${u}-suya)`} />
              <Specks x={x} y={60} r={7} n={8} colors={["#E08A3A", "#F2B05A"]} seed={i + 7} size={[0.6, 1.1]} />
            </g>
          ))}
          <ellipse cx="60" cy="78" rx="10" ry="6" fill="none" stroke="#9A3F7A" strokeWidth="2.6" />
        </g>
      );
    case "gizdodo":
      return (
        <>
          <path d={blob(60, 60, 30, 28, { seed: 4, j: 0.15 })} fill="#C3301E" opacity="0.85" />
          {scatter(9, 60, 60, 22, 8).map((p) =>
            p.i % 2 ? (
              <rect key={p.i} x={r1(p.x - 6)} y={r1(p.y - 5)} width="12" height="10" rx="3" fill="#F2A43A" stroke="#C96A1C" strokeWidth="1" transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`} />
            ) : (
              <path key={p.i} d={blob(p.x, p.y, 6.5, 5.5, { seed: p.i + 1, j: 0.25 })} fill="#6E3418" />
            ),
          )}
          <Specks x={60} y={60} r={26} n={20} colors={["#2E5B2A", "#8E1F12"]} seed={3} />
        </>
      );
    case "samosa":
      return (
        <>
          {[
            [48, 54, -10],
            [74, 66, 30],
          ].map(([x, y, r], i) => (
            <g key={i} transform={tf(x, y, r)}>
              <path d="M-16 14 L0 -16 L16 14 Z" fill="#000" opacity="0.2" transform="translate(1 2)" />
              <path d="M-16 14 L0 -16 L16 14 Z" fill="#E2A548" stroke="#B97A28" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M-8 10 L0 -6 L8 10" fill="none" stroke="#F7D27A" strokeWidth="1.4" />
              <Specks x={0} y={4} r={9} n={8} colors={["#B97A28"]} seed={i + 2} />
            </g>
          ))}
        </>
      );
    case "meat-pie":
      return (
        <g>
          <path d="M28 66 C28 38 92 38 92 66 Z" fill="#000" opacity="0.2" transform="translate(1 3)" />
          <path d="M28 66 C28 38 92 38 92 66 Z" fill="#E6A24A" />
          <path d="M34 62 C36 46 84 46 86 62" fill="#F2BF66" opacity="0.7" />
          {Array.from({ length: 13 }, (_, i) => (
            <circle key={i} cx={30 + i * 5} cy="66" r="2.6" fill="#C9822E" />
          ))}
          <path d="M50 52 l4 -4 M60 50 l4 -4 M70 52 l4 -4" stroke="#B97A28" strokeWidth="1.6" />
          <Gloss x={52} y={50} rx={10} ry={2.4} o={0.4} rot={-8} />
        </g>
      );
    case "spring-rolls":
      return (
        <>
          {[48, 62, 76].map((y, i) => (
            <g key={y} transform={tf(60, y, -14 + i * 4)}>
              <rect x="-28" y="-6" width="56" height="13" rx="6" fill="#000" opacity="0.2" transform="translate(1 2)" />
              <rect x="-28" y="-6" width="56" height="12" rx="6" fill="#E3A542" />
              <Specks x={0} y={0} r={20} ry={4} n={14} colors={["#C9822E", "#F7D27A"]} seed={i + 4} size={[0.8, 1.6]} />
              <rect x="-24" y="-4" width="40" height="3" rx="1.5" fill="#F7D27A" opacity="0.7" />
            </g>
          ))}
        </>
      );
    case "chin-chin":
      return (
        <>
          <circle cx="60" cy="62" r="26" fill="#F2ECDD" stroke="#D9CFBA" strokeWidth="2" />
          {scatter(26, 60, 60, 20, 5).map((p) => (
            <rect key={p.i} x={r1(p.x - 3.4)} y={r1(p.y - 3.4)} width="6.8" height="6.8" rx="1.4" fill={p.t > 0.5 ? "#D99A3E" : "#E8B356"} stroke="#B07424" strokeWidth="0.6" transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`} />
          ))}
        </>
      );
  }
}

export function BeltPlate({ item, className }: { item: BeltItem; className?: string }) {
  const u = "b" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const t = tiers[item.tier];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${u}-suya`} cx="40%" cy="38%">
          <stop offset="0" stopColor="#A8492A" />
          <stop offset="0.6" stopColor="#7A2C14" />
          <stop offset="1" stopColor="#4A170A" />
        </radialGradient>
        <radialGradient id={`${u}-plate`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#F6F3EC" />
          <stop offset="0.76" stopColor="#E2DDD2" />
          <stop offset="0.8" stopColor={t.color} />
          <stop offset="0.96" stopColor={t.color} />
          <stop offset="1" stopColor={t.rim} />
        </radialGradient>
      </defs>
      <circle cx="62" cy="64" r="56" fill="#000" opacity="0.35" />
      <circle cx="60" cy="60" r="56" fill={`url(#${u}-plate)`} />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
      <Food kind={item.id} u={u} />
    </svg>
  );
}
