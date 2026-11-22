import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { BuildAPlate } from "@/components/home/BuildAPlate";
import { Belt } from "@/components/home/Belt";
import { Craft } from "@/components/home/Craft";
import { Gallery } from "@/components/home/Gallery";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import { Footer } from "@/components/shell/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Manifesto />
      <BuildAPlate />
      <Belt />
      <Craft />
      <Gallery />
      <Reviews />
      <Visit />
      <Footer />
    </main>
  );
}
