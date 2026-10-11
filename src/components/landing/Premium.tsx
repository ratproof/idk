import { PREMIUM_PERKS, SUPPORT_URL } from "@/config";

export default function Premium() {
  if (PREMIUM_PERKS.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="grid gap-10 card rounded-3xl p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2>Premium</h2>
          <p className="mt-3 max-w-[40ch] text-muted">Support development and get a few extras for your server.</p>
          <p className="mt-6 text-sm text-muted">Redeem your code in Discord with <code className="rounded-[6px] bg-surface-2 px-1.5 py-0.5 text-fg">redeem</code>.</p>
          <a href={SUPPORT_URL} className="btn btn-accent mt-6">Get premium</a>
        </div>
        <ul className="self-center border-t border-line">
          {PREMIUM_PERKS.map((p) => <li key={p} className="border-b border-line py-3 text-[15px]">{p}</li>)}
        </ul>
      </div>
    </section>
  );
}
