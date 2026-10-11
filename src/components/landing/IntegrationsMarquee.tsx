import { Marquee } from "@/components/ui/Marquee";
import { InstagramIcon, LastfmIcon, RedditIcon, SnapchatIcon, TikTokIcon } from "@/components/ui/Icons";

const items = [
  { name: "Last.fm", desc: "Show what you are playing and view profiles.", Icon: LastfmIcon },
  { name: "TikTok", desc: "Look up users, browse the fyp and repost videos.", Icon: TikTokIcon },
  { name: "Instagram", desc: "Look up profiles and posts.", Icon: InstagramIcon },
  { name: "Reddit", desc: "Pull up subreddits and posts.", Icon: RedditIcon },
  { name: "Snapchat", desc: "Look up Snapchat profiles.", Icon: SnapchatIcon },
];
export default function IntegrationsMarquee() {
  return (
    <section className="py-[72px] md:py-[120px]">
      <div className="px-4 text-center">
        <h2>Integrations with Your Favorite Platforms</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-muted">Connect the services your members already use.</p>
      </div>
      <div className="mt-12">
        <Marquee>
          {[...items, ...items].map(({ name, desc, Icon }, i) => (
            <div key={i} className="flex w-80 shrink-0 items-start gap-4 rounded-2xl border border-line bg-surface-1 p-5">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-muted" />
              <div><div className="font-medium">{name}</div><p className="mt-1 text-[15px] text-muted">{desc}</p></div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
