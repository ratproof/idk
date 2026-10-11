import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { SHOWCASE_SERVERS, STATS } from "@/config";
import { Marquee } from "@/components/ui/Marquee";

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setN(Math.round(to * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref} className="text-grad font-semibold">{n.toLocaleString()}</span>;
}

export default function SocialProof() {
  if (!STATS) return null; // never invent numbers
  const half = Math.ceil(SHOWCASE_SERVERS.length / 2);
  const rows = [SHOWCASE_SERVERS.slice(0, half), SHOWCASE_SERVERS.slice(half)];
  const card = (s: (typeof SHOWCASE_SERVERS)[number]) => (
    <div key={s.name} className="glass flex w-64 shrink-0 items-center gap-3 rounded-xl p-3">
      <img src={s.iconUrl} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 rounded-full" />
      <div className="min-w-0"><div className="truncate text-sm font-medium">{s.name}</div>
        <div className="text-xs text-zinc-500">{s.members.toLocaleString()} members</div></div>
      {s.badge && <span className="ml-auto rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent-soft">{s.badge}</span>}
    </div>
  );
  return (
    <section className="py-20">
      <p className="text-center text-xl text-zinc-300">Powering <CountUp to={STATS.users} /> users across <CountUp to={STATS.servers} /> communities</p>
      {SHOWCASE_SERVERS.length > 0 && (
        <div className="mt-10 space-y-4">
          <Marquee>{rows[0].map(card)}</Marquee>
          {rows[1].length > 0 && <Marquee reverse>{rows[1].map(card)}</Marquee>}
        </div>
      )}
    </section>
  );
}
