import { Mic, Languages, UserCircle, Info, Terminal, Palette, Smile } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const feats = [
  { t: "Text-to-speech", d: "6 voices to pick from", Icon: Mic },
  { t: "Translation", d: "Translate messages instantly", Icon: Languages },
  { t: "Avatar & banner lookup", d: "Grab any user's images", Icon: UserCircle },
  { t: "Server & member info", d: "Quick stats and details", Icon: Info },
  { t: "Custom prefix", d: "Use whatever prefix you like", Icon: Terminal },
  { t: "Customize the bot", d: "Your own avatar, banner and bio", Icon: Palette },
  { t: "Fun commands", d: "Games and extras for chat", Icon: Smile },
];
export default function MoreFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">And more</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Countless more features</h2>
      </Reveal>
      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {feats.map(({ t, d, Icon }) => (
          <div key={t} className="bg-[#09090b] p-6 transition-colors hover:bg-white/[0.03]">
            <Icon className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="mt-4 font-medium">{t}</h3>
            <p className="mt-1 text-sm text-zinc-500">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
