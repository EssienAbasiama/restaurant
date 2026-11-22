import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { BuildAPlate } from "@/components/home/BuildAPlate";
import { Footer } from "@/components/shell/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Manifesto />
      <BuildAPlate />
      <div className="h-screen" />
      <Footer />
    </main>
  );
}
