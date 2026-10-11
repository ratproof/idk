import { Link } from "react-router-dom";
const feats = [
  ["Text to Speech", "Read messages aloud in a voice channel with 6 voices."],
  ["Translation", "Translate any message into another language."],
  ["Avatar and Banner", "Look up any member's avatar and banner."],
  ["Server Info", "See details about your server and its members."],
  ["Custom Prefix", "Pick the prefix that fits your server."],
  ["Custom Bot Profile", "Change the bot's avatar, banner and bio."],
  ["Fun Commands", "Small games and extras for chat."],
];
export default function MoreFeatures() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-[72px] md:py-[120px]">
      <div className="text-center">
        <h2>Countless More Features</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-muted">The smaller things you will reach for every day.</p>
      </div>
      <div className="mt-12 grid overflow-hidden rounded-[24px] border border-line sm:grid-cols-2 lg:grid-cols-3">
        {feats.map(([t, d]) => (
          <div key={t} className="-mb-px -mr-px border-b border-r border-line p-7">
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1.5 text-[15px] text-muted">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center"><Link to="/commands" className="link text-sm">All commands</Link></p>
    </section>
  );
}
