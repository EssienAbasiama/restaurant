import type { Opts } from "@/lib/menu";

export type Pt = [number, number];

/** Deterministic PRNG so server and client draw identical food. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const r1 = (n: number) => Math.round(n * 10) / 10;

export const tf = (x: number, y: number, rot = 0, s = 1) =>
  `translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${r1(rot)})` : ""}${s !== 1 ? ` scale(${r1(s * 100) / 100})` : ""}`;

/** Smooth closed Catmull-Rom curve through points. */
export function closedPath(pts: Pt[]) {
  const n = pts.length;
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + "Z";
}

/** Smooth open curve through points. */
export function openPath(pts: Pt[]) {
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

/** Organic blob (food never comes out perfectly round). */
export function blob(
  cx: number,
  cy: number,
  rx: number,
  ry = rx,
  { n = 9, j = 0.12, seed = 1, rot = 0 }: { n?: number; j?: number; seed?: number; rot?: number } = {},
) {
  const R = rng(seed);
  const cr = Math.cos((rot * Math.PI) / 180);
  const sr = Math.sin((rot * Math.PI) / 180);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (R() * 2 - 1) * j;
    const x = Math.cos(a) * rx * k;
    const y = Math.sin(a) * ry * k;
    pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  return closedPath(pts);
}

export type Scat = { x: number; y: number; rot: number; s: number; t: number; i: number };

/** Uniform scatter inside a disc (optionally an annulus). */
export function scatter(count: number, cx: number, cy: number, r: number, seed: number, minR = 0, sy = 1): Scat[] {
  const R = rng(seed);
  const m = (minR / r) ** 2;
  return Array.from({ length: count }, (_, i) => {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(m + R() * (1 - m)) * r;
    return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * sy, rot: R() * 360, s: R(), t: R(), i };
  });
}

/** Points evenly around a ring. */
export function around(count: number, cx: number, cy: number, r: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i / count) * 360 + offset) * (Math.PI / 180);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, deg: (i / count) * 360 + offset, i };
  });
}

/** Wavy strand between two points. */
export function strand(x0: number, y0: number, x1: number, y1: number, amp: number, waves: number, phase: number, steps = 18) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const o = Math.sin(t * Math.PI * 2 * waves + phase) * amp;
    pts.push([x0 + dx * t + nx * o, y0 + dy * t + ny * o]);
  }
  return openPath(pts);
}

export const pick = (o: Opts | undefined, key: string, def: string) => {
  const v = o?.[key];
  return typeof v === "string" ? v : def;
};

export const has = (o: Opts | undefined, key: string, id: string) => {
  const v = o?.[key];
  return Array.isArray(v) ? v.includes(id) : v === id;
};

export const heatOf = (o: Opts | undefined) => Number(pick(o, "spice", "1"));
