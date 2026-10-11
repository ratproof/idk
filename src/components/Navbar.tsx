import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BOT_AVATAR, BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

const NAV_ITEMS = [
  { label: "Commands", to: "/commands", external: false },
  { label: "Support", to: SUPPORT_URL, external: true },
  { label: "Terms", to: "/terms", external: false },
  { label: "Privacy", to: "/privacy", external: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkCls =
    "relative rounded-full px-3.5 py-1.5 text-sm font-medium text-fg/80 transition-colors hover:text-fg";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3.5">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
        className={`pointer-events-auto relative flex w-full items-center justify-between transition-[background-color,border-color,box-shadow,padding] duration-300 ${
          scrolled
            ? "max-w-[560px] rounded-full border border-white/10 bg-[#0d0d11]/85 px-3 py-1.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            : "max-w-[1160px] rounded-2xl border border-transparent bg-transparent px-2 py-2"
        }`}
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-full pr-2 focus-visible:outline-none"
        >
          <motion.div
            layout
            className={`relative overflow-hidden rounded-full border border-white/15 bg-surface-2 transition-transform duration-200 group-hover:scale-105 ${
              scrolled ? "h-8 w-8" : "h-9 w-9"
            }`}
          >
            <img
              src={BOT_AVATAR}
              alt={BOT_NAME}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.span
            layout
            className={`font-semibold tracking-tight text-fg transition-all ${
              scrolled ? "text-sm" : "text-base"
            }`}
          >
            {BOT_NAME}
          </motion.span>
        </Link>

        <motion.nav
          layout
          aria-label="Main"
          className={`hidden items-center md:flex ${
            scrolled
              ? "gap-0.5"
              : "gap-1 rounded-2xl border border-white/[0.07] bg-[#111115]/90 px-2 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          }`}
        >
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `${linkCls} ${
                    isActive ? "bg-white/[0.08] text-fg" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </motion.nav>

        <motion.div layout className="hidden items-center md:flex">
          <a
            href={INVITE_URL}
            className={`btn btn-accent !rounded-full transition-all ${
              scrolled
                ? "!px-4 !py-1.5 !text-xs"
                : "!px-4 !py-2 !text-sm"
            }`}
          >
            Invite
          </a>
        </motion.div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#111115]/90 text-fg md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              aria-label="Mobile"
              className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#0d0d11]/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              {NAV_ITEMS.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl px-3.5 py-2 text-sm font-medium text-fg/80 hover:bg-white/5 hover:text-fg"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3.5 py-2 text-sm font-medium text-fg/80 hover:bg-white/5 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <a
                href={INVITE_URL}
                className="btn btn-accent mt-1 justify-center !rounded-xl !py-2 text-sm"
              >
                Invite
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

