import { SHOWCASE_SERVERS, STATS } from "@/config";
import { Marquee } from "@/components/ui/Marquee";

type S = (typeof SHOWCASE_SERVERS)[number];
const card = (s: S) => (
  <div key={s.name} className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-line bg-surface-1 p-3">
    <img src={s.iconUrl} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 rounded-full" />
    <div className="min-w-0"><div className="truncate text-sm font-medium">{s.name}</div>
      <div className="text-xs text-muted">{s.members.toLocaleString()} members</div></div>
    {s.badge && <span className="ml-auto rounded-[6px] border border-line px-1.5 py-0.5 text-[11px] text-muted">{s.badge}</span>}
  </div>
);
export default function SocialProof() {
  if (!STATS && SHOWCASE_SERVERS.length === 0) return null;
  const half = Math.ceil(SHOWCASE_SERVERS.length / 2);
  const [a, b] = [SHOWCASE_SERVERS.slice(0, half), SHOWCASE_SERVERS.slice(half)];
  return (
    <section className="py-[72px] md:py-[120px]">
      {STATS && <p className="px-4 text-center text-xl text-muted">Powering <b className="font-medium text-fg">{STATS.users.toLocaleString()}</b> users across <b className="font-medium text-fg">{STATS.servers.toLocaleString()}</b> communities</p>}
      {SHOWCASE_SERVERS.length > 0 && (
        <div className="mt-10 space-y-4">
          <Marquee>{a.map(card)}</Marquee>
          {b.length > 0 && <Marquee reverse>{b.map(card)}</Marquee>}
        </div>
      )}
    </section>
  );
}
