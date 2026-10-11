import { Fragment } from "react";

// <required> accent, [optional] muted, [x=default] muted with highlighted default
export function Usage({ text }: { text: string }) {
  const parts = text.split(/(<[^>]+>|\[[^\]]+\])/g);
  return (
    <code className="font-mono text-sm">
      {parts.map((p, i) => {
        if (p.startsWith("<")) return <span key={i} className="text-violet-300">{p}</span>;
        if (p.startsWith("[")) {
          const m = p.match(/^\[([^=\]]+)=([^\]]+)\]$/);
          return m ? (
            <span key={i} className="text-zinc-500">[{m[1]}=<span className="text-emerald-300">{m[2]}</span>]</span>
          ) : <span key={i} className="text-zinc-500">{p}</span>;
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </code>
  );
}

export const UsageLegend = () => (
  <p className="text-xs text-zinc-500">
    <span className="text-violet-300">&lt;required&gt;</span> · <span>[optional]</span> · [arg=<span className="text-emerald-300">default</span>]
  </p>
);
