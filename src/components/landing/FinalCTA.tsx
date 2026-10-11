import { BOT_NAME, INVITE_URL } from "@/config";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface-1 px-6 py-24 text-center">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 110%, rgb(123 97 255 / 0.22), transparent 70%)" }} />
        <h2 className="relative mx-auto max-w-2xl">Add {BOT_NAME} to your server</h2>
        <a href={INVITE_URL} className="btn btn-accent relative mt-8">Invite to Discord</a>
      </div>
    </section>
  );
}
