import type { MetadataRoute } from "next";
import { signatures } from "@/lib/menu";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/menu", "/reserve", "/checkout", "/order", "/credits"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...signatures.map((s) => ({ url: `${site.url}/menu/${s.slug}`, priority: 0.8 })),
  ];
}
