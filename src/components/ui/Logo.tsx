import { site } from "@/lib/site";

export function LogoMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="22" r="15" fill="currentColor" />
      <circle cx="20" cy="22" r="10.5" fill="none" stroke="var(--color-paper)" strokeWidth="1.4" strokeDasharray="2 3" />
      <circle cx="20" cy="22" r="5" fill="var(--color-palm)" />
      <path d="M13.5 3.5 L21 9.5" stroke="var(--color-palm)" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${light ? "text-paper" : "text-ink"} ${className ?? ""}`}>
      <LogoMark />
      <span className="display text-[1.7rem] leading-none tracking-tight">{site.name}</span>
    </span>
  );
}
