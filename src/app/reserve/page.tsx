import type { Metadata } from "next";
import { Reserve } from "@/components/reserve/Reserve";

export const metadata: Metadata = {
  title: "Reserve a table",
  description: "Pick your party size, day, time and exact seat — counter at the sushi belt, main room, garden terrace, chef's table or the Owambe Room.",
};

export default function ReservePage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(120%_80%_at_50%_0%,#F7DCC6_0%,#F5EEE3_60%)]">
      <Reserve />
    </main>
  );
}
