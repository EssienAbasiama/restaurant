import { DishArt } from "@/components/art/DishArt";
import { BeltPlate } from "@/components/art/BeltArt";
import { beltItems, signatures } from "@/lib/menu";

export default function Lab() {
  return (
    <main className="p-6">
      <div className="grid grid-cols-4 gap-6">
        {signatures.map((s) => (
          <div key={s.slug} className="rounded-2xl p-3" style={{ background: s.theme.bg }}>
            <DishArt slug={s.slug} className="w-full" />
            <p className="text-sm font-bold">{s.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-8 gap-4 rounded-2xl bg-night p-4">
        {beltItems.map((b) => (
          <BeltPlate key={b.id} item={b} className="w-full" />
        ))}
      </div>
    </main>
  );
}
