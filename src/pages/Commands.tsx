import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useCommands } from "@/hooks/useCommands";
import { slugify, totalCount, type Group } from "@/lib/api";
import { CommandCard } from "@/components/commands/CommandCard";
import { UsageLegend } from "@/components/commands/Usage";

function useDebounced<T>(v: T, ms = 200) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

export default function Commands() {
  const { data, isLoading, isError, refetch } = useCommands();
  const [q, setQ] = useState("");
  const [active, setActive] = useState("all");
  const [hash, setHash] = useState(() => location.hash.slice(1));
  const input = useRef<HTMLInputElement>(null);
  const dq = useDebounced(q).toLowerCase().trim();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); input.current?.focus(); }
    };
    const onHash = () => setHash(location.hash.slice(1));
    addEventListener("keydown", onKey); addEventListener("hashchange", onHash);
    return () => { removeEventListener("keydown", onKey); removeEventListener("hashchange", onHash); };
  }, []);

  // deep links: group anchor selects the group; command anchor scrolls once data is loaded
  useEffect(() => {
    if (!data || !hash) return;
    setActive(data.some((g) => g.slug === hash) ? hash : "all");
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [data, hash]);

  const groups: Group[] = useMemo(() => {
    if (!data) return [];
    return data
      .filter((g) => active === "all" || g.slug === active)
      .map((g) => ({
        ...g,
        commands: g.commands.filter((c) =>
          !dq || [c.name, c.usage, ...c.aliases, ...c.subcommands.map((s) => s.name)].some((s) => s.toLowerCase().includes(dq))),
      }))
      .filter((g) => g.commands.length);
  }, [data, active, dq]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-3xl font-semibold">Commands</h1>
      {data && <p className="mt-1 text-zinc-400">{totalCount(data)} commands</p>}
      <div className="relative mt-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" aria-hidden />
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search commands"
          placeholder='Search commands… (press "/")'
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 outline-none focus-visible:border-violet-400" />
      </div>
      <div className="mt-2"><UsageLegend /></div>

      {isLoading && <div className="mt-8 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />)}</div>}
      {isError && (
        <div className="mt-8 rounded-xl border border-white/10 p-8 text-center">
          <p>Couldn't load commands.</p>
          <button onClick={() => refetch()} className="mt-3 rounded-lg bg-violet-500 px-4 py-2">Retry</button>
        </div>
      )}

      {data && (
        <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr]">
          <nav aria-label="Command groups" className="flex gap-2 overflow-x-auto md:sticky md:top-24 md:flex-col md:self-start">
            {[{ slug: "all", name: "All", count: totalCount(data) }, ...data].map((g) => (
              <button key={g.slug} onClick={() => { setActive(g.slug); history.replaceState(null, "", g.slug === "all" ? "#" : `#${g.slug}`); }}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-sm ${active === g.slug ? "bg-white/10" : "text-zinc-400 hover:bg-white/5"}`}>
                {g.name}<span className="text-xs text-zinc-500">{g.count}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-10">
            {groups.length === 0 && <p className="text-center text-zinc-500">No commands match "{q}".</p>}
            {groups.map((g) => (
              <section key={g.slug} id={g.slug} className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-medium">{g.name}</h2>
                <div className="space-y-3">
                  {g.commands.map((c) => <CommandCard key={c.name} cmd={c} highlighted={hash === slugify(c.name)} />)}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
