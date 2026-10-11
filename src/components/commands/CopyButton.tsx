import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CopyButton = ({ text }: { text: string }) => (
  <button
    aria-label={`Copy ${text}`}
    className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-fg"
    onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Copied"))}
  >
    <Copy className="h-5 w-5" />
  </button>
);
