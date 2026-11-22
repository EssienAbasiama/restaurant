import { around, blob, openPath, r1, rng, scatter, strand, tf, type Pt } from "./kit";

export type PieceProps = { u: string; x: number; y: number; rot?: number; s?: number; seed?: number; className?: string };

const G = ({ x, y, rot = 0, s = 1, className, children }: Omit<PieceProps, "u" | "seed"> & { children: React.ReactNode }) => (
  <g transform={tf(x, y, rot, s)} className={className} data-piece="">
    {children}
  </g>
);

/* ------------------------------ generic ------------------------------ */

export function Specks({ u: _u, x, y, r, n, colors, seed = 1, size = [0.8, 1.8], ry }: { u?: string; x: number; y: number; r: number; n: number; colors: string[]; seed?: number; size?: [number, number]; ry?: number }) {
  const R = rng(seed + 900);
  return (
    <g>
      {scatter(n, x, y, r, seed, 0, ry ? ry / r : 1).map((p) => (
        <ellipse
          key={p.i}
          cx={r1(p.x)}
          cy={r1(p.y)}
          rx={r1(size[0] + p.s * (size[1] - size[0]))}
          ry={r1((size[0] + p.s * (size[1] - size[0])) * (0.55 + R() * 0.4))}
          transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`}
          fill={colors[Math.floor(p.t * colors.length)]}
        />
      ))}
    </g>
  );
}

export function Gloss({ x, y, rx, ry, rot = -25, o = 0.35 }: { x: number; y: number; rx: number; ry: number; rot?: number; o?: number }) {
  return <ellipse cx={r1(x)} cy={r1(y)} rx={rx} ry={ry} fill="#fff" opacity={o} transform={`rotate(${rot} ${r1(x)} ${r1(y)})`} />;
}

/** Pepper flakes + scotch bonnet slices proportional to heat. */
export function Heat({ u, level, cx, cy, r, seed = 77 }: { u: string; level: number; cx: number; cy: number; r: number; seed?: number }) {
  if (level <= 0) return null;
  const slices = [0, 1, 3, 5][Math.min(3, level)];
  const pts = scatter(slices, cx, cy, r * 0.8, seed);
  return (
    <g data-stage="5">
      <Specks x={cx} y={cy} r={r} n={[0, 18, 34, 60][Math.min(3, level)]} colors={["#C3301E", "#E2481E", "#8E1F12"]} seed={seed} size={[1, 2.4]} />
      {pts.map((p) => (
        <ScotchBonnet key={p.i} u={u} x={p.x} y={p.y} rot={p.rot} s={0.8 + p.s * 0.35} seed={p.i} orange={p.t > 0.6} />
      ))}
    </g>
  );
}

export function ScotchBonnet({ x, y, rot, s, seed = 1, orange }: PieceProps & { orange?: boolean }) {
  const R = rng(seed + 31);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 0, 10, 9, { n: 7, j: 0.12, seed })} fill={orange ? "#F28C1E" : "#D83A22"} />
      <path d={blob(0, 0, 6.6, 5.8, { n: 7, j: 0.16, seed: seed + 2 })} fill={orange ? "#FBB860" : "#F27A5A"} />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={r1((R() - 0.5) * 6)} cy={r1((R() - 0.5) * 6)} rx="1.3" ry="0.8" fill="#F8E2A0" />
      ))}
      <Gloss x={-3} y={-4} rx={3.5} ry={1.4} o={0.45} />
    </G>
  );
}

/* ------------------------------ naija ------------------------------ */

export function Dodo({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  const R = rng(seed + 5);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(1, 2, 28, 18, { n: 10, j: 0.06, seed })} fill="#000" opacity="0.18" />
      <path d={blob(0, 0, 28, 18, { n: 10, j: 0.06, seed })} fill={`url(#${u}-dodo)`} />
      <path d={blob(-1, -1, 19, 10.5, { n: 8, j: 0.12, seed: seed + 3 })} fill="#FCD06A" opacity="0.55" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={r1((R() - 0.5) * 40)} cy={r1((R() - 0.5) * 22)} rx={r1(1.5 + R() * 3)} ry={r1(1 + R() * 1.5)} fill="#9A4A12" opacity="0.45" />
      ))}
      <Gloss x={-8} y={-7} rx={9} ry={2.6} o={0.4} />
    </G>
  );
}

export function Chicken({ u, x, y, rot, s, seed = 3 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(4, 6, 46, 33, { n: 10, j: 0.08, seed })} fill="#3A1206" opacity="0.25" />
      <path d="M30 -8 C46 -14 58 -22 66 -24 L70 -14 C60 -10 48 -2 34 8 Z" fill="#B85A2A" />
      <circle cx="70" cy="-21" r="7.5" fill="#F1E5CF" />
      <circle cx="74" cy="-15" r="6.5" fill="#E9DBC1" />
      <path d={blob(0, 0, 44, 32, { n: 10, j: 0.08, seed })} fill={`url(#${u}-glazed)`} />
      <path d={blob(-6, -6, 30, 18, { n: 8, j: 0.2, seed: seed + 4 })} fill="#E88A48" opacity="0.28" />
      <Specks x={0} y={0} r={34} n={34} colors={["#5A1404", "#C3301E", "#2A0A04"]} seed={seed + 8} size={[0.8, 2]} />
      <Gloss x={-14} y={-14} rx={13} ry={4} o={0.35} />
      <Gloss x={8} y={-18} rx={6} ry={2} o={0.3} />
    </G>
  );
}

