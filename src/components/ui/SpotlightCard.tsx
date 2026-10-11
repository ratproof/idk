import type { MouseEvent, ReactNode } from "react";
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={move} className={`card group relative h-full overflow-hidden rounded-3xl ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(340px circle at var(--x) var(--y), color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 60%)" }} />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}
