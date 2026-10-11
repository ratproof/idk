import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

const links = [
  { label: "Home", to: "/", ext: false },
  { label: "Commands", to: "/commands", ext: false },
  { label: "Support", to: SUPPORT_URL, ext: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 8);
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  const cls = "text-sm text-zinc-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 rounded";
  return (
    <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors ${scrolled ? "border-b border-white/10 bg-black/40" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight"><span className="text-grad">{BOT_NAME}</span></Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {links.map((l) => l.ext
            ? <a key={l.label} href={l.to} className={cls} target="_blank" rel="noreferrer">{l.label}</a>
            : <NavLink key={l.label} to={l.to} end className={({ isActive }) => `${cls} ${isActive ? "text-white" : ""}`}>{l.label}</NavLink>)}
          <a href={INVITE_URL} className="bg-grad rounded-lg px-4 py-1.5 text-sm font-medium text-white">Invite</a>
        </nav>
        <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-4 border-t border-white/10 bg-black/80 px-4 py-5 md:hidden">
          {links.map((l) => l.ext
            ? <a key={l.label} href={l.to} className={cls}>{l.label}</a>
            : <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className={cls}>{l.label}</Link>)}
          <a href={INVITE_URL} className="bg-grad rounded-lg px-4 py-2 text-center text-sm font-medium">Invite</a>
        </nav>
      )}
    </header>
  );
}
