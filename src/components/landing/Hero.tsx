import { Link } from "react-router-dom";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { useStatus } from "@/hooks/useStatus";
import { totalCount } from "@/lib/api";
import { G } from "@/components/ui/SectionHead";

export default function Hero() {
  const { data } = useCommands();
  const status = useStatus();
  const avatar = status.data?.avatar_url?.replace("size=1024", "size=256");
  const showAvatar = status.isLoading || !!avatar; // reserve the space while loading, drop it on failure
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-4 pt-16">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:gap-12 lg:text-left">
        {showAvatar && (
          avatar
            ? <img src={avatar} alt={`${BOT_NAME} avatar`} width={160} height={160} className="fade-in h-28 w-28 shrink-0 rounded-full ring-1 ring-white/15 shadow-[0_0_70px_rgb(79_140_255/0.35)] lg:h-40 lg:w-40" />
            : <div className="h-28 w-28 shrink-0 rounded-full bg-surface-2 lg:h-40 lg:w-40" aria-hidden />
        )}
        <div className="max-w-3xl">
          <h1 className="fade-in">Moderation, <G>voice channels</G> and <G>giveaways</G> for your server.</h1>
          <p className="fade-in mt-6 max-w-[52ch] text-lg text-muted lg:max-w-[48ch]" style={{ animationDelay: ".1s" }}>
            Keep your community safe with filters that do what you expect. Let members run their own voice channels and host giveaways with real requirements.
          </p>
          <div className="fade-in mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ animationDelay: ".2s" }}>
            <a href={INVITE_URL} className="btn btn-accent">Invite to Discord</a>
            <a href={SUPPORT_URL} className="btn btn-outline">Support server</a>
          </div>
          {data && <p className="fade-in mt-5 text-sm text-muted" style={{ animationDelay: ".3s" }}><Link to="/commands" className="hover:text-fg">{totalCount(data)} commands</Link></p>}
        </div>
      </div>
    </section>
  );
}
