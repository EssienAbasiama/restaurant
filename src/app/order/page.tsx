import type { Metadata } from "next";
import { OrderTracker } from "@/components/checkout/OrderTracker";
import { Footer } from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "Your order",
  description: "Watch your order come together, from the pot to your door.",
};

export default function OrderPage() {
  return (
    <main>
      <OrderTracker />
      <Footer />
    </main>
  );
}
