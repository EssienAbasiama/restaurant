import { around, blob, has, heatOf, pick, r1, rng, scatter, strand, tf } from "./kit";
import type { DishProps } from "./dishes-naija";
import {
  Basil,
  Butter,
  Chashu,
  Chimichurri,
  Corn,
  Dodo,
  EggHalf,
  Fries,
  Gloss,
  Guanciale,
  Heat,
  Kikurage,
  Lemon,
  Menma,
  Mozz,
  Nori,
  Potato,
  Scallions,
  Sesame,
  Specks,
  SteakSlice,
  Truffle,
} from "./pieces";

/* ------------------------------ TONKOTSU ------------------------------ */

export function RamenArt({ u, o }: DishProps) {
  const broth = pick(o, "broth", "classic");
  const heat = heatOf(o);
  const R = rng(3);
  const strands = Array.from({ length: 24 }, (_, i) => {
    const ang = (32 * Math.PI) / 180;
    const dir = [Math.cos(ang), Math.sin(ang)];
    const perp = [-dir[1], dir[0]];
    const off = -62 + i * 5.4 + (R() - 0.5) * 3;
    const c = [138, 246];
    const len = 92 - Math.abs(off) * 0.5;
    return {
      x0: c[0] - dir[0] * len + perp[0] * off,
      y0: c[1] - dir[1] * len + perp[1] * off,
      x1: c[0] + dir[0] * len + perp[0] * off,
      y1: c[1] + dir[1] * len + perp[1] * off,
      ph: R() * 6,
    };
  });

  return (
    <>
      <g data-stage="0">
        <clipPath id={`${u}-bowl`}>
          <circle cx="200" cy="200" r="166" />
        </clipPath>
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-glaze)`} />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#A3302A" strokeWidth="13" />
        {around(30, 200, 200, 182).map((p) => (
          <path key={p.i} d="M-5 5 V-5 H5 V3 H-2.4 V-2.4 H2.4 V0.6" transform={tf(p.x, p.y, p.deg + 90)} stroke="#1A0F0C" strokeWidth="1.5" fill="none" />
        ))}
        <circle cx="200" cy="200" r="191" fill="none" stroke="#000" strokeWidth="2" />
        <circle cx="200" cy="200" r="172" fill="none" stroke="#F2E6D8" strokeOpacity="0.35" strokeWidth="2" />
      </g>

      <g data-stage="1">
        <circle cx="200" cy="200" r="168" fill={broth === "red" ? `url(#${u}-redbroth)` : `url(#${u}-tonkotsu)`} />
        {broth === "black" && (
          <g opacity="0.88">
            <path
              d={(() => {
                let d = "";
                for (let i = 0; i <= 90; i++) {
                  const a = i * 0.21;
                  const rr = 14 + i * 1.2;
                  d += `${i ? "L" : "M"}${r1(214 + Math.cos(a) * rr)} ${r1(206 + Math.sin(a) * rr * 0.9)} `;
                }
                return d;
              })()}
              stroke="#140C0A"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <Specks x={214} y={206} r={140} n={40} colors={["#140C0A", "#2A1A14"]} seed={4} size={[1.5, 4]} />
          </g>
        )}
        {scatter(54, 200, 200, 158, 7).map((p) => (
          <circle key={p.i} cx={r1(p.x)} cy={r1(p.y)} r={r1(1.2 + p.s * 3.6)} fill={broth === "red" ? "#E2481E" : "#FFF4D6"} opacity={broth === "red" ? 0.6 : 0.55} stroke="#B48A4E" strokeOpacity="0.4" strokeWidth="0.5" />
        ))}
      </g>

      <g data-stage="2" clipPath={`url(#${u}-bowl)`}>
        {strands.map((s, i) => (
          <g key={i} data-bit="">
            <path d={strand(s.x0, s.y0, s.x1, s.y1, 3, 4.5, s.ph, 26)} stroke="#C99A3E" strokeWidth="6.4" fill="none" strokeLinecap="round" />
            <path d={strand(s.x0, s.y0, s.x1, s.y1, 3, 4.5, s.ph, 26)} stroke="#F4D584" strokeWidth="4.4" fill="none" strokeLinecap="round" />
            <path d={strand(s.x0, s.y0 - 1, s.x1, s.y1 - 1, 3, 4.5, s.ph, 26)} stroke="#FFF2C2" strokeWidth="1" fill="none" opacity="0.6" />
          </g>
        ))}
        <path d={blob(96, 290, 70, 46, { seed: 5, j: 0.2, rot: 30 })} fill={broth === "red" ? "#D8693A" : "#E8CB98"} opacity="0.55" />
      </g>

      <g data-stage="3">
        <Nori u={u} x={300} y={86} rot={22} seed={1} />
        <Nori u={u} x={328} y={116} rot={40} seed={2} />
        {has(o, "extras", "nori") && <Nori u={u} x={340} y={156} rot={62} seed={3} />}
        <Chashu u={u} x={264} y={142} rot={-10} seed={1} />
        <Chashu u={u} x={302} y={198} rot={30} seed={2} />
        {has(o, "extras", "chashu") && <Chashu u={u} x={290} y={262} rot={70} seed={3} s={0.92} />}
        <Menma u={u} x={240} y={274} rot={30} />
        <Kikurage u={u} x={186} y={150} rot={-60} seed={2} />
        <EggHalf u={u} x={150} y={126} rot={-24} />
        <EggHalf u={u} x={200} y={100} rot={14} />
        {has(o, "extras", "egg") && <EggHalf u={u} x={110} y={170} rot={-60} />}
        {has(o, "extras", "corn") && (
          <>
            <Corn u={u} x={196} y={300} seed={3} />
            <Butter u={u} x={222} y={312} rot={14} />
          </>
        )}
      </g>

      <g data-stage="4">
        <Scallions x={214} y={214} r={26} n={28} seed={4} />
        <Scallions x={170} y={196} r={40} n={8} seed={9} />
        <Sesame x={210} y={212} r={60} n={30} seed={5} dark />
        {(broth === "red" || heat > 1) && (
          <g>
            {Array.from({ length: 6 + heat * 4 }, (_, i) => (
              <path key={i} d={strand(204 + R() * 20, 200 + R() * 20, 222 + R() * 20, 214 + R() * 20, 2, 1.2, R() * 6, 8)} stroke="#D3261A" strokeWidth="0.9" fill="none" />
            ))}
          </g>
        )}
      </g>
      {heat > 0 && <Specks x={200} y={210} r={150} n={heat * 22} colors={["#E2481E", "#C3301E"]} seed={33} size={[1.4, 4]} />}

      <circle cx="200" cy="200" r="168" fill={`url(#${u}-inner-shadow)`} />
    </>
  );
}

