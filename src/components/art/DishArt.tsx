import { useId } from "react";
import type { Opts } from "@/lib/menu";
import { Defs } from "./defs";
import { AfangArt, EgusiArt, JollofArt, SuyaArt, type DishProps } from "./dishes-naija";
import { AsadoArt, CarbonaraArt, PizzaArt, RamenArt } from "./dishes-world";

const renderers: Record<string, (p: DishProps) => React.ReactNode> = {
  "party-jollof": JollofArt,
  tonkotsu: RamenArt,
  egusi: EgusiArt,
  carbonara: CarbonaraArt,
  suya: SuyaArt,
  margherita: PizzaArt,
  afang: AfangArt,
  asado: AsadoArt,
};

export function DishArt({
  slug,
  opts,
  className,
  label,
  style,
}: {
  slug: string;
  opts?: Opts;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  const u = "d" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const Render = renderers[slug] ?? JollofArt;
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      overflow="visible"
    >
      <Defs u={u} />
      <Render u={u} o={opts} />
    </svg>
  );
}
