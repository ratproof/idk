import { BOT_NAME, INVITE_URL } from "@/config";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="bg-grad relative overflow-hidden rounded-2xl px-6 py-20 text-center">
        <div className="grain" aria-hidden />
        <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-black sm:text-5xl">Enhance your community's experience.</h2>
        <p className="relative mt-3 text-lg text-black/70">Get {BOT_NAME} in your server today.</p>
        <a href={INVITE_URL} className="relative mt-8 inline-block rounded-xl bg-black px-7 py-3 font-medium text-white">Invite to Discord</a>
      </div>
    </section>
  );
}
