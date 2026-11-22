import type { Metadata } from "next";
import { MenuView } from "@/components/menu/MenuView";
import { Footer } from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "The Menu",
  description: "Party jollof, egusi, suya and afang beside tonkotsu, carbonara, margherita and a sushi belt. Build any signature plate your way.",
};

export default function MenuPage() {
  return (
    <main>
      <MenuView />
      <Footer />
    </main>
  );
}
