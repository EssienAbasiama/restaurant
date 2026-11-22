import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const photo = async (name: string) =>
  `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "src/assets/food", name))).toString("base64")}`;

/** Try to use the real display face; fall back to the default font offline. */
async function fraunces() {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,600&display=swap")).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [a, b, c, d, font] = await Promise.all([photo("chicken-jollof.jpg"), photo("tonkotsu.jpg"), photo("egusi.jpg"), photo("sushi-boat.jpg"), fraunces()]);
  const display = font ? { fontFamily: "Fraunces" } : {};
  const tile = (src: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} width={300} height={315} style={{ objectFit: "cover", width: 300, height: 315 }} alt="" />
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1D1410", color: "#F5EEE3" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600, padding: "56px 56px 48px" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#E2621B", textTransform: "uppercase", fontWeight: 700 }}>
            Lagos-born · World-fed
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 170, lineHeight: 0.9, letterSpacing: -6, ...display }}>{site.name}</div>
            <div style={{ fontSize: 34, marginTop: 22, lineHeight: 1.2, color: "#E9DFD0", ...display }}>
              Party jollof, tonkotsu, suya & a sushi belt — on one revolving table.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Menu", "The Belt", "Reserve", "Order"].map((t) => (
              <div key={t} style={{ display: "flex", padding: "10px 20px", borderRadius: 999, border: "2px solid #4A3B32", fontSize: 22 }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 600, height: 630 }}>
          {tile(a)}
          {tile(b)}
          {tile(c)}
          {tile(d)}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Fraunces", data: font, weight: 600, style: "normal" }] : undefined },
  );
}
