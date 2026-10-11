import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { slugify, type Command } from "@/lib/api";
import { Usage } from "./Usage";
import { CopyButton } from "./CopyButton";

function UsageRow({ c }: { c: Command }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
      <Usage text={c.usage} />
      <CopyButton text={c.usage} />
    </div>
  );
}

export function CommandCard({ cmd, highlighted }: { cmd: Command; highlighted: boolean }) {
  const [open, setOpen] = useState(highlighted);
  const id = slugify(cmd.name);
  const hasSubs = cmd.subcommands.length > 0;
  return (
    <div id={id} className={`scroll-mt-24 rounded-xl border bg-white/[0.03] p-4 backdrop-blur transition-colors ${highlighted ? "border-violet-400/70" : "border-white/10"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <a href={`#${id}`} className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-sm">{cmd.name}</a>
        {cmd.aliases.map((a) => (
          <span key={a} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-400">{a}</span>
        ))}
        {hasSubs && (
          <button aria-expanded={open} aria-label="Toggle subcommands" onClick={() => setOpen(!open)} className="ml-auto text-zinc-400">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-zinc-400">{cmd.description || <span className="text-zinc-600">No description yet</span>}</p>
      <div className="mt-3"><UsageRow c={cmd} /></div>
      {hasSubs && open && (
        <div className="mt-3 space-y-2 border-l border-white/10 pl-3">
          {cmd.subcommands.map((s) => (
            <div key={s.name} id={slugify(s.name)} className="scroll-mt-24">
              <span className="font-mono text-xs text-zinc-300">{s.name}</span>
              {s.description && <p className="text-xs text-zinc-500">{s.description}</p>}
              <UsageRow c={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
