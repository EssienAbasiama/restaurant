import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { signatureBySlug, signatures } from "@/lib/menu";
import { money } from "@/lib/format";
import { DishBuilder } from "@/components/menu/DishBuilder";
import { Footer } from "@/components/shell/Footer";

export function generateStaticParams() {
  return signatures.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = signatureBySlug(slug);
  if (!s) return {};
  return {
    title: s.name,
    description: `${s.tagline} From ${money(s.price)}. Build it your way at Àdùn.`,
  };
}

function DishSkeleton() {
  return (
    <div className="mx-auto grid min-h-svh max-w-[1480px] gap-10 px-5 pt-28 sm:px-10 md:grid-cols-[1.05fr_1fr] md:pt-32" aria-busy="true">
      <div className="mx-auto aspect-square w-[min(86vw,560px)] animate-pulse rounded-full bg-paper-3" />
      <div className="space-y-4 pt-10">
        <div className="h-4 w-40 animate-pulse rounded-full bg-paper-3" />
        <div className="h-20 w-3/4 animate-pulse rounded-3xl bg-paper-3" />
        <div className="h-24 w-full animate-pulse rounded-3xl bg-paper-2" />
      </div>
    </div>
  );
}

async function Dish({ params }: { params: PageProps<"/menu/[slug]">["params"] }) {
  const { slug } = await params;
  if (!signatureBySlug(slug)) notFound();
  return <DishBuilder key={slug} slug={slug} />;
}

export default function DishPage({ params }: PageProps<"/menu/[slug]">) {
  return (
    <main>
      <Suspense fallback={<DishSkeleton />}>
        <Dish params={params} />
      </Suspense>
      <Footer />
    </main>
  );
}
