import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { INVITE_URL } from "@/config";
import { useStatus } from "@/hooks/useStatus";
import { G } from "@/components/ui/SectionHead";

function useCountUp(target: number | undefined, duration = 1600) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (target == null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * eased);
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return target == null ? null : value;
}

function Squiggle({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <G>{children}</G>
      <svg
        aria-hidden
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="absolute -bottom-2 left-0 h-2.5 w-full text-accent"
        fill="none"
      >
        <path
          d="M2 7C20 1 35 11 55 6S90 2 110 7 150 11 175 5 195 4 198 6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export default function Hero() {
  const status = useStatus();
  const users = useCountUp(status.data?.users);
  const servers = useCountUp(status.data?.guilds);

  return (
    <section className="relative px-4 pb-16 pt-28 sm:pt-36">
      <div className="fade-in mx-auto max-w-5xl">
        <h1 className="max-w-3xl">
          Moderation, voice channels and <Squiggle>giveaways</Squiggle> for your server.
        </h1>

        <p className="mt-6 max-w-[48ch] text-lg text-muted">
          Filters that do what you expect, member-run voice channels, and giveaways with real requirements.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={INVITE_URL} className="btn btn-accent gap-2 rounded-full">
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
            </svg>
            Add to Discord
          </a>
          <Link to="/commands" className="btn btn-outline gap-2 rounded-full">
            Explore commands
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M8.6 5.6 10 4.2l7.8 7.8-7.8 7.8-1.4-1.4 6.4-6.4z" />
            </svg>
          </Link>
        </div>

        {users != null && servers != null && (
          <p className="mt-8 text-sm text-muted tabular-nums">
            Powering <b className="text-fg">{users.toLocaleString("en-US")}</b> users across{" "}
            <b className="text-fg">{servers.toLocaleString("en-US")}</b> servers
          </p>
        )}
      </div>
    </section>
  );
}
