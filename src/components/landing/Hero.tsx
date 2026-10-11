import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BOT_AVATAR, BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";
import { useCommands } from "@/hooks/useCommands";
import { totalCount } from "@/lib/api";
import { G } from "@/components/ui/SectionHead";

export default function Hero() {
  const { data } = useCommands();
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-4 pt-24 pb-12">
      <div className="relative mx-auto grid w-full max-w-[1160px] items-center gap-12 text-center lg:grid-cols-[1.15fr_0.85fr] lg:text-left">
        <div>
          <h1 className="fade-in">
            Moderation, <G>voice channels</G> and <G>giveaways</G> for your server.
          </h1>
          <p
            className="fade-in mx-auto mt-6 max-w-[52ch] text-lg text-muted lg:mx-0"
            style={{ animationDelay: ".1s" }}
          >
            Keep your community safe with filters that do what you expect. Let members run their own voice channels and host giveaways with real requirements.
          </p>
          <div
            className="fade-in mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            style={{ animationDelay: ".2s" }}
          >
            <a href={INVITE_URL} className="btn btn-accent">
              Invite to Discord
            </a>
            <a href={SUPPORT_URL} className="btn btn-outline">
              Support server
            </a>
          </div>
          {data && (
            <p
              className="fade-in mt-5 text-sm text-muted"
              style={{ animationDelay: ".3s" }}
            >
              <Link to="/commands" className="hover:text-fg">
                {totalCount(data)} commands
              </Link>
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex items-center justify-center lg:justify-end"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative rounded-[32px] border border-white/10 bg-[#111115]/80 p-3 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="relative h-64 w-64 overflow-hidden rounded-[24px] border border-white/10 sm:h-80 sm:w-80">
              <img
                src={BOT_AVATAR}
                alt={BOT_NAME}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b0b0e]/85 px-3.5 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-fg">
                    {BOT_NAME}
                  </span>
                </div>
                <span className="rounded-md bg-[#5865f2] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  BOT
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

