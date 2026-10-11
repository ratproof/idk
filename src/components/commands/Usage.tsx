import { Fragment } from "react";

// <required> normal, [optional] muted, [x=default] muted with the default shown in normal text
export function Usage({ text }: { text: string }) {
  const parts = text.split(/(<[^>]+>|\[[^\]]+\])/g);
  return (
    <code className="font-mono text-sm text-fg">
      {parts.map((p, i) => {
        if (p.startsWith("[")) {
          const m = p.match(/^\[([^=\]]+)=([^\]]+)\]$/);
          return m ? <span key={i} className="text-muted">[{m[1]}=<span className="text-fg">{m[2]}</span>]</span>
                   : <span key={i} className="text-muted">{p}</span>;
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </code>
  );
}

export const UsageLegend = () => (
  <p className="text-xs text-muted">&lt;required&gt; · <span>[optional]</span> · [arg=default]</p>
);
