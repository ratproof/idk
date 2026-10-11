import { Link } from "react-router-dom";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

const a = "text-sm text-zinc-400 hover:text-white";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-[1fr_auto_auto] sm:gap-16">
        <div><span className="text-xl font-bold text-grad">{BOT_NAME}</span>
          <p className="mt-2 text-sm text-zinc-500">© {new Date().getFullYear()} {BOT_NAME}. All rights reserved.</p></div>
        <div className="flex flex-col gap-2"><h3 className="text-sm font-medium">Bot</h3>
          <a className={a} href={INVITE_URL}>Invite</a><Link className={a} to="/commands">Commands</Link>
          <a className={a} href={SUPPORT_URL}>Support Server</a></div>
        <div className="flex flex-col gap-2"><h3 className="text-sm font-medium">Legal</h3>
          <Link className={a} to="/terms">Terms</Link><Link className={a} to="/privacy">Privacy</Link></div>
      </div>
    </footer>
  );
}