/* ------------------------------ CARBONARA ------------------------------ */

export function CarbonaraArt({ u, o }: DishProps) {
  const pasta = pick(o, "pasta", "spaghetti");
  const heat = heatOf(o);
  const R = rng(12);
  const arcs = Array.from({ length: 86 }, () => {
    const rr = 8 + Math.pow(R(), 0.8) * 90;
    const cx = 200 + (R() - 0.5) * 12;
    const cy = 200 + (R() - 0.5) * 12;
    const a0 = R() * Math.PI * 2;
    const sweep = (70 + R() * 150) * (Math.PI / 180);
    const a1 = a0 + sweep;
    return {
      rr,
      d: `M${r1(cx + Math.cos(a0) * rr)} ${r1(cy + Math.sin(a0) * rr)} A${r1(rr)} ${r1(rr * 0.96)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${r1(cx + Math.cos(a1) * rr)} ${r1(cy + Math.sin(a1) * rr)}`,
      hi: R() > 0.55,
    };
  }).sort((a, b) => b.rr - a.rr);
  const tubes = scatter(48, 200, 200, 86, 14);

  return (
    <>
      <g data-stage="0">
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-porcelain)`} />
        <circle cx="200" cy="200" r="186" fill="none" stroke="#C9C1B2" strokeWidth="1" />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#B8935A" strokeWidth="1.2" opacity="0.6" />
        <circle cx="200" cy="200" r="126" fill="none" stroke="#D3CBBE" strokeWidth="1.4" />
      </g>

      <g data-stage="1">
        <path d={blob(200, 202, 106, 102, { seed: 3, j: 0.06, n: 12 })} fill={`url(#${u}-carbonara)`} />
      </g>

      <g data-stage="2">
        {pasta === "rigatoni"
          ? tubes.map((p) => (
              <g key={p.i} data-bit="" transform={tf(p.x, p.y, p.rot)}>
                <rect x="-14" y="-6.4" width="28" height="13" rx="5.5" fill="#000" opacity="0.14" transform="translate(1 2)" />
                <rect x="-14" y="-6.4" width="28" height="13" rx="5.5" fill="#F3CF72" />
                {[-8, -3, 2, 7].map((v) => (
                  <path key={v} d={`M${v} -6 L${v} 6`} stroke="#D9AE4E" strokeWidth="1" />
                ))}
                <ellipse cx="13" cy="0" rx="2.6" ry="5.6" fill="#C99B3E" />
                <ellipse cx="13" cy="0" rx="1.2" ry="3.2" fill="#8E6A28" />
                <rect x="-12" y="-5" width="22" height="3" rx="1.5" fill="#FFF0B8" opacity="0.6" />
              </g>
            ))
          : arcs.map((a, i) => (
              <g key={i} data-bit="">
                <path d={a.d} stroke="#CFA145" strokeWidth="5.6" fill="none" strokeLinecap="round" />
                <path d={a.d} stroke="#F6D77E" strokeWidth="3.8" fill="none" strokeLinecap="round" />
                {a.hi && <path d={a.d} stroke="#FFF6CF" strokeWidth="1" fill="none" opacity="0.65" />}
              </g>
            ))}
      </g>

      <g data-stage="3">
        {scatter(has(o, "extras", "guanciale") ? 24 : 14, 200, 200, 82, 21).map((p) => (
          <Guanciale key={p.i} u={u} x={p.x} y={p.y} rot={p.rot} s={0.95 + p.s * 0.3} />
        ))}
      </g>

      <g data-stage="4">
        <Specks x={200} y={196} r={92} n={180} colors={["#FFF8DE", "#F7EBC0", "#FFFFFF", "#F1DFA4"]} seed={6} size={[0.7, 1.7]} />
        <path d={blob(190, 184, 22, 14, { seed: 7, j: 0.3 })} fill="#FFF8E2" opacity="0.85" />
        <Specks x={190} y={184} r={18} n={40} colors={["#F3E6B5", "#FFFFFF"]} seed={8} size={[0.6, 1.3]} />
        <Specks x={200} y={200} r={100} n={[70, 120, 190, 300][Math.min(3, heat)]} colors={["#1E1712", "#3A2E26", "#0E0A08"]} seed={9} size={[0.6, 1.5]} />
        {has(o, "extras", "yolk") && (
          <g>
            <circle cx="208" cy="204" r="25" fill="#000" opacity="0.15" />
            <circle cx="206" cy="200" r="23" fill={`url(#${u}-yolk)`} />
            <Gloss x={198} y={190} rx={8} ry={3.4} o={0.6} />
          </g>
        )}
        {has(o, "extras", "truffle") &&
          around(6, 200, 200, 52, 12).map((p) => <Truffle key={p.i} u={u} x={p.x} y={p.y} rot={p.deg} seed={p.i + 1} />)}
      </g>
    </>
  );
}

