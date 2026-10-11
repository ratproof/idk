import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BOT_AVATAR, BOT_NAME, INVITE_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { totalCount } from "@/lib/api";

export default function Hero() {
  const { data } = useCommands();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-12">
      <div aria-hidden className="absolute inset-0">
        <div className="blob left-[10%] top-[15%] h-96 w-96 bg-violet-600" />
        <div className="blob right-[8%] top-[30%] h-80 w-80 bg-fuchsia-600" style={{ animationDelay: "-6s" }} />
        <div className="blob bottom-[5%] left-[40%] h-72 w-72 bg-indigo-700" style={{ animationDelay: "-12s" }} />
        <div className="grain" />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 text-center lg:grid-cols-[1.15fr_0.85fr] lg:text-left">
        <div>
          {data && (
            <Link to="/commands" className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm text-zinc-300 hover:text-white">
              {totalCount(data)}+ commands <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl font-bold tracking-tight sm:text-7xl">
            The all-in-one bot for your <span className="text-grad">community</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 lg:mx-0">
            Moderation, voice channels, giveaways and music integrations. One bot, set up in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href={INVITE_URL} className="bg-grad rounded-xl px-6 py-3 font-medium">Invite to Discord</a>
            <Link to="/commands" className="glass rounded-xl px-6 py-3 font-medium">View commands</Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex items-center justify-center lg:justify-end"
        >
          <div className="relative rounded-[32px] border border-white/10 bg-[#111115]/80 p-3 shadow-2xl backdrop-blur-xl">
            <div className="relative h-64 w-64 overflow-hidden rounded-[24px] border border-white/10 sm:h-80 sm:w-80">
              <img src={BOT_AVATAR} alt={BOT_NAME} className="h-full w-full object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

