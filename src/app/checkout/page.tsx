import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Delivery across Lagos or pickup at the pass.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-svh bg-paper-2">
      <Checkout />
    </main>
  );
}