/* ------------------------------ MARGHERITA ------------------------------ */

export function PizzaArt({ u, o }: DishProps) {
  const big = pick(o, "size", "12") === "12";
  const heat = heatOf(o);
  const R = rng(5);

  return (
    <>
      <g data-stage="0">
        <clipPath id={`${u}-peel`}>
          <circle cx="200" cy="200" r="190" />
        </clipPath>
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-woodlight)`} />
        <g clipPath={`url(#${u}-peel)`} opacity="0.18">
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d={`M${r1(i * 18 + R() * 6)} 0 C${r1(i * 18 - 6)} 140 ${r1(i * 18 + 10)} 260 ${r1(i * 18 + R() * 6)} 400`} stroke="#7A4A20" strokeWidth={r1(0.8 + R() * 1.4)} fill="none" />
          ))}
        </g>
        <circle cx="200" cy="200" r="189" fill="none" stroke="#9A6A38" strokeWidth="3" />
        <Specks x={200} y={200} r={186} n={40} colors={["#F7F1E4"]} seed={44} size={[0.8, 2]} />
      </g>

      <g transform={big ? undefined : "translate(200 200) scale(0.9) translate(-200 -200)"}>
        <g data-stage="1">
          <circle cx="204" cy="208" r="174" fill="#3A1E0A" opacity="0.28" />
          <circle cx="200" cy="200" r="174" fill={`url(#${u}-crust)`} />
          <path d={blob(200, 200, 140, 138, { n: 16, j: 0.04, seed: 5 })} fill={`url(#${u}-sauce)`} />
          {scatter(10, 200, 200, 110, 6).map((p) => (
            <path key={p.i} d={blob(p.x, p.y, 16 + p.s * 18, 12 + p.s * 10, { seed: p.i + 1, j: 0.3 })} fill={p.t > 0.5 ? "#E05A35" : "#A82A17"} opacity="0.45" />
          ))}
        </g>

        <g data-stage="2">
          {around(26, 200, 200, 160, 7).map((p) => {
            const rr = 150 + (p.i % 3) * 7;
            const a = (p.deg * Math.PI) / 180;
            return <path key={p.i} data-bit="" d={blob(200 + Math.cos(a) * rr, 200 + Math.sin(a) * rr, 4 + (p.i % 4) * 1.6, 3 + (p.i % 3), { seed: p.i + 3, j: 0.3 })} fill="#2E1C10" opacity="0.72" />;
          })}
          <Specks x={200} y={200} r={172} n={50} colors={["#FFFDF6"]} seed={8} size={[0.6, 1.6]} />
        </g>

        <g data-stage="3">
          {[
            [200, 200, 1.1],
            [140, 148, 1],
            [262, 156, 0.95],
            [130, 238, 0.9],
            [252, 262, 1],
            [196, 290, 0.85],
            [200, 118, 0.85],
            [292, 214, 0.8],
          ].map(([x, y, s], i) =>
            has(o, "extras", "burrata") && i === 0 ? null : <Mozz key={i} u={u} x={x} y={y} s={s} seed={i + 2} />,
          )}
          {has(o, "extras", "burrata") && (
            <g>
              <path d={blob(202, 206, 46, 42, { seed: 4, j: 0.1 })} fill="#000" opacity="0.18" />
              <path d={blob(200, 200, 46, 42, { seed: 4, j: 0.1 })} fill={`url(#${u}-mozz)`} />
              <path d={blob(204, 204, 22, 18, { seed: 6, j: 0.35 })} fill="#FFF6DD" />
              <Specks x={204} y={204} r={18} n={20} colors={["#F7E8C0", "#fff"]} seed={7} />
              <Gloss x={186} y={184} rx={14} ry={4} o={0.6} />
            </g>
          )}
          {has(o, "extras", "nduja") &&
            scatter(9, 200, 200, 120, 15, 40).map((p) => (
              <g key={p.i}>
                <path d={blob(p.x, p.y, 9, 8, { seed: p.i + 20, j: 0.3 })} fill="#B32A12" />
                <path d={blob(p.x - 2, p.y - 2, 4, 3, { seed: p.i + 21, j: 0.3 })} fill="#E2552E" />
              </g>
            ))}
        </g>

        <g data-stage="4">
          <Basil u={u} x={262} y={128} rot={-30} />
          <Basil u={u} x={168} y={186} rot={40} s={0.9} />
          <Basil u={u} x={228} y={226} rot={-110} s={0.95} />
          <Basil u={u} x={110} y={196} rot={100} s={0.85} />
          <Basil u={u} x={226} y={300} rot={10} s={0.9} />
          <path d={strand(110, 140, 300, 280, 14, 2.4, 1, 30)} stroke="#E7CF5A" strokeOpacity="0.45" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {has(o, "extras", "honey") && (
            <>
              <path d={strand(100, 250, 300, 120, 18, 3, 0.5, 34)} stroke="#E8922A" strokeOpacity="0.85" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d={strand(120, 120, 300, 260, 12, 2.4, 2, 34)} stroke="#F2A93A" strokeOpacity="0.75" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
        {heat > 0 && <Specks x={200} y={200} r={140} n={heat * 30} colors={["#C3301E", "#8E1F12", "#E2621B"]} seed={18} size={[0.8, 2]} />}
      </g>
    </>
  );
}

