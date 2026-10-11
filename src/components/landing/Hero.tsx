import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { INVITE_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { totalCount } from "@/lib/api";
import { BotMsg } from "@/components/ui/DiscordBits";

export default function Hero() {
  const { data } = useCommands();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div aria-hidden className="absolute inset-0">
        <div className="blob -left-24 top-[10%] h-[28rem] w-[28rem] bg-accent" />
        <div className="blob bottom-[-10%] right-[5%] h-96 w-96 bg-accent-deep" style={{ animationDelay: "-9s" }} />
        <div className="grain" />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {data && (
            <Link to="/commands" className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm text-zinc-300 hover:text-white">
              {totalCount(data)}+ commands <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            The all-in-one bot for your <span className="text-grad">community</span>
          </motion.h1>
          <p className="mt-6 max-w-md text-lg text-zinc-400">Moderation, voice channels, giveaways and music integrations, set up in minutes.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={INVITE_URL} className="bg-grad rounded-lg px-6 py-3">Invite to Discord</a>
            <Link to="/commands" className="glass rounded-lg px-6 py-3 font-medium hover:border-white/20">View commands</Link>
          </div>
        </div>
        <div className="float glass space-y-4 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-700" aria-hidden />
            <div><div className="text-sm font-medium">you</div><code className="text-sm text-zinc-300">;nowplaying</code></div>
          </div>
          <BotMsg title="Now playing">
            <div className="flex gap-3"><div className="h-14 w-14 rounded bg-accent-deep" aria-hidden />
              <div><div className="text-white">Midnight City</div><div className="text-zinc-400">M83 · Hurry Up, We're Dreaming</div></div></div>
          </BotMsg>
        </div>
      </div>
    </section>
  );
}
