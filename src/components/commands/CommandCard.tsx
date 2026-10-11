import { useState } from "react";
import { slugify, type Command } from "@/lib/api";
import { Usage } from "./Usage";
import { CopyButton } from "./CopyButton";

const UsageBlock = ({ c }: { c: Command }) => (
  <div className="group mt-2 flex items-center justify-between gap-2 rounded-[6px] border border-line bg-surface-1 px-3 py-2">
    <Usage text={c.usage} /><CopyButton text={c.usage} />
  </div>
);

// A documentation-style row, not a card.
export function CommandCard({ cmd, highlighted }: { cmd: Command; highlighted: boolean }) {
  const [open, setOpen] = useState(highlighted);
  const id = slugify(cmd.name);
  const subs = cmd.subcommands.length;
  return (
    <div id={id} className={`scroll-mt-24 border-b border-line py-5 ${highlighted ? "bg-surface-1" : ""}`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <a href={`#${id}`} className="font-mono font-medium">{cmd.name}</a>
        {cmd.aliases.length > 0 && <span className="text-sm text-muted">aliases: {cmd.aliases.join(", ")}</span>}
        {subs > 0 && (
          <button aria-expanded={open} onClick={() => setOpen(!open)} className="ml-auto text-sm text-muted hover:text-fg">
            {open ? "Hide" : "Show"} {subs} subcommand{subs > 1 ? "s" : ""}
          </button>
        )}
      </div>
      {cmd.description && <p className="mt-1 text-[15px] text-muted">{cmd.description}</p>}
      <UsageBlock c={cmd} />
      {subs > 0 && open && (
        <div className="ml-4 mt-3 border-l border-line pl-4">
          {cmd.subcommands.map((s) => (
            <div key={s.name} id={slugify(s.name)} className="scroll-mt-24 py-3">
              <span className="font-mono text-sm font-medium">{s.name}</span>
              {s.description && <p className="text-sm text-muted">{s.description}</p>}
              <UsageBlock c={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