export function Turkey({ u, x, y, rot, s, seed = 9 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(4, 6, 50, 30, { n: 11, j: 0.1, seed })} fill="#3A1206" opacity="0.22" />
      <path d={blob(-14, 0, 32, 26, { n: 9, j: 0.1, seed })} fill={`url(#${u}-turkey)`} />
      <path d={blob(22, -4, 30, 20, { n: 9, j: 0.12, seed: seed + 1, rot: -20 })} fill={`url(#${u}-turkey)`} />
      <path d="M-2 -14 C4 -4 4 6 -2 18" stroke="#5E260C" strokeWidth="2" fill="none" opacity="0.5" />
      <Specks x={0} y={0} r={36} n={30} colors={["#5A1404", "#C3301E"]} seed={seed + 3} />
      <Gloss x={-20} y={-10} rx={10} ry={3} />
    </G>
  );
}

export function Croaker({ u: _u, x, y, rot, s, seed = 5 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d="M-70 4 C-50 -26 30 -30 56 -4 L80 -20 L76 4 L82 26 L56 10 C30 34 -50 32 -70 4 Z" fill="#000" opacity="0.2" transform="translate(3 5)" />
      <path d="M-70 0 C-50 -28 30 -32 56 -6 L80 -22 L76 0 L82 22 L56 6 C30 30 -50 28 -70 0 Z" fill="#B98455" />
      <path d="M-66 0 C-48 -22 28 -24 52 -4 C28 22 -48 22 -66 0 Z" fill="#D2A06A" opacity="0.7" />
      {[-40, -24, -8, 8, 24].map((cx, i) => (
        <path key={i} d={`M${cx} -18 L${cx + 10} 16`} stroke="#3A1E0E" strokeWidth={r1(2.5 + R())} strokeLinecap="round" opacity="0.75" />
      ))}
      <path d={blob(-12, -2, 30, 9, { n: 9, j: 0.3, seed: 3 })} fill="#C3301E" opacity="0.7" />
      <Specks x={-12} y={-2} r={22} n={16} colors={["#E2621B", "#8E1F12"]} seed={6} />
      <circle cx="-54" cy="-4" r="5" fill="#F4EEE2" />
      <circle cx="-54" cy="-4" r="2.4" fill="#1A1210" />
      <Gloss x={-10} y={-16} rx={20} ry={3} o={0.25} rot={-6} />
    </G>
  );
}

export function MoiMoi({ u, x, y, rot, s, seed = 4 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d="M-50 -4 C-30 -40 30 -44 54 -10 C40 30 -30 40 -50 -4 Z" fill={`url(#${u}-banana)`} />
      <path d="M-46 -4 C-10 -12 20 -14 50 -10" stroke="#8CC06A" strokeWidth="1.6" fill="none" opacity="0.7" />
      <rect x="-30" y="-20" width="60" height="38" rx="16" fill="#000" opacity="0.18" transform="translate(2 4)" />
      <rect x="-30" y="-20" width="60" height="38" rx="16" fill={`url(#${u}-moimoi)`} />
      <Specks x={0} y={0} r={18} n={26} colors={["#B5532A", "#F6C9A4", "#9A3E1A"]} seed={seed} />
      <ellipse cx="6" cy="2" rx="7" ry="5" fill="#FFF3D6" />
      <ellipse cx="6" cy="2" rx="3.5" ry="2.6" fill="#F2C443" />
      <Gloss x={-12} y={-12} rx={10} ry={2.6} />
    </G>
  );
}

