const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const money = (n: number) => naira.format(Math.round(n)).replace("NGN", "₦").replace(/\s/g, "");

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
