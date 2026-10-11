import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Crown, Gift, Hammer, LayoutGrid, Music, Paperclip, Search, Settings, Smile, Terminal, Wrench, type LucideIcon } from "lucide-react";
import { useCommands } from "@/hooks/useCommands";
import { slugify, totalCount, type Command } from "@/lib/api";
import { CommandCard } from "@/components/commands/CommandCard";

const icons: Record<string, LucideIcon> = {
  all: LayoutGrid, configuration: Settings, giveaways: Gift, moderation: Hammer, premium: Crown,
  lastfm: Music, misc: Paperclip, utility: Wrench, fun: Smile,
};

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
  const input = useRef<HTMLInputElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef("");
  const dq = useDebounced(q).toLowerCase().trim();

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

  const cards = useMemo(() => {
    if (!data) return [];
    const src = dq || active === "all" ? data : data.filter((g) => g.slug === active);
    const list = flatten(src.flatMap((g) => g.commands));
    return dq ? list.filter((c) => [c.name, c.usage, ...c.aliases].some((s) => s.toLowerCase().includes(dq))) : list;
  }, [data, active, dq]);

  const tabList = data ? [{ slug: "all", name: "All", count: totalCount(data) }, ...data] : [];
  const pick = (slug: string) => { setActive(slug); history.replaceState(null, "", slug === "all" ? "#" : `#${slug}`); };

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
        <div className="relative mt-5">
          <div ref={tabs} role="tablist" aria-label="Command groups" className="no-scrollbar flex gap-1 overflow-x-auto rounded-3xl border border-line bg-[#0e0e11] p-1.5 pr-14">
            {tabList.map((g) => {
              const Icon = icons[g.slug] ?? Terminal;
              const on = active === g.slug && !dq;
              return (
                <button key={g.slug} role="tab" aria-selected={on} onClick={() => pick(g.slug)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3.5 text-[15px] lowercase transition-colors ${on ? "bg-white/[0.07] text-fg" : "text-zinc-400 hover:text-fg"}`}>
                  <Icon className="h-5 w-5" aria-hidden />{g.name}
                  <span className="rounded-lg bg-white/[0.07] px-2 py-0.5 text-sm">{g.count}</span>
                </button>
              );
            })}
          </div>
          <button aria-label="Scroll groups" onClick={() => tabs.current?.scrollBy({ left: 320, behavior: "smooth" })}
            className="absolute right-0 top-0 grid h-full w-16 place-items-center rounded-r-3xl bg-gradient-to-l from-[#0e0e11] from-40% to-transparent text-fg">
            <ChevronRight className="h-6 w-6" />
          </button>
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
