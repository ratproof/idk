import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CopyButton = ({ text }: { text: string }) => (
  <button
    aria-label={`Copy ${text}`}
    className="rounded-md p-1.5 text-muted opacity-0 transition-opacity hover:text-fg focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
    onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Copied"))}
  >
    <Copy className="h-4 w-4" />
  </button>
);
