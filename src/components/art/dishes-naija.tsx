import type { Opts } from "@/lib/menu";
import { around, blob, has, heatOf, pick, r1, rng, scatter, tf } from "./kit";
import {
  BayLeaf,
  Cabbage,
  Chicken,
  Coleslaw,
  Croaker,
  Dodo,
  EggHalf,
  Gloss,
  Heat,
  MeatChunk,
  MoiMoi,
  OnionRing,
  Periwinkle,
  Ponmo,
  Shaki,
  Snail,
  Specks,
  Stockfish,
  SuyaPiece,
  Swallow,
  TomatoSlice,
  UguLeaf,
  Yam,
} from "./pieces";

export type DishProps = { u: string; o?: Opts };

/* --------------------------- PARTY JOLLOF --------------------------- */

const RICE = ["#E8622A", "#F5904E", "#F0763A", "#D2461E", "#F9A866", "#E46A2E", "#FBB777"];
const SMOKE = ["#8A2C10", "#6E200A", "#A3391A"];

export function JollofArt({ u, o }: DishProps) {
  const protein = pick(o, "protein", "chicken");
  const heat = heatOf(o);
  const R = rng(4);
  const grains = scatter(470, 172, 212, 106, 11, 0, 0.94);

  return (
    <>
      <g data-stage="0" data-layer="plate">
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-enamel)`} />
        <circle cx="200" cy="200" r="184" fill="none" stroke="#2A4A9A" strokeWidth="15" />
        <circle cx="200" cy="200" r="191" fill="none" stroke="#162C66" strokeWidth="2" />
        <circle cx="200" cy="200" r="176" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.4" />
        {around(10, 200, 200, 160, 18).map((p) => (
          <g key={p.i} transform={tf(p.x, p.y, p.deg + 90)} opacity="0.85">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-4" rx="2.6" ry="4" fill="#D9472A" transform={`rotate(${a})`} />
            ))}
            <circle r="2" fill="#F2C443" />
            <path d="M5 2 q6 -2 9 4 M-5 2 q-6 -2 -9 4" stroke="#3E7A3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        ))}
        {[
          [62, 104, 5],
          [330, 300, 3.6],
          [92, 330, 3],
        ].map(([x, y, r], i) => (
          <path key={i} d={blob(x, y, r, r * 0.8, { seed: i + 3, j: 0.35 })} fill="#1A1A22" opacity="0.85" />
        ))}
      </g>

      <g data-stage="1" data-layer="sauce">
        <path d={blob(176, 218, 120, 112, { n: 14, j: 0.05, seed: 21 })} fill="#7A200A" opacity="0.18" />
        <path d={blob(172, 212, 118, 110, { n: 14, j: 0.05, seed: 21 })} fill={`url(#${u}-jollof)`} />
      </g>

      <g data-stage="2" data-layer="grains">
        {grains.map((p) => {
          const smoky = (p.x - 110) ** 2 + (p.y - 272) ** 2 < 62 ** 2 && p.t < 0.72;
          const c = smoky ? SMOKE[p.i % SMOKE.length] : RICE[Math.floor(p.t * RICE.length)];
          return (
            <ellipse
              key={p.i}
              data-grain={smoky ? "smoke" : ""}
              cx={r1(p.x)}
              cy={r1(p.y)}
              rx="6.4"
              ry={r1(2.3 + p.s * 0.5)}
              transform={`rotate(${r1(p.rot)} ${r1(p.x)} ${r1(p.y)})`}
              fill={c}
              stroke={smoky ? "#3A1004" : "#A8361A"}
              strokeOpacity={smoky ? 1 : 0.55}
              strokeWidth="0.7"
            />
          );
        })}
        <path d={blob(172, 212, 118, 110, { n: 14, j: 0.05, seed: 21 })} fill={`url(#${u}-top-light)`} />
      </g>

      <g data-stage="3" data-layer="leaf">
        <BayLeaf u={u} x={160} y={166} rot={-35} />
      </g>

      <g data-stage="3" data-layer="slaw">
        <Coleslaw u={u} x={88} y={150} s={0.86} seed={14} />
      </g>

      <g data-stage="3" data-layer="dodo">
        <Dodo u={u} x={258} y={100} rot={12} seed={1} />
        <Dodo u={u} x={294} y={130} rot={36} seed={2} />
        <Dodo u={u} x={322} y={172} rot={72} seed={3} />
        {has(o, "extras", "dodo") && (
          <>
            <Dodo u={u} x={104} y={300} rot={-30} seed={4} />
            <Dodo u={u} x={146} y={330} rot={-8} seed={5} />
            <Dodo u={u} x={74} y={258} rot={-60} seed={6} />
          </>
        )}
      </g>

      {has(o, "extras", "egg") && (
        <g data-stage="4">
          <EggHalf u={u} x={214} y={84} rot={-8} s={0.82} jammy={false} />
        </g>
      )}
      {has(o, "extras", "moimoi") && (
        <g data-stage="4">
          <MoiMoi u={u} x={214} y={326} rot={-6} s={0.82} />
        </g>
      )}

      <g data-stage="3" data-layer="chicken">
        {protein === "fish" ? (
          <Croaker u={u} x={272} y={262} rot={-28} s={0.8} />
        ) : protein === "turkey" ? (
          <Turkey2 u={u} />
        ) : (
          <Chicken u={u} x={288} y={258} rot={14} />
        )}
      </g>

      <Heat u={u} level={heat} cx={170} cy={214} r={84} seed={41} />
      <Specks x={170} y={210} r={90} n={10} colors={["#2E5B2A", "#4E8A3A"]} seed={R() * 100} size={[1, 1.8]} />
    </>
  );
}

