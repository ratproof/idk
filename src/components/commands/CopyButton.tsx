import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CopyButton = ({ text }: { text: string }) => (
  <button
    aria-label={`Copy ${text}`}
    className="rounded-md p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Copied"))}
  >
    <Copy className="h-4 w-4" />
  </button>
);
