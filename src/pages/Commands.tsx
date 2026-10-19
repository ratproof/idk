import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useCommands } from "@/hooks/useCommands";
import { slugify, totalCount, type Command } from "@/lib/api";
import { CommandCard } from "@/components/commands/CommandCard";

// ---------- tab icons ----------
// Soft tint on closed shapes so icons read as "duotone" without needing a second colour.
const T = { fill: "currentColor", fillOpacity: 0.14 } as const;
const DOT = { fill: "currentColor", stroke: "none" } as const;

const ICONS: Record<string, ReactNode> = {
  // 2x2 grid
  all: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" {...T} />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" {...T} />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" {...T} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" {...T} />
    </>
  ),

  // coin with a dollar sign
  economy: (
    <>
      <circle cx="12" cy="12" r="9" {...T} />
      <path d="M14.7 9.3c-.4-.9-1.4-1.4-2.7-1.4-1.5 0-2.6.8-2.6 1.9 0 2.7 5.2 1.5 5.2 4.2 0 1.2-1.2 2-2.6 2-1.3 0-2.3-.5-2.8-1.5" />
      <path d="M12 6.2v1.7M12 16.1v1.7" />
    </>
  ),

  // shield with a check
  moderation: (
    <>
      <path d="M12 3l7.5 3v5.6c0 4.4-3.1 7.9-7.5 9.4-4.4-1.5-7.5-5-7.5-9.4V6L12 3z" {...T} />
      <path d="M8.8 12.1l2.2 2.2 4.2-4.5" />
    </>
  ),

  // sliders
  configuration: (
    <>
      <path d="M4 7h8.5M17.5 7H20M4 12h2.5M11.5 12H20M4 17h8.5M17.5 17H20" />
      <circle cx="15" cy="7" r="2.5" {...T} />
      <circle cx="9" cy="12" r="2.5" {...T} />
      <circle cx="15" cy="17" r="2.5" {...T} />
    </>
  ),

  // wrench
  utility: (
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      {...T}
    />
  ),

  // smiley
  fun: (
    <>
      <circle cx="12" cy="12" r="9" {...T} />
      <circle cx="9" cy="10" r=".9" {...DOT} />
      <circle cx="15" cy="10" r=".9" {...DOT} />
      <path d="M8 14.2c1 1.5 2.3 2.3 4 2.3s3-.8 4-2.3" />
    </>
  ),

  // Last.fm logo (filled brand glyph, so it opts out of the stroke styling)
  lastfm: (
    <path
      d="M10.584 17.21l-.88-2.392s-1.43 1.595-3.573 1.595c-1.897 0-3.244-1.649-3.244-4.287 0-3.381 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.75c.88 2.668 2.528 4.81 7.284 4.81 3.409 0 5.719-1.044 5.719-3.793 0-2.227-1.265-3.381-3.629-3.931l-1.756-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.935.742-1.485 1.952-1.485 1.32 0 2.034.495 2.144 1.678l2.75-.33c-.22-2.474-1.924-3.491-4.729-3.491-2.474 0-4.893.935-4.893 3.931 0 1.87.907 3.052 3.189 3.602l1.87.44c1.402.33 1.87.907 1.87 1.705 0 1.017-.989 1.43-2.857 1.43-2.777 0-3.932-1.457-4.591-3.464l-.907-2.75c-1.155-3.573-2.997-4.894-6.653-4.894C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.107 0 4.591-1.457 4.591-1.457z"
      {...DOT}
    />
  ),

  // gem
  premium: (
    <>
      <path d="M6.5 3h11L22 9l-10 12L2 9l4.5-6z" {...T} />
      <path d="M2 9h20M10 3L8 9l4 12 4-12-2-6" />
    </>
  ),

  // four-point sparkles
  misc: (
    <>
      <path d="M11 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5C8.8 9.4 10.4 7.8 11 3.5z" {...T} />
      <path d="M19 15.5v5M16.5 18h5" />
    </>
  ),

  // question mark in a circle
  help: (
    <>
      <circle cx="12" cy="12" r="9" {...T} />
      <path d="M9.4 9.4a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.2-2.6 3.8" />
      <circle cx="12" cy="17.2" r=".9" {...DOT} />
    </>
  ),

  // gift box
  giveaways: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1.2" {...T} />
      <path d="M5 12v7.2A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.8-1.8V12" {...T} />
      <path d="M12 8v13" />
      <path d="M12 8C10.4 4.4 7 4.4 7 6.4S9.6 8 12 8z" />
      <path d="M12 8c1.6-3.6 5-3.6 5-1.6S14.4 8 12 8z" />
    </>
  ),

  // ticket with perforation
  tickets: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5V10a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5V14a2 2 0 0 0 0-4V8.5z" {...T} />
      <path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2" />
    </>
  ),

  // cloud with upload arrow
  cdn: (
    <>
      <path d="M7 18.5a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-.9A4.5 4.5 0 0 1 17.5 18.5H7z" {...T} />
      <path d="M12 16v-5M9.8 12.9L12 10.7l2.2 2.2" />
    </>
  ),

  // code brackets
  jishaku: <path d="M8 7.5L3.5 12 8 16.5M16 7.5l4.5 4.5-4.5 4.5M13.5 5l-3 14" />,
};

