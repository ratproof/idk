import { Link } from "react-router-dom";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { useStatus } from "@/hooks/useStatus";
import { totalCount } from "@/lib/api";
import { G } from "@/components/ui/SectionHead";

export default function Hero() {
  const { data } = useCommands();
  const { data: status } = useStatus();
  const icon = status?.avatar_url?.replace(/size=\d+/, "size=256");
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-4 pt-16 text-center">
      <div className="relative mx-auto max-w-3xl">
        {icon && <img src={icon} alt={BOT_NAME} width={80} height={80} className="fade-in mx-auto mb-6 h-20 w-20 rounded-full" />}
        <h1 className="fade-in">Moderation, <G>voice channels</G> and <G>giveaways</G> for your server.</h1>
        <p className="fade-in mx-auto mt-6 max-w-[52ch] text-lg text-muted" style={{ animationDelay: ".1s" }}>
          Keep your community safe with filters that do what you expect. Let members run their own voice channels and host giveaways with real requirements.
        </p>
        <div className="fade-in mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".2s" }}>
          <a href={INVITE_URL} className="btn btn-accent">Invite to Discord</a>
          <a href={SUPPORT_URL} className="btn btn-outline">Support server</a>
        </div>
        {data && <p className="fade-in mt-5 text-sm text-muted" style={{ animationDelay: ".3s" }}><Link to="/commands" className="hover:text-fg">{totalCount(data)} commands</Link></p>}
      </div>
    </section>
  );
}
