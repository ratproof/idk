import { TESTIMONIALS } from "@/config";
import { Reveal } from "@/components/ui/Reveal";

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-semibold">Loved by communities</h2>
      <div className="mt-10 columns-1 gap-4 md:columns-2 lg:columns-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={i} className="mb-4 break-inside-avoid">
            <figure className="glass rounded-xl p-5">
              <blockquote className="text-zinc-300">“{t.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 text-sm">
                <img src={t.serverIconUrl} alt="" loading="lazy" width={36} height={36} className="h-9 w-9 rounded-full" />
                <span><span className="font-medium">{t.author}</span><span className="block text-zinc-500">{t.role} · {t.serverName}</span></span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
