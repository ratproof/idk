import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const l = "font-medium text-fg transition-colors hover:text-accent-soft";
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto grid h-20 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-4">
        <Link to="/" className="justify-self-start text-lg font-semibold tracking-tight">{BOT_NAME}</Link>
        <nav aria-label="Main" className="hidden items-center gap-10 rounded-[22px] border border-white/[0.07] bg-[#121413]/80 px-9 py-3.5 backdrop-blur-xl md:flex">
          <Link to="/commands" className={l}>Commands</Link>
          <a href={SUPPORT_URL} className={l}>Support</a>
        </nav>
        <div className="col-start-3 flex items-center justify-self-end">
          <a href={INVITE_URL} className="btn btn-accent hidden !py-2 md:inline-flex">Invite</a>
          <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="mx-4 flex flex-col gap-4 rounded-[22px] border border-white/[0.07] bg-[#121413]/95 p-6 backdrop-blur-xl md:hidden">
          <Link to="/commands" onClick={() => setOpen(false)} className={l}>Commands</Link>
          <a href={SUPPORT_URL} className={l}>Support</a>
          <a href={INVITE_URL} className="btn btn-accent justify-center">Invite</a>
        </nav>
      )}
    </header>
  );
}
