import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { BotMsg, Btn, Cmd } from "@/components/ui/DiscordBits";

const row = (items: string[]) => <div className="mt-2 flex flex-wrap gap-2">{items.map((i) => <Btn key={i}>{i}</Btn>)}</div>;
const mocks: Record<string, ReactNode> = {
  "purge-filters": <div className="space-y-4"><Cmd>;purge links 50</Cmd><BotMsg>Removed 23 messages containing links.</BotMsg></div>,
  honeypot: <BotMsg title="Honeypot">Banned spambot#0001 for posting in #do-not-post.</BotMsg>,
  autorole: <div className="space-y-4"><Cmd>;autorole add @Member</Cmd><BotMsg><span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" aria-hidden />New members will receive @Member.</span></BotMsg></div>,
  "reaction-roles": <BotMsg title="Pick your roles">Choose what you want to be called.{row(["Gamer", "Artist", "Music"])}</BotMsg>,
  "voicemaster-panel": <BotMsg title="Voice controls">Manage your channel.{row(["Lock", "Unlock", "Limit", "Rename", "Claim", "Permit", "Reject"])}</BotMsg>,
  "voicemaster-setup": <div className="space-y-4"><Cmd>;voicemaster setup</Cmd><BotMsg>Created the category, join channel and control panel.</BotMsg></div>,
  "voicemaster-permissions": <div className="space-y-4"><Cmd>;voicemaster permit @friend</Cmd><Cmd>;voicemaster reject @troll</Cmd></div>,
  "giveaway-embed": <BotMsg title="Nitro giveaway">Ends in 2h 14m. Entries: 128{row(["Enter"])}</BotMsg>,
  "giveaway-requirements": <BotMsg title="Requirements">Role: @Member<br />Messages: 500<br />Voice minutes: 60<br />Must be in a voice channel</BotMsg>,
  "giveaway-manage": <div className="space-y-4"><Cmd>;giveaway reroll</Cmd><Cmd>;giveaway edit</Cmd><Cmd>;giveaway end</Cmd></div>,
};

// Loads /screenshots/<name>.png, falls back to a code-built mockup when it is missing.
export function Shot({ name, alt }: { name: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="shot-fade overflow-hidden rounded-t-[12px] border border-b-0 border-line bg-[#313338]">
      <div className="aspect-[16/10] w-full">
        {failed ? <div className="p-5">{mocks[name]}</div>
          : <img src={`/screenshots/${name}.png`} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover object-top" />}
      </div>
    </div>
  );
}
