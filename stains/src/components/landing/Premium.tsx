import { Check } from "lucide-react";
import { PREMIUM_PERKS, SUPPORT_URL } from "@/config";
import { Code } from "@/components/ui/DiscordBits";

export default function Premium() {
  if (PREMIUM_PERKS.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <div className="bg-grad rounded-3xl p-px">
        <div className="rounded-[calc(1.5rem-1px)] bg-[#0b0b10] p-8 sm:p-12">
          <h2 className="text-3xl font-semibold">Go <span className="text-grad">premium</span></h2>
          <p className="mt-2 text-zinc-400">Support development and unlock extra perks.</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {PREMIUM_PERKS.map((p) => <li key={p} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-violet-400" aria-hidden />{p}</li>)}
          </ul>
          <p className="mt-6 text-sm text-zinc-400">Redeem your code in Discord with <Code>;redeem</Code></p>
          <a href={SUPPORT_URL} className="bg-grad mt-6 inline-block rounded-xl px-6 py-3 font-medium">Get premium</a>
        </div>
      </div>
    </section>
  );
}
