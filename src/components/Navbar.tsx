import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const l = "text-sm text-muted hover:text-fg";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">{BOT_NAME}</Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <Link to="/commands" className={l}>Commands</Link>
          <a href={SUPPORT_URL} className={l}>Support</a>
          <a href={INVITE_URL} className="btn btn-accent !py-1.5">Invite</a>
        </nav>
        <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-4 border-t border-line bg-bg px-4 py-5 md:hidden">
          <Link to="/commands" onClick={() => setOpen(false)} className={l}>Commands</Link>
          <a href={SUPPORT_URL} className={l}>Support</a>
          <a href={INVITE_URL} className="btn btn-accent justify-center">Invite</a>
        </nav>
      )}
    </header>
  );
}
