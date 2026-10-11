import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export const G = ({ children }: { children: ReactNode }) => <span className="text-grad">{children}</span>;
export function SectionHead({ icon: Icon, children, sub }: { icon: LucideIcon; children: ReactNode; sub?: string }) {
  return (
    <Reveal className="px-4 text-center">
      <span className="icon-circle mx-auto"><Icon className="h-7 w-7 text-accent-soft" aria-hidden /></span>
      <h2 className="mx-auto mt-6 max-w-3xl">{children}</h2>
      {sub && <p className="mx-auto mt-3 max-w-[60ch] text-muted">{sub}</p>}
    </Reveal>
  );
}
