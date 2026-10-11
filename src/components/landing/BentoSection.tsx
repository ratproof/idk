import { Link } from "react-router-dom";
import { useCommands } from "@/hooks/useCommands";
import { Shot } from "./Shot";

export interface BentoCard { title: string; desc: string; shot: string; cls: string }
export interface BentoProps { title: string; subtitle: string; group: string; grid: string; cards: BentoCard[] }

export function BentoSection({ title, subtitle, group, grid, cards }: BentoProps) {
  const { data } = useCommands();
  const g = data?.find((x) => x.slug === group);
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="text-center">
        <h2>{title}</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-muted">{subtitle}</p>
      </div>
      <div className={`mt-12 grid gap-4 ${grid}`}>
        {cards.map((c) => (
          <article key={c.title} className={`flex min-h-[22rem] flex-col overflow-hidden rounded-[24px] border border-line bg-surface-1 ${c.cls}`}>
            <div className="p-7 pb-5">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1.5 max-w-[44ch] text-[15px] text-muted">{c.desc}</p>
            </div>
            <div className="mt-auto px-7"><Shot name={c.shot} alt={`${c.title} preview`} /></div>
          </article>
        ))}
      </div>
      {g && <p className="mt-6 text-center"><Link to={`/commands#${g.slug}`} className="link text-sm">{g.count}+ more commands</Link></p>}
    </section>
  );
}