/* ------------------------------ ASADO ------------------------------ */

export function AsadoArt({ u, o }: DishProps) {
  const done = pick(o, "doneness", "medium-rare");
  const side = pick(o, "side", "potatoes");
  const heat = heatOf(o);

  return (
    <>
      <g data-stage="0">
        <circle cx="200" cy="200" r="192" fill={`url(#${u}-slate)`} />
        <Specks x={200} y={200} r={186} n={160} colors={["#4E4844", "#24211F", "#57514C"]} seed={3} size={[0.6, 2.2]} />
        <circle cx="200" cy="200" r="189" fill="none" stroke="#5A544F" strokeWidth="2" />
      </g>

      <g data-stage="2">
        {side === "fries" ? (
          <Fries u={u} x={122} y={290} rot={-20} />
        ) : side === "dodo" ? (
          <>
            <Dodo u={u} x={112} y={276} rot={-40} seed={1} />
            <Dodo u={u} x={140} y={314} rot={-10} seed={2} />
            <Dodo u={u} x={88} y={240} rot={-70} seed={3} />
          </>
        ) : (
          <>
            <Potato u={u} x={96} y={256} rot={10} seed={1} />
            <Potato u={u} x={124} y={292} rot={-30} seed={2} />
            <Potato u={u} x={160} y={318} rot={40} seed={3} />
            <Potato u={u} x={92} y={300} rot={70} seed={4} s={0.85} />
            <Potato u={u} x={130} y={252} rot={-60} seed={5} s={0.8} />
          </>
        )}
      </g>

      <g data-stage="3">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SteakSlice key={i} u={u} x={132 + i * 22} y={142 + i * 11} rot={24 + i * 2} seed={i + 1} doneness={done} />
        ))}
        <Specks x={210} y={190} r={80} ry={60} n={40} colors={["#FFFFFF", "#F2EEE6"]} seed={6} size={[0.8, 1.8]} />
        {has(o, "extras", "marrow") && <Butter u={u} x={232} y={164} rot={18} s={1.05} />}
      </g>

      <g data-stage="4">
        <Chimichurri u={u} x={258} y={276} rot={-28} len={120} seed={2} />
        {has(o, "extras", "chimi") && <Chimichurri u={u} x={166} y={102} rot={-28} len={100} seed={5} />}
        <Lemon u={u} x={306} y={116} rot={20} />
        {heat > 0 && <Specks x={258} y={276} r={60} ry={20} n={heat * 14} colors={["#C3301E", "#E2481E"]} seed={9} size={[1, 2.2]} />}
      </g>
      {heat > 2 && <Heat u={u} level={1} cx={260} cy={280} r={30} seed={2} />}
    </>
  );
}
