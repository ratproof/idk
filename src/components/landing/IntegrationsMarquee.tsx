import { Marquee } from "@/components/ui/Marquee";
import { InstagramIcon, LastfmIcon, RedditIcon, SnapchatIcon, TikTokIcon } from "@/components/ui/Icons";

const items = [
  { name: "Last.fm", desc: "Now playing, profiles", Icon: LastfmIcon },
  { name: "TikTok", desc: "User lookup, fyp, repost", Icon: TikTokIcon },
  { name: "Instagram", desc: "Profile and post lookup", Icon: InstagramIcon },
  { name: "Reddit", desc: "Subreddits and posts", Icon: RedditIcon },
  { name: "Snapchat", desc: "Profile lookup", Icon: SnapchatIcon },
];
export default function IntegrationsMarquee() {
  return (
    <section className="py-20">
      <div className="mx-auto mb-10 max-w-6xl px-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Integrations</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Integrations with your favorite platforms</h2>
      </div>
      <Marquee>
        {[...items, ...items].map(({ name, desc, Icon }, i) => (
          <div key={i} className="glass flex w-72 shrink-0 items-center gap-4 rounded-lg p-4">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-accent-soft"><Icon className="h-5 w-5" /></span>
            <div><div className="font-medium">{name}</div><div className="text-sm text-zinc-500">{desc}</div></div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