// extra slugs that should reuse an icon
const ALIAS: Record<string, string> = {
  config: "configuration",
  settings: "configuration",
  mod: "moderation",
  eco: "economy",
  music: "lastfm",
  "last-fm": "lastfm",
  giveaway: "giveaways",
  ticket: "tickets",
  info: "utility",
  tools: "utility",
  games: "fun",
  owner: "jishaku",
  dev: "jishaku",
};

// fallback: hash sign
const FALLBACK = <path d="M5 9h14M5 15h14M10.5 4L8.5 20M15.5 4l-2 16" />;

function GroupIcon({ slug, className }: { slug: string; className?: string }) {
  const key = slug.toLowerCase();
  const icon = ICONS[key] ?? ICONS[ALIAS[key]] ?? FALLBACK;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {icon}
    </svg>
  );
}

// ---------- page ----------
function useDebounced<T>(v: T, ms = 200) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}
const flatten = (cmds: Command[]) => cmds.flatMap((c) => [c, ...c.subcommands]);

export default function Commands() {
  const { data, isLoading, isError, refetch } = useCommands();
  const [q, setQ] = useState("");
  const [active, setActive] = useState("all");
  const [hash, setHash] = useState(() => location.hash.slice(1));
  const [can, setCan] = useState({ l: false, r: false });
  const input = useRef<HTMLInputElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef("");
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const dq = useDebounced(q).toLowerCase().trim();

  // biggest groups first, smallest last (ties keep the api order)
  const groups = useMemo(() => (data ? [...data].sort((a, b) => b.count - a.count) : undefined), [data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); input.current?.focus(); }
    };
    const onHash = () => setHash(location.hash.slice(1));
    addEventListener("keydown", onKey); addEventListener("hashchange", onHash);
    return () => { removeEventListener("keydown", onKey); removeEventListener("hashchange", onHash); };
  }, []);

  // deep links: a group hash opens that tab, a command hash opens the tab it lives in
  useEffect(() => {
    if (!data || !hash) return;
    const group = data.find((g) => g.slug === hash) ?? data.find((g) => flatten(g.commands).some((c) => slugify(c.name) === hash));
    if (group) setActive(group.slug);
  }, [data, hash]);
  useEffect(() => {
    if (!data || !hash || scrolledFor.current === hash) return;
    const el = document.getElementById(hash);
    if (el) { scrolledFor.current = hash; requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "center" })); }
  }, [data, hash, active]);

  // back/forward button visibility
  const update = useCallback(() => {
    const el = tabs.current;
    if (el) setCan({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => { update(); addEventListener("resize", update); return () => removeEventListener("resize", update); }, [data, update]);
  useEffect(() => { document.getElementById(`tab-${active}`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }, [active]);

  const cards = useMemo(() => {
    if (!groups) return [];
    const src = dq || active === "all" ? groups : groups.filter((g) => g.slug === active);
    const list = flatten(src.flatMap((g) => g.commands));
    return dq ? list.filter((c) => [c.name, c.usage, ...c.aliases].some((s) => s.toLowerCase().includes(dq))) : list;
  }, [groups, active, dq]);

  const tabList = groups ? [{ slug: "all", name: "All", count: totalCount(groups) }, ...groups] : [];
  const pick = (slug: string) => { setActive(slug); history.replaceState(null, "", slug === "all" ? "#" : `#${slug}`); };
  const nudge = (dir: 1 | -1) => tabs.current?.scrollBy({ left: dir * tabs.current.clientWidth * 0.6, behavior: "smooth" });

  // mouse drag-to-scroll (touch uses native scrolling)
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !tabs.current) return;
    drag.current = { down: true, moved: false, x: e.clientX, left: tabs.current.scrollLeft };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !tabs.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    if (d.moved) tabs.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => { drag.current.down = false; };

  const arrow = "absolute top-0 z-10 hidden h-full w-16 place-items-center text-fg sm:grid";
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-28">
      <h1 className="text-4xl sm:text-5xl">Commands</h1>
      {data && <p className="mt-2 text-muted">{totalCount(data)} commands</p>}
      <div className="relative mt-8">
        <Search className="absolute left-4 top-4 h-4 w-4 text-muted" aria-hidden />
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search commands" placeholder='Search commands… (press "/")'
          className="w-full rounded-2xl border border-line bg-[#0e0e11] py-3.5 pl-11 pr-4 placeholder:text-muted" />
      </div>

      {data && (
        <div className="relative mt-5 overflow-hidden rounded-3xl border border-line bg-[#0e0e11]">
          {can.l && (
            <button aria-label="Previous groups" onClick={() => nudge(-1)} className={`${arrow} left-0 bg-gradient-to-r from-[#0e0e11] from-40% to-transparent`}>
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div ref={tabs} role="tablist" aria-label="Command groups" onScroll={update}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={endDrag} onPointerLeave={endDrag}
            onClickCapture={(e) => { if (drag.current.moved) { e.stopPropagation(); e.preventDefault(); drag.current.moved = false; } }}
            className="no-scrollbar flex cursor-grab select-none gap-1 overflow-x-auto p-1.5 active:cursor-grabbing">
            {tabList.map((g) => {
              const on = active === g.slug && !dq;
              return (
                <button key={g.slug} id={`tab-${g.slug}`} role="tab" aria-selected={on} onClick={() => pick(g.slug)} draggable={false}
                  className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3.5 text-[15px] lowercase transition-colors ${on ? "bg-white/[0.07] text-fg" : "text-zinc-400 hover:text-fg"}`}>
                  <GroupIcon slug={g.slug} className={`h-5 w-5 ${on ? "text-fg" : "text-[#8fa3ab]"}`} />{g.name}
                  <span className="rounded-lg bg-white/[0.07] px-2 py-0.5 text-sm">{g.count}</span>
                </button>
              );
            })}
          </div>
          {can.r && (
            <button aria-label="Next groups" onClick={() => nudge(1)} className={`${arrow} right-0 bg-gradient-to-l from-[#0e0e11] from-40% to-transparent`}>
              <ArrowRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Solid argument chips are required, dashed ones are optional.</p>

      {isLoading && <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-[#101012]" />)}</div>}
      {isError && (
        <div className="mt-8 rounded-3xl border border-line p-10 text-center">
          <p>Couldn't load commands.</p>
          <button onClick={() => refetch()} className="btn btn-accent mt-4">Retry</button>
        </div>
      )}
      {data && (
        <>
          {dq && <p className="mt-6 text-sm text-muted">{cards.length} result{cards.length === 1 ? "" : "s"}</p>}
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => <CommandCard key={c.name} cmd={c} highlighted={hash === slugify(c.name)} />)}
          </div>
          {cards.length === 0 && <p className="mt-12 text-center text-muted">No commands match "{q}".</p>}
        </>
      )}
    </main>
  );
}
