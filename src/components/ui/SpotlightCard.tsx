import type { MouseEvent, ReactNode } from "react";
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={move} className={`glass group relative overflow-hidden rounded-xl ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--x) var(--y), rgba(255,90,54,.14), transparent 60%)" }} />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