function Turkey2({ u }: { u: string }) {
  // a rounder wing piece to read differently from chicken
  return (
    <g transform={tf(286, 256, 18)} data-piece="">
      <path d={blob(4, 6, 50, 32, { n: 11, j: 0.1, seed: 9 })} fill="#3A1206" opacity="0.22" />
      <path d={blob(-14, 0, 32, 27, { n: 9, j: 0.1, seed: 9 })} fill={`url(#${u}-turkey)`} />
      <path d={blob(22, -4, 30, 20, { n: 9, j: 0.12, seed: 10, rot: -20 })} fill={`url(#${u}-turkey)`} />
      <path d="M-2 -14 C4 -4 4 6 -2 18" stroke="#5E260C" strokeWidth="2" fill="none" opacity="0.5" />
      <Specks x={0} y={0} r={36} n={30} colors={["#5A1404", "#C3301E"]} seed={12} />
      <Gloss x={-20} y={-10} rx={10} ry={3} />
    </g>
  );
}

/* ------------------------------- EGUSI ------------------------------- */

export function EgusiArt({ u, o }: DishProps) {
  const sw = pick(o, "swallow", "pounded-yam");
  const heat = heatOf(o);
  const cx = 165;
  const cy = 222;
  const curds = scatter(180, cx, cy, 98, 5);
  const curdC = ["#FBE7B0", "#F6D68A", "#F0C66E", "#FFF1C8", "#EDBE5E"];

  return (
    <>
      <g data-stage="0">
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-raffia)`} />
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} cx="200" cy="200" r={18 + i * 7} fill="none" stroke={i % 2 ? "#C49455" : "#EED1A0"} strokeWidth="3.2" opacity="0.55" />
        ))}
        {around(56, 200, 200, 100).map((p) => (
          <path key={p.i} d={`M${r1(200 + (p.x - 200) * 0.3)} ${r1(200 + (p.y - 200) * 0.3)} L${r1(200 + (p.x - 200) * 1.82)} ${r1(200 + (p.y - 200) * 1.82)}`} stroke="#A87A40" strokeWidth="0.9" opacity="0.35" />
        ))}
        <circle cx="200" cy="200" r="186" fill="none" stroke="#8E6230" strokeWidth="10" />
        <circle cx="200" cy="200" r="186" fill="none" stroke="#C49455" strokeWidth="2" strokeDasharray="3 6" />
      </g>

      <g data-stage="0">
        <circle cx={cx + 4} cy={cy + 7} r="124" fill="#2A1606" opacity="0.3" />
        <circle cx={cx} cy={cy} r="124" fill={`url(#${u}-calabash)`} />
        <path
          d={
            around(48, cx, cy, 114)
              .map((p, i) => {
                const rr = i % 2 ? 110 : 118;
                const a = (p.deg * Math.PI) / 180;
                return `${i ? "L" : "M"}${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`;
              })
              .join(" ") + "Z"
          }
          fill="none"
          stroke="#D9A866"
          strokeWidth="1.6"
          opacity="0.8"
        />
      </g>

      <g data-stage="1">
        <circle cx={cx} cy={cy} r="104" fill={`url(#${u}-egusi)`} />
      </g>

      <g data-stage="2">
        {curds.map((p) => (
          <path key={p.i} data-bit="" d={blob(p.x, p.y, 2.6 + p.s * 4.6, 2.2 + p.s * 3.8, { n: 6, j: 0.3, seed: p.i })} fill={curdC[Math.floor(p.t * curdC.length)]} />
        ))}
        {scatter(10, cx, cy, 88, 61, 60).map((p) => (
          <path key={p.i} d={blob(p.x, p.y, 10 + p.s * 10, 6 + p.s * 6, { seed: p.i + 4, j: 0.3 })} fill="#E2621B" opacity="0.28" />
        ))}
        <Specks x={cx} y={cy} r={96} n={40} colors={["#F28C2E", "#E2621B"]} seed={8} size={[1.2, 3]} />
      </g>

      <g data-stage="3">
        {[
          [118, 170, 20],
          [214, 168, -40],
          [106, 246, 70],
          [196, 288, 10],
          [150, 300, -30],
          [228, 236, 110],
          [140, 130, 60],
        ].map(([x, y, r], i) => (
          <UguLeaf key={i} u={u} x={x} y={y} rot={r} seed={i + 1} s={0.95} />
        ))}
      </g>

      <g data-stage="3">
        <MeatChunk u={u} x={184} y={204} rot={10} seed={2} />
        <MeatChunk u={u} x={146} y={232} rot={-30} seed={3} s={0.9} />
        <Shaki u={u} x={206} y={258} rot={20} seed={4} />
        <Shaki u={u} x={122} y={196} rot={-15} seed={5} s={0.9} />
        <Ponmo u={u} x={170} y={168} rot={-20} />
        <Ponmo u={u} x={176} y={276} rot={30} s={0.9} />
        {has(o, "extras", "stockfish") && (
          <>
            <Stockfish u={u} x={110} y={276} rot={-40} seed={2} />
            <Stockfish u={u} x={232} y={196} rot={70} seed={3} s={0.85} />
          </>
        )}
        {has(o, "extras", "goat") && (
          <>
            <MeatChunk u={u} x={226} y={276} rot={40} seed={7} s={1.15} />
            <MeatChunk u={u} x={94} y={226} rot={-10} seed={8} s={1.05} />
          </>
        )}
        {has(o, "extras", "ponmo") && (
          <>
            <Ponmo u={u} x={130} y={278} rot={60} />
            <Ponmo u={u} x={236} y={226} rot={-50} s={0.9} />
          </>
        )}
      </g>

      <Heat u={u} level={heat} cx={cx} cy={cy} r={80} seed={12} />

      <g data-stage="4">
        <Swallow u={u} x={300} y={126} rot={-28} kind={sw} r={58} />
      </g>
    </>
  );
}