export function EggHalf({ u, x, y, rot, s, jammy = true }: PieceProps & { jammy?: boolean }) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <ellipse cx="2" cy="4" rx="31" ry="24" fill="#000" opacity="0.16" />
      <ellipse cx="0" cy="0" rx="31" ry="24" fill={jammy ? `url(#${u}-white)` : `url(#${u}-white-plain)`} />
      <ellipse cx="2" cy="1" rx="17" ry="14" fill={jammy ? `url(#${u}-yolk)` : `url(#${u}-yolk-firm)`} />
      {jammy && <ellipse cx="3" cy="2" rx="9" ry="7" fill="#E0580A" opacity="0.4" />}
      <Gloss x={-12} y={-11} rx={10} ry={3.4} o={0.5} />
      <Gloss x={-3} y={-6} rx={4} ry={1.6} o={0.6} />
    </G>
  );
}

export function Coleslaw({ x, y, rot, s, seed = 12 }: PieceProps) {
  const R = rng(seed);
  const shreds = scatter(46, 0, 0, 26, seed);
  const colors = ["#F3F0E2", "#C9E09A", "#A8C97A", "#F2A04A", "#EFEBD9"];
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 4, 34, 28, { seed })} fill="#000" opacity="0.12" />
      <path d={blob(0, 0, 34, 28, { seed })} fill="#F7F3E6" />
      {shreds.map((p) => {
        const a = p.rot * (Math.PI / 180);
        const l = 6 + R() * 7;
        return (
          <path
            key={p.i}
            d={`M${r1(p.x)} ${r1(p.y)} q${r1(Math.cos(a) * l * 0.5 + 2)} ${r1(Math.sin(a) * l * 0.5 - 2)} ${r1(Math.cos(a) * l)} ${r1(Math.sin(a) * l)}`}
            stroke={colors[Math.floor(p.t * colors.length)]}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
      <Gloss x={-8} y={-10} rx={10} ry={3} o={0.4} />
    </G>
  );
}

export function BayLeaf({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d="M-30 0 C-14 -12 14 -12 32 0 C14 12 -14 12 -30 0 Z" fill="#000" opacity="0.15" transform="translate(1 3)" />
      <path d="M-30 0 C-14 -12 14 -12 32 0 C14 12 -14 12 -30 0 Z" fill="#7C8A44" />
      <path d="M-30 0 C-14 -12 14 -12 32 0" fill="#95A458" opacity="0.6" />
      <path d="M-28 0 L30 0" stroke="#B9C47E" strokeWidth="1.2" />
      {[-16, -6, 4, 14].map((v) => (
        <path key={v} d={`M${v} 0 l7 -6 M${v} 0 l7 6`} stroke="#B9C47E" strokeWidth="0.8" opacity="0.7" />
      ))}
    </G>
  );
}

export function UguLeaf({ u, x, y, rot, s, seed = 2 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 0, 18, 11, { n: 9, j: 0.28, seed })} fill={`url(#${u}-leaf)`} />
      <path d="M-14 0 L15 0" stroke="#8CC06A" strokeWidth="1" opacity="0.7" />
      <path d="M-4 0 l5 -6 M4 0 l5 6 M-8 0 l-3 6" stroke="#8CC06A" strokeWidth="0.7" opacity="0.6" />
    </G>
  );
}

export function MeatChunk({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 3, 19, 15, { n: 8, j: 0.2, seed })} fill="#000" opacity="0.22" />
      <path d={blob(0, 0, 19, 15, { n: 8, j: 0.2, seed })} fill={`url(#${u}-beef)`} />
      <path d={`M-10 -4 q8 -4 16 2 M-8 4 q8 -3 14 3`} stroke="#4A1E0C" strokeWidth="1.2" fill="none" opacity="0.6" />
      <Gloss x={-6} y={-7} rx={6} ry={2} o={0.35} />
    </G>
  );
}

