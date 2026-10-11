import { useState } from "react";
import { TESTIMONIALS } from "@/config";

export default function Testimonials() {
  const [i, setI] = useState(0);
  if (TESTIMONIALS.length === 0) return null;
  const t = TESTIMONIALS[Math.min(i, TESTIMONIALS.length - 1)];
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <h2 className="mx-auto max-w-2xl text-center">Loved and Trusted by the Largest Servers</h2>
      <figure className="mt-12 grid gap-8 rounded-[24px] border border-line bg-surface-1 p-8 md:grid-cols-[240px_1fr] md:p-12" aria-live="polite">
        <div className="flex items-center gap-4 md:flex-col md:items-start">
          <img src={t.serverIconUrl} alt="" width={64} height={64} className="h-16 w-16 rounded-full" />
          <div><div className="font-semibold">{t.serverName}</div>
            {t.serverMembers != null && <div className="text-sm text-muted">{t.serverMembers.toLocaleString()} members</div>}</div>
        </div>
        <div>
          <blockquote className="text-xl leading-snug md:text-2xl">{t.quote}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm">
            {t.authorAvatarUrl && <img src={t.authorAvatarUrl} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />}
            <span><span className="font-medium">{t.author}</span><span className="block text-muted">{t.role}</span></span>
          </figcaption>
        </div>
      </figure>
      {TESTIMONIALS.length > 1 && (
        <div role="tablist" aria-label="Testimonials" className="mt-6 flex justify-center gap-3">
          {TESTIMONIALS.map((x, n) => (
            <button key={n} role="tab" aria-selected={n === i} aria-label={x.serverName} onClick={() => setI(n)}
              className={`rounded-full border p-0.5 transition-opacity ${n === i ? "border-fg opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}>
              <img src={x.serverIconUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
