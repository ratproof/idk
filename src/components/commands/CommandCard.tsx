import { slugify, type Command } from "@/lib/api";
import { CopyButton } from "./CopyButton";

// <required> and [optional] and [x=default] tokens from the usage string
function parseArgs(usage: string) {
  return (usage.match(/<[^>]+>|\[[^\]]+\]/g) ?? []).map((t) => {
    const optional = t.startsWith("[");
    const inner = t.slice(1, -1);
    const m = optional ? inner.match(/^([^=]+)=(.+)$/) : null;
    return { name: m ? m[1] : inner, def: m?.[2], optional };
  });
}

const label = "text-[15px] text-zinc-400";
export function CommandCard({ cmd, highlighted }: { cmd: Command; highlighted: boolean }) {
  const args = parseArgs(cmd.usage);
  return (
    <article id={slugify(cmd.name)} className={`scroll-mt-28 overflow-hidden rounded-3xl border bg-[#101012] transition-colors hover:border-white/15 ${highlighted ? "border-accent/60" : "border-line"}`}>
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="break-words text-xl font-medium tracking-tight">{cmd.name}</h3>
          <CopyButton text={cmd.usage} />
        </div>
        {cmd.description && <p className="mt-2 text-[15px] text-muted">{cmd.description}</p>}
      </div>
      <div className="space-y-5 border-t border-line p-6">
        <div>
          <p className={label}>arguments</p>
          {args.length === 0 ? <p className="mt-2.5 text-[15px]">none</p> : (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {args.map((a, i) => (
                <span key={i} title={a.optional ? "optional" : "required"}
                  className={`max-w-full break-words rounded-lg px-3 py-1.5 text-sm italic ${a.optional ? "border border-dashed border-white/15 text-muted" : "bg-white/[0.07] text-fg"}`}>
                  {a.name}{a.def && <span className="not-italic text-zinc-500"> = {a.def}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
        {cmd.permissions && (
          <div>
            <p className={label}>permissions</p>
            {cmd.permissions.length === 0 ? <p className="mt-2.5 text-[15px]">none</p> : (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {cmd.permissions.map((p) => <span key={p} className="rounded-lg bg-[#1d1d20] px-3 py-1.5 text-sm font-medium">{p}</span>)}
              </div>
            )}
          </div>
        )}
        {cmd.aliases.length > 0 && (
          <div>
            <p className={label}>aliases</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {cmd.aliases.map((a) => <span key={a} className="rounded-lg bg-white/[0.07] px-3 py-1.5 text-sm">{a}</span>)}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
