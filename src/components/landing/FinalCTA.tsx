import { BOT_NAME, INVITE_URL } from "@/config";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0c0d0d] px-6 py-28 text-center md:py-32">
        <div aria-hidden className="absolute inset-0" style={{ background:
          "radial-gradient(38% 55% at 12% 105%, color-mix(in srgb, var(--color-accent) 24%, transparent), transparent 70%), radial-gradient(32% 50% at 92% 105%, color-mix(in srgb, var(--color-accent) 17%, transparent), transparent 70%), radial-gradient(40% 55% at 22% 15%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)" }} />
        <div aria-hidden className="stars" />
        <svg aria-hidden viewBox="0 0 800 160" preserveAspectRatio="none" className="absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2">
          <path d="M0 160Q400 -50 800 160" fill="none" stroke="#fff" strokeOpacity=".09" />
        </svg>
        <p className="relative text-xl text-zinc-300 md:text-2xl">Enhance your community's experience.</p>
        <h2 className="relative mt-2 text-3xl md:text-[40px]">Get {BOT_NAME} in your server today.</h2>
        <a href={INVITE_URL} className="relative mt-10 inline-flex rounded-full border border-accent/40 bg-accent/10 px-8 py-3 font-medium transition-colors hover:bg-accent/20">Get started</a>
      </div>
    </section>
  );
}
