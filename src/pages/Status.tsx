import { useQuery } from "@tanstack/react-query";
import { BOT_NAME } from "@/config";
import { fetchStatus, type ShardStatus } from "@/lib/api";

const fmtUptime = (s: number) => {
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return [d && `${d}d`, (d || h) && `${h}h`, (d || h || m) && `${m}m`, `${sec}s`].filter(Boolean).join(" ");
};
const ms = (n: number | null | undefined) => (n == null || !Number.isFinite(n) ? "n/a" : `${Math.round(n)}ms`);
const isUp = (s: ShardStatus) => s.connected !== false && s.ping != null && Number.isFinite(s.ping);

const tones = {
  ok: { box: "border-emerald-500/25 bg-emerald-500/[0.07]", dot: "bg-emerald-400", text: "text-emerald-300" },
  warn: { box: "border-amber-500/25 bg-amber-500/[0.07]", dot: "bg-amber-400", text: "text-amber-300" },
  bad: { box: "border-red-500/25 bg-red-500/[0.07]", dot: "bg-red-400", text: "text-red-300" },
};

function Banner({ tone, title, sub }: { tone: keyof typeof tones; title: string; sub: string }) {
  const t = tones[tone];
  return (
    <div role="status" aria-live="polite" className={`mt-8 flex items-center gap-4 rounded-3xl border px-6 py-5 ${t.box}`}>
      <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${t.dot}`} aria-hidden />
      <div><p className={`font-semibold ${t.text}`}>{title}</p><p className="text-sm text-muted">{sub}</p></div>
    </div>
  );
}
const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="min-h-[7.5rem] rounded-3xl border border-line bg-[#101012] p-6">
    <p className="text-[13px] uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-2 text-3xl font-semibold">{value}</p>
    {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
  </div>
);
const Mini = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center"><p className="font-semibold">{value}</p><p className="text-[11px] uppercase tracking-wide text-muted">{label}</p></div>
);

export default function Status() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["status", "live"], queryFn: fetchStatus, refetchInterval: 15_000, refetchOnWindowFocus: true });

  let body;
  if (isLoading) {
    body = (<>
      <div className="mt-8 h-20 animate-pulse rounded-3xl bg-[#101012]" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="h-[7.5rem] animate-pulse rounded-3xl bg-[#101012]" />)}</div>
    </>);
  } else if (isError || !data) {
    body = <Banner tone="bad" title="Can't reach the bot" sub="The status API isn't responding. Retrying automatically." />;
  } else {
    // a non-sharded bot sends shards: null, so show one synthetic shard from the totals
    const shards: ShardStatus[] = data.shards?.length ? data.shards : [{ id: 0, ping: data.ping, guilds: data.guilds, users: data.users, connected: true }];
    const up = shards.filter(isUp).length;
    const tone = up === shards.length ? "ok" : up > 0 ? "warn" : "bad";
    const title = tone === "ok" ? "All systems operational" : tone === "warn" ? "Partial outage" : "Major outage";
    body = (<>
      <Banner tone={tone} title={title} sub={`${up}/${shards.length} shards connected · ${ms(data.ping)} latency`} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Guilds" value={data.guilds.toLocaleString()} />
        <Stat label="Users" value={data.users.toLocaleString()} />
        <Stat label="Latency" value={ms(data.ping)} />
        <Stat label="Uptime" value={fmtUptime(data.uptime)} sub={`${up}/${shards.length} shards up`} />
      </div>
      <h2 className="mb-4 mt-12 text-2xl">Shards</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shards.map((s) => (
          <div key={s.id} className="rounded-3xl border border-line bg-[#101012] p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Shard {s.id}</p>
              <span className={`flex items-center gap-2 text-sm ${isUp(s) ? "text-emerald-400" : "text-red-400"}`}>
                <span className={`h-2 w-2 rounded-full ${isUp(s) ? "bg-emerald-400" : "bg-red-400"}`} aria-hidden />{isUp(s) ? "connected" : "offline"}
              </span>
            </div>
            <div className="mt-5 flex justify-around gap-2">
              <Mini value={ms(s.ping)} label="Latency" />
              {s.guilds != null && <Mini value={s.guilds.toLocaleString()} label="Guilds" />}
              {s.users != null && <Mini value={s.users.toLocaleString()} label="Users" />}
            </div>
          </div>
        ))}
      </div>
    </>);
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-28">
      <h1 className="text-4xl sm:text-5xl">{BOT_NAME} status</h1>
      <p className="mt-2 text-muted">Live health of the {BOT_NAME} bot, refreshed automatically.</p>
      {body}
    </main>
  );
}