/* ------------------------------- AFANG ------------------------------- */

const AFANG = ["#4E7A2E", "#2E4A1A", "#6E9A3E", "#1F3314", "#5E8A36", "#3A5E22"];

export function AfangArt({ u, o }: DishProps) {
  const sw = pick(o, "swallow", "fufu");
  const heat = heatOf(o);
  const R = rng(17);
  const shreds = scatter(460, 200, 206, 152, 3);
  const winkles = scatter(has(o, "extras", "periwinkle") ? 28 : 16, 196, 214, 118, 19);

  return (
    <>
      <g data-stage="0">
        <rect x="6" y="186" width="30" height="28" rx="10" fill="#8E3E1C" />
        <rect x="364" y="186" width="30" height="28" rx="10" fill="#8E3E1C" />
        <circle cx="200" cy="200" r="190" fill={`url(#${u}-terracotta)`} />
        <circle cx="200" cy="200" r="176" fill="none" stroke="#D88A5C" strokeWidth="2" opacity="0.6" />
        <Specks x={200} y={200} r={188} n={120} colors={["#7A3418", "#D9875A", "#6A2810"]} seed={9} size={[0.6, 1.6]} />
        <circle cx="200" cy="206" r="164" fill="#3A1A0A" opacity="0.5" />
      </g>

      <g data-stage="1">
        <circle cx="200" cy="206" r="160" fill={`url(#${u}-afang)`} />
      </g>

      <g data-stage="2">
        {shreds.map((p) => {
          const a = (p.rot * Math.PI) / 180;
          const l = 3 + p.s * 6;
          return (
            <path
              key={p.i}
              d={`M${r1(p.x)} ${r1(p.y)} l${r1(Math.cos(a) * l)} ${r1(Math.sin(a) * l)}`}
              stroke={AFANG[Math.floor(p.t * AFANG.length)]}
              strokeWidth={r1(1.4 + R() * 1.2)}
              strokeLinecap="round"
            />
          );
        })}
        {around(9, 200, 206, 128, 10).map((p) => (
          <path key={p.i} d={blob(p.x, p.y, 22, 10, { seed: p.i + 2, j: 0.35, rot: p.deg + 90 })} fill="#E2621B" opacity="0.34" />
        ))}
        <Specks x={200} y={206} r={150} n={60} colors={["#F28C2E", "#E86A1E", "#FFB25A"]} seed={22} size={[1, 3.2]} />
      </g>

      <g data-stage="3">
        {winkles.map((p) => (
          <Periwinkle key={p.i} u={u} x={p.x} y={p.y} rot={p.rot} s={0.95 + p.s * 0.3} />
        ))}
        <MeatChunk u={u} x={168} y={170} rot={30} seed={4} />
        <MeatChunk u={u} x={250} y={230} rot={-20} seed={5} s={0.9} />
        <Ponmo u={u} x={150} y={250} rot={-30} />
        <Ponmo u={u} x={222} y={286} rot={20} s={0.9} />
        <Ponmo u={u} x={256} y={172} rot={70} s={0.85} />
        {has(o, "extras", "snail") && (
          <>
            <Snail u={u} x={200} y={212} rot={20} seed={3} s={1.1} />
            <Snail u={u} x={120} y={200} rot={-30} seed={4} />
          </>
        )}
        {has(o, "extras", "stockfish") && (
          <>
            <Stockfish u={u} x={190} y={262} rot={10} seed={5} />
            <Stockfish u={u} x={272} y={262} rot={-60} seed={6} s={0.85} />
          </>
        )}
      </g>

      <Heat u={u} level={heat} cx={200} cy={210} r={110} seed={30} />

      <g data-stage="4">
        <Swallow u={u} x={302} y={104} rot={-36} kind={sw} r={50} />
      </g>
    </>
  );
}

