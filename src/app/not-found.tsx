import { EmptyPlate } from "@/components/shell/CartDrawer";
import { TLink } from "@/components/shell/Transition";
import { ArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-paper px-5 text-center">
      <EmptyPlate className="w-56" />
      <p className="eyebrow mt-8 text-palm">404 · Plate not found</p>
      <h1 className="display mt-3 text-[clamp(3rem,9vw,7rem)]">Someone finished it.</h1>
      <p className="mt-3 max-w-md text-lg text-ink-2">This page has been scraped clean. The kitchen is still very much open though.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <TLink href="/menu" className="btn btn-primary">
          See the menu <ArrowRight size={18} />
        </TLink>
        <TLink href="/" className="btn btn-ghost">
          Back to the table
        </TLink>
      </div>
    </main>
  );
}
