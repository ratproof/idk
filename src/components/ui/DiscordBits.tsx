import type { ReactNode } from "react";
export const BotMsg = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="flex gap-3 text-left">
    <div className="h-9 w-9 shrink-0 rounded-full bg-surface-2" aria-hidden />
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-sm font-medium">stains <span className="rounded-[4px] bg-[#5865f2] px-1 text-[10px] leading-4">BOT</span></div>
      <div className="mt-1 rounded-md border-l-4 border-accent bg-[#2b2d31] p-3 text-sm text-zinc-300">
        {title && <div className="mb-1 font-semibold text-white">{title}</div>}{children}</div>
    </div>
  </div>
);
export const Btn = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-[4px] bg-[#4e5058] px-3 py-1.5 text-xs font-medium text-white">{children}</span>
);
export const Cmd = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-zinc-700" aria-hidden />
    <div><div className="text-sm font-medium">you</div><code className="text-sm text-zinc-300">{children}</code></div></div>
);
