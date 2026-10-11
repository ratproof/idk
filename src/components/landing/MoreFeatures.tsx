import { Link } from "react-router-dom";
import { Info, Languages, Mic, Palette, Smile, Sparkles, Terminal, UserCircle, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { G, SectionHead } from "@/components/ui/SectionHead";

const feats: [string, string, LucideIcon][] = [
  ["Text to Speech", "Read messages aloud in a voice channel with 6 voices.", Mic],
  ["Translation", "Translate any message into another language.", Languages],
  ["Avatar and Banner", "Look up any member's avatar and banner.", UserCircle],
  ["Server Info", "See details about your server and its members.", Info],
  ["Custom Prefix", "Pick the prefix that fits your server.", Terminal],
  ["Custom Bot Profile", "Change the bot's avatar, banner and bio.", Palette],
  ["Fun Commands", "Small games and extras for chat.", Smile],
];
// decorative arc above the heading: [icon, size, offset]
const arc: [LucideIcon, number, number][] = [[Terminal, 44, 70], [Languages, 56, 36], [Palette, 64, 10], [Mic, 80, 0], [Smile, 64, 10], [UserCircle, 56, 36], [Info, 44, 70]];

export default function MoreFeatures() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div aria-hidden className="mb-8 hidden items-start justify-center gap-5 sm:flex">
        {arc.map(([Icon, s, y], i) => (
          <span key={i} className="grid place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgb(255_90_54/.2),#0e0e11_75%)]" style={{ width: s, height: s, marginTop: y }}>
            <Icon className="text-accent-soft" style={{ width: s * 0.42, height: s * 0.42 }} />
          </span>
        ))}
      </div>
      <SectionHead icon={Sparkles} sub="The smaller things you will reach for every day.">Countless <G>More</G> Features</SectionHead>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {feats.map(([t, d, Icon], i) => (
          <Reveal key={t} delay={(i % 4) * 0.06}>
            <SpotlightCard className="p-6">
              <span className="icon-tile"><Icon className="h-6 w-6 text-accent-soft" aria-hidden /></span>
              <h3 className="mt-6 text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{d}</p>
            </SpotlightCard>
          </Reveal>
        ))}
        <Reveal delay={0.18}>
          <Link to="/commands" className="card flex h-full min-h-[11rem] items-center justify-center rounded-3xl p-6 text-lg font-semibold text-accent-soft">All commands</Link>
        </Reveal>
      </div>
    </section>
  );
}
