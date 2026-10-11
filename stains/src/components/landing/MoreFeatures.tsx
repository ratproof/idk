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
      <h2 className="text-center text-3xl font-semibold sm:text-4xl">Countless more features</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {feats.map(({ t, d, Icon }, i) => (
          <Reveal key={t} delay={i * 0.04}>
            <div className="glass h-full rounded-xl p-5"><Icon className="h-6 w-6 text-violet-400" aria-hidden />
              <h3 className="mt-3 font-medium">{t}</h3><p className="mt-1 text-sm text-zinc-400">{d}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