export function Shaki({ x, y, rot, s, seed = 1 }: PieceProps) {
  const cells = scatter(16, 0, 0, 14, seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 3, 22, 15, { n: 9, j: 0.18, seed })} fill="#000" opacity="0.18" />
      <path d={blob(0, 0, 22, 15, { n: 9, j: 0.18, seed })} fill="#E4D3B0" />
      {cells.map((c) => (
        <circle key={c.i} cx={r1(c.x)} cy={r1(c.y * 0.7)} r={r1(2 + c.s * 1.6)} fill="none" stroke="#BFA77C" strokeWidth="1" />
      ))}
      <path d={blob(0, 0, 22, 15, { n: 9, j: 0.18, seed })} fill="#E2621B" opacity="0.18" />
    </G>
  );
}

export function Ponmo({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <rect x="-17" y="-8" width="34" height="17" rx="8" fill="#000" opacity="0.18" transform="translate(2 3)" />
      <rect x="-17" y="-8" width="34" height="17" rx="8" fill="#D6A464" />
      <rect x="-14" y="-6" width="28" height="12" rx="6" fill="#EDC98E" opacity="0.6" />
      <Gloss x={-6} y={-4} rx={8} ry={1.6} o={0.6} rot={0} />
    </G>
  );
}

export function Stockfish({ x, y, rot, s, seed = 1 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 0, 24, 9, { n: 9, j: 0.25, seed })} fill="#E8DECB" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M-20 ${r1(-5 + i * 2.4)} q20 ${r1((R() - 0.5) * 4)} 40 0`} stroke="#C2B49A" strokeWidth="0.9" fill="none" />
      ))}
    </G>
  );
}

export function Periwinkle({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <ellipse cx="1" cy="1.6" rx="7.4" ry="6.6" fill="#000" opacity="0.3" />
      <path d="M-7 2 C-7 -6 4 -9 8 -3 C10 2 6 7 0 7 C-4 7 -7 5 -7 2 Z" fill="#2E2620" />
      <path d="M-4 1 C-3 -4 4 -5 5 -1 C5 2 2 4 0 3" stroke="#8C7A66" strokeWidth="1.2" fill="none" />
      <circle cx="-2.5" cy="-3" r="1.4" fill="#fff" opacity="0.4" />
    </G>
  );
}

export function Snail({ x, y, rot, s, seed = 1 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 3, 22, 15, { n: 9, j: 0.14, seed })} fill="#000" opacity="0.25" />
      <path d={blob(0, 0, 22, 15, { n: 9, j: 0.14, seed })} fill="#5A3A24" />
      <path d="M-12 2 C-10 -8 8 -9 10 0 C11 6 2 8 -2 4 C-4 2 -2 -2 2 -1" stroke="#8C6446" strokeWidth="2" fill="none" />
      <Gloss x={-7} y={-6} rx={7} ry={2} o={0.35} />
    </G>
  );
}

export function Swallow({ u, x, y, rot, s, kind = "pounded-yam", r = 60 }: PieceProps & { kind?: string; r?: number }) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={`M${-r - 18} 4 C${-r} ${-r - 10} ${r} ${-r - 16} ${r + 22} -4 C${r} ${r + 14} ${-r} ${r + 18} ${-r - 18} 4 Z`} fill={`url(#${u}-banana)`} />
      <path d={`M${-r - 14} 4 C${-r / 2} -4 ${r / 2} -6 ${r + 18} -4`} stroke="#93C470" strokeWidth="2" fill="none" opacity="0.8" />
      {[-0.6, -0.3, 0.3, 0.6].map((k, i) => (
        <path key={i} d={`M${r1(k * r)} -2 l${r1(k * 18)} ${-r * 0.8}`} stroke="#3E7A2E" strokeWidth="1" opacity="0.45" />
      ))}
      <circle cx="4" cy="8" r={r} fill="#000" opacity="0.2" />
      <circle cx="0" cy="0" r={r} fill={`url(#${u}-swallow-${kind})`} />
      <path d={`M${-r * 0.5} ${r * 0.1} C${-r * 0.2} ${r * 0.3} ${r * 0.3} ${r * 0.25} ${r * 0.5} ${r * 0.05}`} stroke="#000" strokeOpacity="0.08" strokeWidth="3" fill="none" />
      <Gloss x={-r * 0.32} y={-r * 0.38} rx={r * 0.32} ry={r * 0.12} o={0.5} />
    </G>
  );
}

