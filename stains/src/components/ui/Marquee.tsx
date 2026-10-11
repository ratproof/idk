import type { ReactNode } from "react";
// items duplicated so translateX(-50%) loops seamlessly
export const Marquee = ({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) => (
  <div className="marquee-wrap overflow-hidden">
    <div className={`marquee ${reverse ? "rev" : ""}`}>{children}<span className="contents" aria-hidden>{children}</span></div>
  </div>
);
