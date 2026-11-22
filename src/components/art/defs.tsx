/** Shared gradients. Every dish SVG renders these once with its own id prefix. */
type Stop = [number, string, number?];

const R = ({ id, stops, cx = "50%", cy = "50%", r = "50%", fx, fy }: { id: string; stops: Stop[]; cx?: string; cy?: string; r?: string; fx?: string; fy?: string }) => (
  <radialGradient id={id} cx={cx} cy={cy} r={r} fx={fx} fy={fy}>
    {stops.map(([o, c, a], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />
    ))}
  </radialGradient>
);

const L = ({ id, stops, x2 = "1", y2 = "0" }: { id: string; stops: Stop[]; x2?: string; y2?: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {stops.map(([o, c, a], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />
    ))}
  </linearGradient>
);

export function Defs({ u }: { u: string }) {
  return (
    <defs>
      {/* ceramics & vessels */}
      <R id={`${u}-enamel`} stops={[[0, "#FFFFFF"], [0.72, "#F6F4EF"], [0.79, "#DEDAD1"], [0.82, "#FBFAF7"], [1, "#E6E2D9"]]} />
      <R id={`${u}-porcelain`} stops={[[0, "#FFFFFF"], [0.58, "#F7F5F0"], [0.63, "#E3DFD6"], [0.67, "#FCFBF8"], [1, "#E9E5DC"]]} />
      <R id={`${u}-glaze`} stops={[[0, "#3A2620"], [0.86, "#1F1310"], [0.93, "#2E1C17"], [1, "#0F0907"]]} />
      <R id={`${u}-terracotta`} stops={[[0, "#C86A40"], [0.82, "#B4552E"], [0.9, "#D07A4C"], [0.95, "#9A4322"], [1, "#6E2C14"]]} />
      <R id={`${u}-slate`} stops={[[0, "#46413D"], [0.85, "#2D2A27"], [0.95, "#3B3734"], [1, "#1A1817"]]} />
      <R id={`${u}-wood`} stops={[[0, "#C9925A"], [0.8, "#A9713D"], [0.92, "#BE8650"], [1, "#6E4320"]]} />
      <R id={`${u}-woodlight`} stops={[[0, "#E0B07A"], [0.8, "#C9955E"], [0.92, "#D9A872"], [1, "#8C5A2C"]]} />
      <R id={`${u}-raffia`} stops={[[0, "#E2C08A"], [0.7, "#D4AA6C"], [0.9, "#C49455"], [1, "#8E6230"]]} />
      <R id={`${u}-calabash`} stops={[[0, "#9C6A36"], [0.86, "#7A4E24"], [0.93, "#A87640"], [1, "#4E2E12"]]} />
      <R id={`${u}-inner-shadow`} stops={[[0.8, "#000", 0], [1, "#000", 0.28]]} />
      <R id={`${u}-top-light`} cx="38%" cy="30%" r="70%" stops={[[0, "#fff", 0.22], [0.6, "#fff", 0], [1, "#000", 0.12]]} />

      {/* sauces & bases */}
      <R id={`${u}-jollof`} stops={[[0, "#EE7334"], [0.7, "#DB5424"], [1, "#B5391A"]]} />
      <R id={`${u}-tonkotsu`} stops={[[0, "#F7EBD2"], [0.62, "#EFD8AE"], [0.9, "#DDB57B"], [1, "#B88A4E"]]} />
      <R id={`${u}-redbroth`} stops={[[0, "#F2A262"], [0.62, "#E07A3C"], [0.9, "#C2502A"], [1, "#8E3418"]]} />
      <R id={`${u}-egusi`} stops={[[0, "#F0B84A"], [0.7, "#DE9631"], [1, "#B9701A"]]} />
      <R id={`${u}-afang`} stops={[[0, "#4A6A26"], [0.7, "#36521C"], [1, "#22361A"]]} />
      <R id={`${u}-carbonara`} stops={[[0, "#F6DA88"], [0.8, "#EBC566"], [1, "#D9A94A", 0]]} />
      <R id={`${u}-sauce`} stops={[[0, "#D8462A"], [0.8, "#C5361D"], [1, "#A82A17"]]} />
      <R id={`${u}-crust`} stops={[[0.76, "#E9B873"], [0.88, "#D9984E"], [0.95, "#C2803E"], [1, "#9A5E28"]]} />

      {/* pieces */}
      <R id={`${u}-yolk`} cx="44%" cy="40%" stops={[[0, "#FFC24A"], [0.45, "#F5901A"], [0.85, "#DD680C"], [1, "#B44D06"]]} />
      <R id={`${u}-yolk-firm`} cx="44%" cy="40%" stops={[[0, "#FBDB6A"], [0.7, "#F2C443"], [1, "#D9A22A"]]} />
      <R id={`${u}-white`} stops={[[0, "#FFFDF7"], [0.72, "#F6EBD6"], [1, "#C99E70"]]} />
      <R id={`${u}-white-plain`} stops={[[0, "#FFFFFF"], [0.8, "#F8F4EC"], [1, "#E2D9C8"]]} />
      <R id={`${u}-dodo`} stops={[[0, "#FAC955"], [0.6, "#EF9F30"], [0.86, "#D06C1C"], [1, "#8E3A0E"]]} />
      <R id={`${u}-glazed`} cx="38%" cy="34%" stops={[[0, "#E07535"], [0.45, "#AE4019"], [1, "#5C1C08"]]} />
      <R id={`${u}-turkey`} cx="38%" cy="34%" stops={[[0, "#D9854A"], [0.5, "#A65428"], [1, "#5E260C"]]} />
      <R id={`${u}-chashu`} stops={[[0, "#F4CDB4"], [0.5, "#DC946E"], [0.84, "#A9552F"], [1, "#5B2210"]]} />
      <R id={`${u}-beef`} cx="40%" cy="38%" stops={[[0, "#9A5634"], [0.6, "#6E3418"], [1, "#3E1A0A"]]} />
      <R id={`${u}-suya`} cx="40%" cy="38%" stops={[[0, "#A8492A"], [0.6, "#7A2C14"], [1, "#4A170A"]]} />
      <R id={`${u}-suya-chicken`} cx="40%" cy="38%" stops={[[0, "#D98A4A"], [0.6, "#A85A26"], [1, "#6A3010"]]} />
      <R id={`${u}-suya-ram`} cx="40%" cy="38%" stops={[[0, "#86341C"], [0.6, "#5E1E0E"], [1, "#360E06"]]} />
      <R id={`${u}-tomato`} stops={[[0, "#F0735A"], [0.7, "#DB4128"], [1, "#B22614"]]} />
      <R id={`${u}-mozz`} cx="44%" cy="40%" stops={[[0, "#FFFFFF"], [0.6, "#FBF5E6"], [1, "#E6D3AE"]]} />
      <R id={`${u}-potato`} cx="40%" cy="36%" stops={[[0, "#F7D27A"], [0.55, "#E2A548"], [1, "#9A5A1E"]]} />
      <R id={`${u}-swallow-pounded-yam`} cx="40%" cy="36%" stops={[[0, "#FFFFFF"], [0.6, "#F7F3EA"], [1, "#D6CDBB"]]} />
      <R id={`${u}-swallow-eba`} cx="40%" cy="36%" stops={[[0, "#FBE7A4"], [0.6, "#EFD07A"], [1, "#C9A24A"]]} />
      <R id={`${u}-swallow-amala`} cx="40%" cy="36%" stops={[[0, "#9C8B7C"], [0.6, "#7A685A"], [1, "#4E3F34"]]} />
      <R id={`${u}-swallow-semo`} cx="40%" cy="36%" stops={[[0, "#FFFCF2"], [0.6, "#F3EAD3"], [1, "#CDBE9C"]]} />
      <R id={`${u}-swallow-fufu`} cx="40%" cy="36%" stops={[[0, "#FFFFFB"], [0.6, "#F1EEE4"], [1, "#CCC5B4"]]} />
      <R id={`${u}-moimoi`} cx="40%" cy="36%" stops={[[0, "#F2A87A"], [0.6, "#DE8150"], [1, "#B0532A"]]} />
      <L id={`${u}-leaf`} x2="0" y2="1" stops={[[0, "#5E9E44"], [1, "#2F6A2A"]]} />
      <L id={`${u}-banana`} x2="1" y2="1" stops={[[0, "#5C9A3E"], [0.5, "#4A8A34"], [1, "#2E6224"]]} />
      <L id={`${u}-basil`} x2="0" y2="1" stops={[[0, "#58A746"], [1, "#2A6A28"]]} />
      <L id={`${u}-nori`} x2="1" y2="1" stops={[[0, "#26332A"], [1, "#121A14"]]} />
      <L id={`${u}-stick`} stops={[[0, "#D8B27C"], [1, "#B08450"]]} />
      <L id={`${u}-paper`} x2="1" y2="1" stops={[[0, "#F2ECDD"], [1, "#E1D7C2"]]} />
    </defs>
  );
}