export function SuyaPiece({ u, x, y, rot, s, seed = 1, meat = "beef" }: PieceProps & { meat?: string }) {
  const fill = meat === "chicken" ? `url(#${u}-suya-chicken)` : meat === "ram" ? `url(#${u}-suya-ram)` : `url(#${u}-suya)`;
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 3, 24, 13, { n: 9, j: 0.18, seed })} fill="#000" opacity="0.25" />
      <path d={blob(0, 0, 24, 13, { n: 9, j: 0.18, seed })} fill={fill} />
      <Specks x={0} y={0} r={20} ry={10} n={26} colors={["#E08A3A", "#F2B05A", "#B4441C", "#5A1A0A"]} seed={seed + 3} size={[0.7, 1.7]} />
      <Gloss x={-6} y={-5} rx={8} ry={2} o={0.25} />
    </G>
  );
}

export function OnionRing({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <ellipse rx="17" ry="12" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="5" transform="translate(1 2)" />
      <ellipse rx="17" ry="12" fill="none" stroke="#9A3F7A" strokeWidth="4.2" />
      <ellipse rx="17" ry="12" fill="none" stroke="#EBC4DC" strokeWidth="1.6" />
      <ellipse rx="10" ry="6.5" fill="none" stroke="#B4558E" strokeWidth="2.6" />
    </G>
  );
}

export function TomatoSlice({ u, x, y, rot, s }: PieceProps) {
  const ch = around(4, 0, 0, 10, 20);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <circle cx="2" cy="3" r="22" fill="#000" opacity="0.18" />
      <circle r="22" fill={`url(#${u}-tomato)`} />
      <circle r="22" fill="none" stroke="#A81F10" strokeWidth="2.4" />
      {ch.map((c) => (
        <g key={c.i}>
          <ellipse cx={r1(c.x)} cy={r1(c.y)} rx="7" ry="5" transform={`rotate(${r1(c.deg)} ${r1(c.x)} ${r1(c.y)})`} fill="#F6957A" />
          <ellipse cx={r1(c.x)} cy={r1(c.y)} rx="1.6" ry="1" fill="#F8E09A" />
          <ellipse cx={r1(c.x * 1.2)} cy={r1(c.y * 1.2)} rx="1.4" ry="0.9" fill="#F8E09A" />
        </g>
      ))}
      <circle r="3.4" fill="#F7A890" />
      <Gloss x={-8} y={-10} rx={7} ry={2.4} o={0.4} />
    </G>
  );
}

