import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useCommands } from "@/hooks/useCommands";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BotMsg, Btn, Code } from "@/components/ui/DiscordBits";

export interface BentoCard { title: string; desc: string; visual: ReactNode }
export interface BentoProps { eyebrow: string; title: string; subtitle: string; group: string; cards: BentoCard[]; flip?: boolean }

export function BentoSection({ eyebrow, title, subtitle, group, cards, flip }: BentoProps) {
  const { data } = useCommands();
  const g = data?.find((x) => x.slug === group);
  const spans = flip ? ["md:col-span-1", "md:col-span-2", "md:col-span-3"] : ["md:col-span-2", "md:col-span-1", "md:col-span-3"];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-widest text-violet-400">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl text-zinc-400">{subtitle}</p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08} className={spans[i]}>
            <SpotlightCard className="h-full p-6">
              <div className="mb-5 min-h-28">{c.visual}</div>
              <h3 className="text-lg font-medium">{c.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{c.desc}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      {g && <Link to={`/commands#${g.slug}`} className="mt-6 inline-block text-sm text-violet-300 hover:text-white">{g.count}+ more commands →</Link>}
    </section>
  );
}

function Countdown() {
  const [s, setS] = useState(2 * 3600 + 14 * 60 + 9);
  useEffect(() => { const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000); return () => clearInterval(t); }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return <span className="font-mono text-white">{p(Math.floor(s / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</span>;
}

const pills = (items: string[]) => <div className="flex flex-wrap gap-2">{items.map((i) => <Btn key={i}>{i}</Btn>)}</div>;

export const moderation: BentoProps = {
  eyebrow: "Moderation & security", title: "Keep your server clean and safe", group: "moderation",
  subtitle: "Fast, precise tools for the moments that matter.",
  cards: [
    { title: "Moderation", desc: "Ban, softban, timeout, purge with filters (bots, links, embeds), nuke, lock and hide.",
      visual: <div className="space-y-3"><Code>;purge bots 50</Code><BotMsg>Purged <b>23</b> bot messages.</BotMsg></div> },
    { title: "Honeypot", desc: "A trap channel that catches spam bots and raiders.",
      visual: <BotMsg title="Honeypot triggered">Banned <b>spambot#0001</b> for posting in #do-not-post.</BotMsg> },
    { title: "Roles and automation", desc: "Autorole, reaction roles and join pings.",
      visual: pills(["🎮 Gamer", "🎨 Artist", "🎵 Music", "Autorole: Member"]) },
  ],
};
export const voicemaster: BentoProps = {
  eyebrow: "Voicemaster", title: "Temporary voice channels, fully controlled", group: "voicemaster", flip: true,
  subtitle: "Members create and manage their own channels with one panel.",
  cards: [
    { title: "Control panel", desc: "Lock, unlock, limit, rename, claim, permit and reject from buttons.",
      visual: pills(["Lock", "Unlock", "Limit", "Rename", "Claim", "Permit", "Reject"]) },
    { title: "Easy setup", desc: "One command creates the category, join channel and panel.",
      visual: <div className="space-y-3"><Code>;voicemaster setup</Code><BotMsg>Voicemaster is ready ✅</BotMsg></div> },
    { title: "Your channel, your rules", desc: "Permit or reject specific members from your channel.",
      visual: <div className="flex flex-wrap gap-2"><Code>;vm permit @friend</Code><Code>;vm reject @troll</Code></div> },
  ],
};
export const giveaways: BentoProps = {
  eyebrow: "Giveaways", title: "Giveaways with real requirements", group: "giveaways",
  subtitle: "Reward your active members, not drive-by entries.",
  cards: [
    { title: "Requirements", desc: "Role, message count, voice minutes, or must be in a VC.",
      visual: pills(["Role", "500 messages", "60 voice min", "In VC"]) },
    { title: "Full control", desc: "Reroll, edit or end any giveaway.",
      visual: <div className="flex flex-wrap gap-2"><Code>;gw reroll</Code><Code>;gw edit</Code><Code>;gw end</Code></div> },
    { title: "Live giveaways", desc: "Entries and countdown update in real time.",
      visual: <BotMsg title="🎉 Nitro giveaway">Ends in <Countdown /> · Entries: <b>128</b><div className="mt-2"><Btn>🎉 Enter</Btn></div></BotMsg> },
  ],
};
