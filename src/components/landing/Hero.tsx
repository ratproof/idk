import { Link } from "react-router-dom";
import { INVITE_URL, SUPPORT_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { totalCount } from "@/lib/api";

export default function Hero() {
  const { data } = useCommands();
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 pt-16 text-center">
      <div aria-hidden className="hero-glow" />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="fade-in">Moderation, voice channels and giveaways for your server.</h1>
        <p className="fade-in mx-auto mt-6 max-w-[52ch] text-lg text-muted" style={{ animationDelay: "0.1s" }}>
          Keep your community safe with filters that do what you expect. Let members run their own voice channels and host giveaways with real requirements.
        </p>
        <div className="fade-in mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.2s" }}>
          <a href={INVITE_URL} className="btn btn-accent">Invite to Discord</a>
          <a href={SUPPORT_URL} className="btn btn-outline">Support server</a>
        </div>
        {data && <p className="fade-in mt-5 text-sm text-muted" style={{ animationDelay: "0.3s" }}><Link to="/commands" className="hover:text-fg">{totalCount(data)} commands</Link></p>}
      </div>
    </section>
  );
}