export function Cabbage({ x, y, rot, s, seed = 4 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {scatter(30, 0, 0, 22, seed).map((p) => (
        <path
          key={p.i}
          d={`M${r1(p.x - 8)} ${r1(p.y)} q8 ${r1((R() - 0.5) * 10)} 16 ${r1((R() - 0.5) * 6)}`}
          transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`}
          stroke={p.t > 0.5 ? "#DDECC0" : "#B9D68E"}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </G>
  );
}

export function Yam({ x, y, rot, s, seed = 3 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {[0, 1, 2, 3, 4].map((i) => {
        const yy = -16 + i * 8 + (R() - 0.5) * 3;
        const rr = (R() - 0.5) * 20;
        return (
          <g key={i} transform={`rotate(${r1(rr)}) translate(0 ${r1(yy)})`}>
            <rect x="-24" y="-5" width="48" height="11" rx="4" fill="#000" opacity="0.15" transform="translate(1 2)" />
            <rect x="-24" y="-5" width="48" height="11" rx="4" fill="#F2CF7A" />
            <rect x="-24" y="-5" width="48" height="11" rx="4" fill="none" stroke="#C98E36" strokeWidth="1.6" />
          </g>
        );
      })}
    </G>
  );
}

/* ------------------------------ japan ------------------------------ */

export function Chashu({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  const pts: Pt[] = [];
  for (let i = 0; i < 40; i++) {
    const a = i * 0.42;
    const rr = 3 + i * 0.75;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.92]);
  }
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(3, 4, 42, 39, { n: 10, j: 0.06, seed })} fill="#000" opacity="0.2" />
      <path d={blob(0, 0, 42, 39, { n: 10, j: 0.06, seed })} fill={`url(#${u}-chashu)`} />
      <path d={openPath(pts)} stroke="#FBE7D2" strokeWidth="3.2" fill="none" opacity="0.8" strokeLinecap="round" />
      <path d={blob(0, 0, 42, 39, { n: 10, j: 0.06, seed })} fill="none" stroke="#3E1406" strokeWidth="3" opacity="0.45" />
      <Specks x={0} y={0} r={38} n={18} colors={["#3E1406"]} seed={seed + 2} size={[1, 2.6]} />
      <Gloss x={-14} y={-16} rx={14} ry={4} o={0.3} />
    </G>
  );
}

export function Nori({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <rect x="-30" y="-50" width="64" height="104" rx="3" fill="#000" opacity="0.25" transform="translate(3 4)" />
      <rect x="-32" y="-52" width="64" height="104" rx="3" fill={`url(#${u}-nori)`} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${r1(-28 + R() * 50)} ${r1(-48 + R() * 90)} l${r1(4 + R() * 8)} ${r1((R() - 0.5) * 3)}`} stroke="#3B4C38" strokeWidth="1" />
      ))}
      <rect x="-32" y="-52" width="64" height="104" rx="3" fill="none" stroke="#405240" strokeWidth="1.2" />
      <rect x="-32" y="22" width="64" height="30" fill="#E7CF9E" opacity="0.18" />
    </G>
  );
}

export function Scallions({ x, y, r = 22, n = 22, seed = 1 }: { x: number; y: number; r?: number; n?: number; seed?: number }) {
  return (
    <g data-piece="">
      {scatter(n, x, y, r, seed).map((p) => {
        const white = p.t > 0.75;
        const rr = r1(2.6 + p.s * 2.4);
        return (
          <g key={p.i}>
            <circle cx={r1(p.x)} cy={r1(p.y)} r={rr} fill={white ? "#F6F8EA" : "#D6EBA4"} stroke={white ? "#C3DA92" : "#4E9A2C"} strokeWidth="1.6" />
            <circle cx={r1(p.x)} cy={r1(p.y)} r={r1(rr * 0.35)} fill={white ? "#E6EED0" : "#A8D27A"} />
          </g>
        );
      })}
    </g>
  );
}

export function Menma({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {[-12, -6, 0, 6, 12].map((o, i) => (
        <g key={i} transform={`rotate(${o * 0.6}) translate(0 ${o})`}>
          <rect x="-20" y="-3.6" width="40" height="7.2" rx="3" fill="#000" opacity="0.12" transform="translate(1 2)" />
          <rect x="-20" y="-3.6" width="40" height="7.2" rx="3" fill="#D9B26A" />
          <path d="M-16 0 L16 0" stroke="#B68A3E" strokeWidth="0.8" />
        </g>
      ))}
    </G>
  );
}

export function Kikurage({ x, y, rot, s, seed = 1 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const yy = -12 + i * 5;
        return (
          <g key={i}>
            <path d={strand(-18, yy, 18, yy + (R() - 0.5) * 6, 2.4, 1.5, R() * 6, 10)} stroke="#2E1E14" strokeWidth="4.4" strokeLinecap="round" fill="none" />
            <path d={strand(-17, yy - 1, 17, yy + (R() - 0.5) * 4, 2.4, 1.5, R() * 6, 10)} stroke="#6B4A34" strokeWidth="0.9" fill="none" />
          </g>
        );
      })}
    </G>
  );
}

export function Corn({ x, y, rot, s, seed = 1 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {scatter(30, 0, 0, 20, seed).map((p) => (
        <rect key={p.i} x={r1(p.x - 3)} y={r1(p.y - 3.4)} width="6" height="6.8" rx="2.2" fill={p.t > 0.4 ? "#F7CA45" : "#F2B82E"} stroke="#D49A1E" strokeWidth="0.8" transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`} />
      ))}
    </G>
  );
}

export function Butter({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 2, 26, 22, { n: 9, j: 0.2, seed: 3 })} fill="#F7D46E" opacity="0.55" />
      <rect x="-15" y="-13" width="30" height="26" rx="5" fill="#FCE9A8" />
      <rect x="-15" y="-13" width="30" height="8" rx="4" fill="#fff" opacity="0.5" />
    </G>
  );
}

