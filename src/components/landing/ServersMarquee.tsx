import { useEffect, useMemo, useState } from "react";
import LogoLoop from "./LogoLoop";

type Server = {
  id: string;
  name: string;
  icon?: string | null;
  icon_url?: string | null;
  iconUrl?: string | null;
  members?: number;
  memberCount?: number;
  member_count?: number;
  community?: boolean;
  discoverable?: boolean;
  boosted?: boolean;
};

const count = (s: Server) => s.members ?? s.memberCount ?? s.member_count ?? 0;
const icon = (s: Server) => {
  const i = s.icon_url ?? s.iconUrl ?? s.icon;
  if (!i) return null;
  if (i.startsWith("http")) return i.replace(/\?size=\d+/, "") + (i.includes("?") ? "" : "?size=128");
  return `https://cdn.discordapp.com/icons/${s.id}/${i}.${i.startsWith("a_") ? "gif" : "png"}?size=128`;
};
// only show the best one: discoverable > boosted > community
const badge = (s: Server) => (s.discoverable ? "discoverable" : s.boosted ? "boosted" : s.community ? "community" : null);
const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// put the official icons in public/badges/ as community.svg, discoverable.svg, boosted.svg
// inline width/height on purpose: LogoLoop's CSS sizes every <img> inside an item, and inline styles win over it
const Badge = ({ k, title }: { k: "community" | "discoverable" | "boosted"; title: string }) => (
  <img src={`/badges/${k}.svg`} alt={title} style={{ width: 16, height: 16 }} />
);

const ServerCard = ({ s }: { s: Server }) => {
  const src = icon(s);
  const b = badge(s);
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-2 pr-5 text-left">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          className="rounded-full"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-semibold">
          {s.name.charAt(0)}
        </div>
      )}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap text-sm font-medium">{s.name}</span>
          {b && <Badge k={b} title={b} />}
        </div>
        <div className="text-xs text-white/50">{fmt.format(count(s))} members</div>
      </div>
    </div>
  );
};

// speed is in px/s (LogoLoop), replacing the old `duration` prop
export default function ServersMarquee({ speed = 60 }: { speed?: number }) {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    fetch("https://bucket.stains.rocks/api/servers")
      .then((r) => r.json())
      .then((d) => {
        const list: Server[] = Array.isArray(d) ? d : d.servers ?? [];
        setServers([...list].sort((a, b) => count(b) - count(a)).slice(0, 10));
      })
      .catch((e) => console.error("servers failed:", e));
  }, []);

  const logos = useMemo(() => servers.map((s) => ({ node: <ServerCard s={s} /> })), [servers]);

  if (!servers.length) return null;

  return (
    <section className="relative py-12">
      <h2 className="mb-6 text-center text-lg font-medium text-white/70">Trusted by some of Discord's biggest servers</h2>
      <LogoLoop
        logos={logos}
        speed={speed}
        direction="left"
        logoHeight={40}
        gap={16}
        hoverSpeed={0}
        scaleOnHover={false}
        fadeOut
        fadeOutWidth={0.1}
        ariaLabel="Servers that trust the bot"
      />
    </section>
  );
}
