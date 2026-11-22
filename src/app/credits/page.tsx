import type { Metadata } from "next";
import Image from "next/image";
import { credits, img } from "@/lib/images";
import { site } from "@/lib/site";
import { Footer } from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "Photo credits",
  description: `The photographers whose work makes ${site.name} look delicious.`,
};

export default function CreditsPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1480px] px-5 pb-24 pt-32 sm:px-10 sm:pt-40">
        <p className="eyebrow text-palm">Thank you</p>
        <h1 className="display mt-3 text-[clamp(3.4rem,8vw,7rem)]">Photo credits</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          Every photograph on this site comes from photographers on{" "}
          <a className="link-u font-semibold text-ink" href="https://unsplash.com/license" target="_blank" rel="noreferrer">
            Unsplash
          </a>{" "}
          and is used under the Unsplash License. The plates on the revolving table, the belt and the dish builder are original SVG illustrations drawn in code.
        </p>
        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {credits.map((c) => (
            <li key={c.key}>
              <a href={`https://images.unsplash.com/photo-${c.id}`} target="_blank" rel="noreferrer" className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-3">
                  <Image src={img[c.key]} alt="" fill sizes="(min-width: 1024px) 18vw, 45vw" placeholder="blur" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-2 text-sm font-bold">{c.by}</p>
                <p className="text-xs text-ink-3">View original on Unsplash</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
