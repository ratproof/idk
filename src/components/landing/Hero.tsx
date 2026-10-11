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
        <div className="blob left-[10%] top-[15%] h-96 w-96 bg-violet-600" />
        <div className="blob right-[8%] top-[30%] h-80 w-80 bg-fuchsia-600" style={{ animationDelay: "-6s" }} />
        <div className="blob bottom-[5%] left-[40%] h-72 w-72 bg-indigo-700" style={{ animationDelay: "-12s" }} />
        <div className="grain" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {data && (
          <Link to="/commands" className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm text-zinc-300 hover:text-white">
            {totalCount(data)}+ commands <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight sm:text-7xl">
          The all-in-one bot for your <span className="text-grad">community</span>
        </motion.h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          Moderation, voice channels, giveaways and music integrations. One bot, set up in minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={INVITE_URL} className="bg-grad rounded-xl px-6 py-3 font-medium">Invite to Discord</a>
          <Link to="/commands" className="glass rounded-xl px-6 py-3 font-medium">View commands</Link>
        </div>
        <div className="float glass mx-auto mt-14 max-w-md space-y-4 rounded-2xl p-5">
          <div className="flex gap-3 text-left">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-700" aria-hidden />
            <div><div className="text-sm font-medium">you</div><code className="text-sm text-zinc-300">;nowplaying</code></div>
          </div>
          <BotMsg title="Now playing">
            <div className="flex gap-3"><div className="h-14 w-14 rounded bg-gradient-to-br from-violet-500 to-pink-500" aria-hidden />
              <div><div className="text-white">Midnight City</div><div className="text-zinc-400">M83 · Hurry Up, We're Dreaming</div></div></div>
          </BotMsg>
        </div>
      </div>
    </section>
  );
}
