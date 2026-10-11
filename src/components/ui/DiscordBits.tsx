import type { ReactNode } from "react";
export const BotMsg = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="flex gap-3 text-left">
    <div className="bg-grad h-9 w-9 shrink-0 rounded-full" aria-hidden />
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-sm font-medium">stains <span className="rounded bg-indigo-500 px-1 text-[10px]">BOT</span></div>
      <div className="mt-1 rounded-md border-l-4 border-accent bg-white/5 p-3 text-sm text-zinc-300">
        {title && <div className="mb-1 font-semibold text-white">{title}</div>}{children}</div>
    </div>
  </div>
);
export const Btn = ({ children, danger }: { children: ReactNode; danger?: boolean }) => (
  <span className={`rounded px-3 py-1.5 text-xs font-medium ${danger ? "bg-red-500/80" : "bg-white/10"}`}>{children}</span>
);
export const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-black/50 px-2 py-1 font-mono text-xs text-accent-soft">{children}</code>
);
