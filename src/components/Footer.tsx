import { Link } from "react-router-dom";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

const a = "text-sm text-muted hover:text-fg";
export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:grid-cols-[1fr_auto_auto] sm:gap-20">
        <div><span className="text-lg font-semibold tracking-tight">{BOT_NAME}</span>
          <p className="mt-2 max-w-[32ch] text-sm text-muted">A Discord bot for moderation, voice channels and giveaways.</p></div>
        <div className="flex flex-col gap-2"><h3 className="text-sm font-medium">Bot</h3>
          <a className={a} href={INVITE_URL}>Invite</a><Link className={a} to="/commands">Commands</Link>
          <a className={a} href={SUPPORT_URL}>Support Server</a></div>
        <div className="flex flex-col gap-2"><h3 className="text-sm font-medium">Legal</h3>
          <Link className={a} to="/terms">Terms</Link><Link className={a} to="/privacy">Privacy</Link></div>
      </div>
      <p className="mx-auto mt-10 max-w-[1200px] px-4 text-sm text-muted">© {new Date().getFullYear()} {BOT_NAME}</p>
    </footer>
  );
}
