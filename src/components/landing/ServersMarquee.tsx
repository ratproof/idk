import { useEffect, useState } from "react";

type Server = {
  id: string;
  name: string;
  icon?: string | null;
  icon_url?: string | null;
  iconUrl?: string | null;
  members?: number;
  memberCount?: number;
  member_count?: number;
};

const count = (s: Server) => s.members ?? s.memberCount ?? s.member_count ?? 0;
const icon = (s: Server) => {
  const i = s.icon_url ?? s.iconUrl ?? s.icon;
  if (!i) return null;
  if (i.startsWith("http")) return i.replace(/\?size=\d+/, "") + (i.includes("?") ? "" : "?size=128");
  return `https://cdn.discordapp.com/icons/${s.id}/${i}.${i.startsWith("a_") ? "gif" : "png"}?size=128`;
};
const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// duration should match the socials marquee so both scroll at the same pace
export default function ServersMarquee({ duration = 40 }: { duration?: number }) {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    fetch("https://bucket.stains.rocks/api/servers")
      .then((r) => r.json())
      .then((d) => {
        console.log("servers:", d);
        const list: Server[] = Array.isArray(d) ? d : d.servers ?? [];
        setServers([...list].sort((a, b) => count(b) - count(a)).slice(0, 10));
      })
      .catch((e) => console.error("servers failed:", e));
  }, []);

  if (!servers.length) return null;

  return (
    <section className="relative py-12">
      <style>{`
        @keyframes servers-scroll { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .servers-track { animation: none !important; } }
      `}</style>
      <h2 className="mb-6 text-center text-lg font-medium text-white/70">Trusted by some of Discord's biggest servers</h2>
      <div
        className="overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)" }}
      >
        <div
          className="servers-track flex w-max hover:[animation-play-state:paused]"
          style={{ animation: `servers-scroll ${duration}s linear infinite` }}
        >
          {[...servers, ...servers].map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              aria-hidden={i >= servers.length}
              className="mr-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-2 pr-5"
            >
              {icon(s) ? (
                <img src={icon(s)!} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-semibold">
                  {s.name.charAt(0)}
                </div>
              )}
              <div className="leading-tight">
                <div className="whitespace-nowrap text-sm font-medium">{s.name}</div>
                <div className="text-xs text-white/50">{fmt.format(count(s))} members</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
