import { Music, Video, Camera, MessageCircle, Ghost } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";

const items = [
  { name: "Last.fm", desc: "Now playing and profiles", Icon: Music },
  { name: "TikTok", desc: "User lookup, fyp, repost", Icon: Video },
  { name: "Instagram", desc: "Profile and post lookup", Icon: Camera },
  { name: "Reddit", desc: "Subreddits and posts", Icon: MessageCircle },
  { name: "Snapchat", desc: "Profile lookup", Icon: Ghost },
];
export default function IntegrationsMarquee() {
  return (
    <section className="py-20">
      <h2 className="mb-10 text-center text-3xl font-semibold">Integrations with your favorite platforms</h2>
      <Marquee>
        {[...items, ...items].map(({ name, desc, Icon }, i) => (
          <div key={i} className="glass flex w-72 shrink-0 items-center gap-4 rounded-xl p-4">
            <Icon className="h-7 w-7 text-violet-400" aria-hidden />
            <div><div className="font-medium">{name}</div><div className="text-sm text-zinc-400">{desc}</div></div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
