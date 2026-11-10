import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL as string;

type Guild = { id: string; name: string; icon: string | null; bot: boolean };
type Me = { id: string; username: string; avatar: string | null; guilds: Guild[] };
type Role = { id: string; name: string; color: number };
type Kind = "humans" | "bots";
type Detail = { roles: Role[]; autoroles: Record<Kind, string[]> };
type Cmd = { name: string; uses: number };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(API + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!r.ok) throw new Error(r.status === 502 ? await r.text() : String(r.status));
  return r.json();
}

const Server = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
    <path d="M3 4h18a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 9h18a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm3-6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
  </svg>
);

const Exit = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
    <path d="M10 3a1 1 0 0 1 1 1v3h-2V5H5v14h4v-2h2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6Zm6.3 4.3 4.4 4.4a1 1 0 0 1 0 1.4l-4.4 4.4-1.4-1.4 2.7-2.7H9v-2h8.6l-2.7-2.7 1.4-1.4Z" />
  </svg>
);

const hex = (n: number) => (n ? `#${n.toString(16).padStart(6, "0")}` : "#71717a");

function Icon({ g }: { g: Guild }) {
  if (g.icon)
    return <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`} className="h-6 w-6 rounded-md" alt="" />;
  return <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs">{g.name[0]}</span>;
}

function Autoroles({ id }: { id: string }) {
  const [d, setD] = useState<Detail | null>(null);
  const [sel, setSel] = useState<Record<Kind, string[]>>({ humans: [], bots: [] });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setD(null);
    setMsg("");
    api<Detail>(`/guilds/${id}`)
      .then((x) => {
        setD(x);
        setSel(x.autoroles);
      })
      .catch(() => setMsg("Could not load this server. Check that Stains is still in it."));
  }, [id]);

  const toggle = (k: Kind, r: string) =>
    setSel((s) => ({ ...s, [k]: s[k].includes(r) ? s[k].filter((x) => x !== r) : [...s[k], r] }));

  const save = async (k: Kind) => {
    try {
      await api(`/guilds/${id}/autoroles`, { method: "PUT", body: JSON.stringify({ kind: k, roles: sel[k] }) });
      setMsg(`Saved ${k} autoroles.`);
    } catch {
      setMsg(`Could not save ${k} autoroles. Try again.`);
    }
  };

  if (!d) return <p className="text-sm text-zinc-500">{msg || "Loading roles"}</p>;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {(["humans", "bots"] as Kind[]).map((k) => (
          <section key={k} className="rounded-md border border-zinc-800 p-4">
            <h3 className="mb-3 font-medium text-zinc-100">Autoroles for {k}</h3>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {d.roles.map((r) => (
                <label key={r.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-900">
                  <input type="checkbox" checked={sel[k].includes(r.id)} onChange={() => toggle(k, r.id)} className="accent-zinc-300" />
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: hex(r.color) }} />
                  <span className="truncate text-sm">{r.name}</span>
                </label>
              ))}
            </div>
            <button onClick={() => save(k)} className="mt-3 rounded-md bg-[#0B1933] px-4 py-2 text-sm text-zinc-100 hover:bg-[#12264d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300">
              Save {k}
            </button>
          </section>
        ))}
      </div>
      {msg && <p className="mt-4 text-sm text-zinc-400" role="status">{msg}</p>}
    </div>
  );
}

type VM = { config: Record<string, { id: string; name: string | null } | null>; live: number };
const vmRows: [string, string][] = [
  ["category_id", "Category"],
  ["jtc_channel_id", "Join to create"],
  ["interface_channel_id", "Interface"],
  ["private_category_id", "Private category"],
];

function Voicemaster({ id }: { id: string }) {
  const [v, setV] = useState<VM | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api<VM>(`/guilds/${id}/voicemaster`).then(setV).catch(() => setMsg("Could not load voicemaster."));

  useEffect(() => {
    setV(null);
    setMsg("");
    load();
  }, [id]);

  const run = async (method: "POST" | "DELETE", done: string) => {
    setBusy(true);
    try {
      await api(`/guilds/${id}/voicemaster`, { method });
      setMsg(done);
      await load();
    } catch (e) {
      setMsg(e instanceof Error && e.message.length > 3 ? e.message : "Something went wrong. Try again.");
    }
    setBusy(false);
  };

  const reset = () => {
    if (window.confirm("Delete the voicemaster category, interface and join to create channels?")) run("DELETE", "Voicemaster removed.");
  };

  if (!v) return <p className="text-sm text-zinc-500">{msg || "Loading voicemaster"}</p>;
  const on = !!v.config.jtc_channel_id;
  const btn = "rounded-md px-4 py-2 text-sm text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300 disabled:opacity-50";

  return (
    <section className="max-w-lg rounded-md border border-zinc-800 p-4">
      {on ? (
        <>
          <ul className="divide-y divide-zinc-800 text-sm">
            {vmRows.map(([k, label]) => (
              <li key={k} className="flex justify-between py-2">
                <span className="text-zinc-500">{label}</span>
                <span>{v.config[k] ? v.config[k]!.name ?? "deleted channel" : "not set"}</span>
              </li>
            ))}
            <li className="flex justify-between py-2">
              <span className="text-zinc-500">Active temporary channels</span>
              <span>{v.live}</span>
            </li>
          </ul>
          <button disabled={busy} onClick={reset} className={`${btn} mt-4 bg-red-950 hover:bg-red-900`}>
            Remove voicemaster
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-400">
            Creates a Voice Channels category with an interface channel (control panel) and a Join to Create channel.
          </p>
          <button disabled={busy} onClick={() => run("POST", "Voicemaster is set up.")} className={`${btn} mt-4 bg-[#0B1933] hover:bg-[#12264d]`}>
            Set up voicemaster
          </button>
        </>
      )}
      {msg && <p className="mt-4 text-sm text-zinc-400" role="status">{msg}</p>}
    </section>
  );
}

