import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const getY = () =>
  Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
    document.getElementById("root")?.scrollTop ?? 0
  );

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(getY() > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opts: ScrollToOptions = { top: 0, left: 0, behavior: reduce ? "auto" : "smooth" };
    window.scrollTo(opts);
    document.documentElement.scrollTo(opts);
    document.body.scrollTo(opts);
    document.getElementById("root")?.scrollTo(opts);
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full border border-white/[0.07] bg-[#121413]/80 text-muted backdrop-blur-xl transition-all duration-300 hover:text-fg md:bottom-13 md:right-15 md:h-22 md:w-22 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp strokeWidth={2} className="size-7 md:size-10" />
    </button>
  );
}