/* -------------------------------- SUYA -------------------------------- */

export function SuyaArt({ u, o }: DishProps) {
  const meat = pick(o, "meat", "beef");
  const heat = heatOf(o);
  const R = rng(8);
  const pile = scatter(17, 196, 206, 70, 31);
  const lines: { x: number; y: number; w: number }[] = [];
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 22; row++) {
      if (col === 1 && row > 2 && row < 9) continue;
      lines.push({ x: -118 + col * 82, y: -78 + row * 8.6, w: 50 + R() * 22 });
    }
  }

  return (
    <>
      <g data-stage="0">
        <clipPath id={`${u}-board`}>
          <circle cx="200" cy="200" r="190" />
        </clipPath>
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-wood)`} />
        <g clipPath={`url(#${u}-board)`} opacity="0.22">
          {Array.from({ length: 30 }, (_, i) => (
            <path key={i} d={`M0 ${r1(i * 14 + R() * 6)} C120 ${r1(i * 14 - 8 + R() * 10)} 260 ${r1(i * 14 + 10 + R() * 8)} 400 ${r1(i * 14 + R() * 6)}`} stroke="#5E3416" strokeWidth={r1(0.8 + R() * 1.6)} fill="none" />
          ))}
        </g>
        <circle cx="200" cy="200" r="188" fill="none" stroke="#6E4320" strokeWidth="5" />
      </g>

      <g data-stage="0" transform="rotate(-12 200 206)">
        <path d="M68 76 L330 70 L336 330 L72 340 Z" fill="#000" opacity="0.18" transform="translate(4 6)" />
        <path d="M68 76 L200 72 L330 70 L334 200 L336 330 L200 336 L72 340 L70 210 Z" fill={`url(#${u}-paper)`} />
        <g transform="translate(200 206)" opacity="0.55">
          <rect x="-118" y="-118" width="236" height="18" fill="#2A2420" opacity="0.75" />
          <text x="0" y="-104" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fontWeight="700" fill="#F2ECDD" letterSpacing="2">
            THE DAILY ÀDÙN
          </text>
          {lines.map((l, i) => (
            <rect key={i} x={r1(l.x)} y={r1(l.y)} width={r1(l.w)} height="2.4" fill="#5A5048" opacity="0.6" />
          ))}
          <rect x="-36" y="-56" width="70" height="44" fill="#8A8076" opacity="0.5" />
        </g>
        {[
          [140, 250, 34],
          [262, 130, 26],
          [250, 290, 22],
        ].map(([x, y, r], i) => (
          <path key={i} d={blob(x, y, r, r * 0.8, { seed: i + 7, j: 0.3 })} fill="#D9661E" opacity="0.16" />
        ))}
      </g>

      <g data-stage="3">
        <Cabbage u={u} x={112} y={272} seed={4} />
        <Cabbage u={u} x={94} y={236} seed={9} s={0.8} />
        {[
          [110, 132, 10],
          [138, 118, 50],
          [96, 160, -20],
          [130, 156, 80],
        ].map(([x, y, r], i) => (
          <OnionRing key={i} u={u} x={x} y={y} rot={r} />
        ))}
        {has(o, "extras", "onions") &&
          [
            [158, 318, 20],
            [184, 330, -30],
            [132, 306, 60],
          ].map(([x, y, r], i) => <OnionRing key={`e${i}`} u={u} x={x} y={y} rot={r} />)}
        <TomatoSlice u={u} x={290} y={126} rot={10} />
        <TomatoSlice u={u} x={320} y={170} rot={40} s={0.92} />
        <TomatoSlice u={u} x={258} y={94} rot={70} s={0.85} />
      </g>

      <g data-stage="3">
        <line x1="70" y1="196" x2="246" y2="104" stroke="#000" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" transform="translate(3 4)" />
        <line x1="70" y1="196" x2="246" y2="104" stroke={`url(#${u}-stick)`} strokeWidth="5" strokeLinecap="round" />
        {pile.map((p) => (
          <SuyaPiece key={p.i} u={u} x={p.x} y={p.y} rot={p.rot} s={0.9 + p.s * 0.25} seed={p.i + 1} meat={meat} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <SuyaPiece key={`k${i}`} u={u} x={100 + i * 40} y={180 - i * 21} rot={-28} s={0.95} seed={i + 40} meat={meat} />
        ))}
        {has(o, "extras", "kilishi") &&
          [0, 1, 2].map((i) => (
            <g key={`kl${i}`} transform={tf(150 + i * 12, 322 - i * 6, -20 + i * 14)}>
              <path d={blob(0, 0, 26, 12, { seed: i + 50, j: 0.18 })} fill="#7A2A14" />
              <Specks x={0} y={0} r={20} ry={8} n={18} colors={["#E08A3A", "#3A1006"]} seed={i + 51} />
              <Gloss x={-6} y={-4} rx={10} ry={2} o={0.25} />
            </g>
          ))}
        {has(o, "extras", "yam") && <Yam u={u} x={238} y={318} rot={-8} s={0.9} />}
      </g>

      <g data-stage="4">
        <path d={blob(306, 288, 30, 24, { seed: 3, j: 0.15 })} fill="#000" opacity="0.18" transform="translate(2 4)" />
        <path d={blob(306, 288, 30, 24, { seed: 3, j: 0.15 })} fill="#C9662B" />
        <path d={blob(302, 282, 18, 13, { seed: 4, j: 0.2 })} fill="#E08A3A" />
        <Specks x={306} y={288} r={26} n={70} colors={["#F2B05A", "#8E2F13", "#B4441C", "#F7D08A"]} seed={6} size={[0.6, 1.5]} />
      </g>

      <Heat u={u} level={heat} cx={196} cy={206} r={70} seed={8} />
    </>
  );
}
