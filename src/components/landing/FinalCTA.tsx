import { BOT_NAME, INVITE_URL } from "@/config";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="bg-grad relative overflow-hidden rounded-[32px] px-6 py-24 text-center">
        <div className="grain" aria-hidden />
        <h2 className="relative mx-auto max-w-2xl text-black">Add {BOT_NAME} to your server</h2>
        <p className="relative mt-3 font-normal text-black/70">Get set up in a couple of minutes.</p>
        <a href={INVITE_URL} className="btn relative mt-8 bg-black !text-white">Invite to Discord</a>
      </div>
    </section>
  );
}
