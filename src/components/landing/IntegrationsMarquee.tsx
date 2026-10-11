import { Plug } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { G, SectionHead } from "@/components/ui/SectionHead";
import { InstagramIcon, LastfmIcon, RedditIcon, SnapchatIcon, TikTokIcon } from "@/components/ui/Icons";

// *word* marks the highlighted words, drawn in the platform color
const items = [
  { name: "Last.fm", tint: "#e0261c", desc: "Show your *Now Playing* and view *Profiles*.", Icon: LastfmIcon },
  { name: "TikTok", tint: "#25f4ee", desc: "Look up *Users*, browse the *Fyp* and *Repost* videos.", Icon: TikTokIcon },
  { name: "Instagram", tint: "#e1306c", desc: "Look up *Profiles* and view *Posts*.", Icon: InstagramIcon },
  { name: "Reddit", tint: "#ff4500", desc: "Pull up *Subreddits* and *Posts* in chat.", Icon: RedditIcon },
  { name: "Snapchat", tint: "#fffc00", desc: "Look up Snapchat *Profiles*.", Icon: SnapchatIcon },
];
const hl = (t: string, c: string) => t.split("*").map((s, i) => (i % 2 ? <span key={i} style={{ color: c }}>{s}</span> : s));

export default function IntegrationsMarquee() {
  return (
    <section className="py-[72px] md:py-[120px]">
      <SectionHead icon={Plug} sub="Connect the services your members already use."><G>Integrations</G> with Your Favorite <G>Platforms</G></SectionHead>
      <div className="mt-14">
        <Marquee>
          {[...items, ...items].map(({ name, tint, desc, Icon }, i) => (
            <div key={i} className="w-96 shrink-0 rounded-3xl border p-6" style={{ background: `linear-gradient(135deg, ${tint}2b, transparent 60%), #0e0e11`, borderColor: `${tint}38` }}>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl border" style={{ borderColor: `${tint}66`, background: `${tint}14`, color: tint }}><Icon className="h-7 w-7" /></span>
                <span className="text-lg font-semibold">{name}</span>
              </div>
              <p className="mt-5 text-[15px] text-zinc-300">{hl(desc, tint)}</p>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
