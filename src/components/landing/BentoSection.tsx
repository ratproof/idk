import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommands } from "@/hooks/useCommands";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { Shot } from "./Shot";

export interface BentoCard { title: string; desc: string; shot: string; cls: string }
export interface BentoProps { icon: LucideIcon; title: ReactNode; subtitle: string; group: string; grid: string; cards: BentoCard[] }

export function BentoSection({ icon, title, subtitle, group, grid, cards }: BentoProps) {
  const { data } = useCommands();
  const g = data?.find((x) => x.slug === group);
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <SectionHead icon={icon} sub={subtitle}>{title}</SectionHead>
      <div className={`mt-14 grid gap-4 ${grid}`}>
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.07} className={c.cls}>
            <SpotlightCard className="min-h-[22rem]">
              <div className="p-7 pb-5">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-1.5 max-w-[44ch] text-[15px] text-muted">{c.desc}</p>
              </div>
              <div className="mt-auto px-7"><Shot name={c.shot} alt={`${c.title} preview`} /></div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      {g && <p className="mt-6 text-center"><Link to={`/commands#${g.slug}`} className="link text-sm">{g.count}+ more commands</Link></p>}
    </section>
  );
}