export function Sesame({ x, y, r, n, seed = 1, dark = false }: { x: number; y: number; r: number; n: number; seed?: number; dark?: boolean }) {
  return (
    <g>
      {scatter(n, x, y, r, seed).map((p) => (
        <ellipse key={p.i} cx={r1(p.x)} cy={r1(p.y)} rx="2" ry="1.1" fill={dark && p.t > 0.5 ? "#2A2420" : "#F3E3BE"} transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`} />
      ))}
    </g>
  );
}

/* ------------------------------ italy ------------------------------ */

export function Basil({ u, x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d="M-20 0 C-10 -14 12 -14 22 0 C12 14 -10 14 -20 0 Z" fill="#000" opacity="0.2" transform="translate(1 3)" />
      <path d="M-20 0 C-10 -14 12 -14 22 0 C12 14 -10 14 -20 0 Z" fill={`url(#${u}-basil)`} />
      <path d="M-18 0 L20 0" stroke="#8ED07A" strokeWidth="1.2" opacity="0.8" />
      {[-8, 0, 8].map((v) => (
        <path key={v} d={`M${v} 0 q4 -4 8 -7 M${v} 0 q4 4 8 7`} stroke="#8ED07A" strokeWidth="0.7" fill="none" opacity="0.6" />
      ))}
      <Gloss x={-4} y={-5} rx={8} ry={2} o={0.35} rot={-10} />
    </G>
  );
}

export function Mozz({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 0, 26, 23, { n: 10, j: 0.16, seed })} fill={`url(#${u}-mozz)`} />
      <path d={blob(6, 4, 9, 6, { n: 7, j: 0.3, seed: seed + 1 })} fill="#D9A55A" opacity="0.35" />
      <path d={blob(-8, 8, 5, 4, { n: 7, j: 0.3, seed: seed + 2 })} fill="#C98E46" opacity="0.3" />
    </G>
  );
}

export function Guanciale({ x, y, rot, s }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <rect x="-7" y="-6" width="15" height="13" rx="3.2" fill="#000" opacity="0.2" transform="translate(1 2)" />
      <rect x="-7" y="-6" width="15" height="13" rx="3.2" fill="#C2704C" />
      <rect x="-7" y="-6" width="15" height="5.5" rx="2.6" fill="#F2D6B8" />
      <rect x="-7" y="-6" width="15" height="13" rx="3.2" fill="none" stroke="#7A3416" strokeWidth="1.2" opacity="0.6" />
    </G>
  );
}

export function Truffle({ x, y, rot, s, seed = 1 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(0, 0, 15, 12, { n: 9, j: 0.1, seed })} fill="#4A3326" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${r1(-12 + R() * 4)} ${r1(-8 + i * 5)} q12 ${r1((R() - 0.5) * 8)} 24 ${r1((R() - 0.5) * 4)}`} stroke="#B49478" strokeWidth="0.8" fill="none" />
      ))}
    </G>
  );
}

/* ------------------------------ grill ------------------------------ */

const DONENESS: Record<string, [string, string, number]> = {
  rare: ["#B9233C", "#9A6A58", 0.82],
  "medium-rare": ["#D45560", "#9A6A58", 0.7],
  medium: ["#D08A80", "#9A6E5E", 0.52],
  well: ["#A27866", "#8E6452", 0.2],
};

/** One slice of a sliced steak, cut face up: crust → grey band → pink centre. */
export function SteakSlice({ x, y, rot, s, seed = 1, doneness = "medium-rare" }: PieceProps & { doneness?: string }) {
  const [pink, band, k] = DONENESS[doneness] ?? DONENESS["medium-rare"];
  const R = rng(seed + 70);
  const outline = blob(0, 0, 17, 56, { n: 12, j: 0.05, seed });
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={outline} fill="#000" opacity="0.4" transform="translate(5 5)" />
      <path d={outline} fill="#3A170B" />
      <path d={blob(0, 0, 13.5, 51, { n: 12, j: 0.05, seed })} fill={band} />
      <path d={blob(0, 1, 13.5 * k, 51 * (0.55 + k * 0.4), { n: 12, j: 0.07, seed: seed + 1 })} fill={pink} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M-12 ${r1(-40 + i * 15 + R() * 4)} q12 ${r1((R() - 0.5) * 6)} 24 ${r1((R() - 0.5) * 4)}`} stroke="#5A2418" strokeWidth="0.7" opacity="0.35" fill="none" />
      ))}
      <path d={blob(0, -48, 15, 7, { n: 8, j: 0.2, seed: seed + 2 })} fill="#EBDDC2" opacity="0.92" />
      <path d={outline} fill="none" stroke="#1A0804" strokeWidth="2" opacity="0.6" />
      <ellipse cx="-5" cy="-6" rx="2.6" ry="22" fill="#fff" opacity="0.12" />
    </G>
  );
}