function GuildView({ id }: { id: string }) {
  const [tab, setTab] = useState<"autoroles" | "voicemaster">("autoroles");
  return (
    <div>
      <div className="mb-6 flex gap-6 border-b border-zinc-800 text-sm" role="tablist">
        {(["autoroles", "voicemaster"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-2 capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300 ${
              tab === t ? "border-zinc-300 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "autoroles" ? <Autoroles id={id} /> : <Voicemaster id={id} />}
    </div>
  );
}

export default function Dashboard() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [cmds, setCmds] = useState<Cmd[]>([]);
  const [gid, setGid] = useState<string | null>(null);

  useEffect(() => {
    api<Me>("/me").then(setMe).catch(() => setMe(null));
    api<Cmd[]>("/commands").then(setCmds).catch(() => {});
  }, []);

  const logout = async () => {
    await api("/auth/logout");
    setMe(null);
    setGid(null);
  };

  if (me === undefined) return <div className="min-h-screen bg-black" />;

  if (!me)
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-zinc-300">
        <div className="max-w-sm">
          <h1 className="text-2xl font-semibold text-zinc-100">Stains dashboard</h1>
          <p className="mt-3 text-sm text-zinc-400">Log in with Discord to manage autoroles and voicemaster in the servers you manage.</p>
          <a href={`${API}/auth/login`} className="mt-6 inline-block rounded-md bg-[#0B1933] px-5 py-2.5 text-sm text-zinc-100 hover:bg-[#12264d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300">
            Log in with Discord
          </a>
        </div>
      </main>
    );

  const cur = me.guilds.find((g) => g.id === gid);

  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
        <span className="font-semibold text-zinc-100">Stains</span>
        <div className="flex items-center gap-3 text-sm">
          {me.avatar && <img src={`https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64`} className="h-6 w-6 rounded-md" alt="" />}
          <span>{me.username}</span>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300">
            <Exit /> Log out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 md:grid-cols-[16rem_1fr]">
        <nav aria-label="Servers" className="space-y-1">
          <h2 className="mb-2 flex items-center gap-2 text-sm text-zinc-500"><Server /> Your servers</h2>
          {me.guilds.length === 0 && <p className="text-sm text-zinc-500">You need Manage Server in a server to see it here.</p>}
          {me.guilds.map((g) => (
            <button
              key={g.id}
              disabled={!g.bot}
              onClick={() => setGid(g.id)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-300 ${
                gid === g.id ? "bg-[#0B1933] text-zinc-100" : "hover:bg-zinc-900"
              } disabled:cursor-not-allowed disabled:opacity-40`}
              title={g.bot ? undefined : "Stains is not in this server"}
            >
              <Icon g={g} />
              <span className="truncate">{g.name}</span>
            </button>
          ))}
        </nav>

        <main>
          {cur ? (
            <>
              <h2 className="mb-4 text-xl font-semibold text-zinc-100">{cur.name}</h2>
              <GuildView id={cur.id} />
            </>
          ) : (
            <>
              <h2 className="mb-4 text-xl font-semibold text-zinc-100">Most used commands</h2>
              <ol className="max-w-md divide-y divide-zinc-800 rounded-md border border-zinc-800">
                {cmds.map((c) => (
                  <li key={c.name} className="flex justify-between px-4 py-2.5 text-sm">
                    <span>{c.name}</span>
                    <span className="text-zinc-500">{c.uses.toLocaleString()} uses</span>
                  </li>
                ))}
                {cmds.length === 0 && <li className="px-4 py-2.5 text-sm text-zinc-500">No command usage recorded yet.</li>}
              </ol>
              <p className="mt-4 text-sm text-zinc-500">Pick a server on the left to manage it.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
