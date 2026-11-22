import Image from "next/image";
import { DishArt } from "@/components/art/DishArt";
import { BeltPlate } from "@/components/art/BeltArt";
import { beltItems } from "@/lib/menu";
import type { Thumb as T } from "@/lib/store";

export function Thumb({ thumb, size = 64, className }: { thumb: T; size?: number; className?: string }) {
  if (thumb.kind === "art") return <DishArt slug={thumb.slug} opts={thumb.opts} className={className} style={{ width: size, height: size }} />;
  if (thumb.kind === "belt") {
    const item = beltItems.find((b) => b.id === thumb.item);
    return item ? <BeltPlate item={item} className={className} /> : null;
  }
  return (
    <Image
      src={thumb.src}
      alt=""
      width={size * 2}
      height={size * 2}
      className={`rounded-full object-cover ${className ?? ""}`}
      style={{ width: size, height: size }}
    />
  );
}