export function Potato({ u, x, y, rot, s, seed = 1 }: PieceProps) {
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={blob(2, 4, 22, 17, { n: 9, j: 0.12, seed })} fill="#000" opacity="0.3" />
      <path d={blob(0, 0, 22, 17, { n: 9, j: 0.12, seed })} fill={`url(#${u}-potato)`} />
      <Specks x={0} y={0} r={16} n={10} colors={["#3E6A2A", "#5E8A3A"]} seed={seed + 3} size={[0.8, 1.6]} />
      <Specks x={0} y={0} r={16} n={6} colors={["#FFFFFF"]} seed={seed + 5} size={[0.6, 1.1]} />
      <Gloss x={-6} y={-6} rx={7} ry={2.4} o={0.4} />
    </G>
  );
}

export function Fries({ x, y, rot, s, seed = 2 }: PieceProps) {
  const R = rng(seed);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      {Array.from({ length: 11 }, (_, i) => {
        const a = (R() - 0.5) * 70;
        const dx = (R() - 0.5) * 30;
        const dy = (R() - 0.5) * 24;
        return (
          <g key={i} transform={`translate(${r1(dx)} ${r1(dy)}) rotate(${r1(a)})`}>
            <rect x="-22" y="-3.5" width="44" height="8" rx="2" fill="#000" opacity="0.2" transform="translate(1 2)" />
            <rect x="-22" y="-3.5" width="44" height="7.5" rx="2" fill={R() > 0.5 ? "#F6CF6A" : "#EDBA4A"} stroke="#C98E2E" strokeWidth="0.8" />
          </g>
        );
      })}
    </G>
  );
}

export function Lemon({ x, y, rot, s }: PieceProps) {
  const seg = around(8, 0, 0, 17);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <circle cx="2" cy="3" r="24" fill="#000" opacity="0.3" />
      <circle r="24" fill="#E7C43A" />
      <circle r="20.5" fill="#F7DE6A" />
      {seg.map((p) => (
        <path key={p.i} d={`M0 0 L${r1(p.x)} ${r1(p.y)}`} stroke="#FFF3B8" strokeWidth="1.6" />
      ))}
      <path d="M-18 -8 L18 -14 M-20 4 L20 -2 M-16 14 L16 10" stroke="#3A2414" strokeWidth="3.4" opacity="0.55" strokeLinecap="round" />
      <circle r="2.4" fill="#FFF3B8" />
    </G>
  );
}

export function Chimichurri({ x, y, rot, s, seed = 1, len = 70 }: PieceProps & { len?: number }) {
  const R = rng(seed);
  const n = Math.round(len / 4);
  return (
    <G x={x} y={y} rot={rot} s={s}>
      <path d={`M${-len / 2} 0 Q0 -8 ${len / 2} 0`} stroke="#5E7A2A" strokeOpacity="0.45" strokeWidth="18" strokeLinecap="round" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const px = -len / 2 + t * len + (R() - 0.5) * 6;
        const py = -Math.sin(t * Math.PI) * 4 + (R() - 0.5) * 10;
        return <path key={i} d={blob(px, py, 3 + R() * 2.4, 2 + R() * 1.6, { n: 6, j: 0.3, seed: i + seed })} fill={R() > 0.5 ? "#3E7A2A" : "#5E9E3A"} />;
      })}
      <Specks x={0} y={-2} r={len / 2} ry={7} n={Math.round(len / 5)} colors={["#C3301E", "#E2621B"]} seed={seed + 5} size={[0.8, 1.6]} />
      <path d={`M${-len / 2 + 6} -3 Q0 -9 ${len / 2 - 6} -3`} stroke="#E6D27A" strokeOpacity="0.4" strokeWidth="2" fill="none" />
    </G>
  );
}
