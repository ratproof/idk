import { useEffect, useState } from "react";
import type { AnchorHTMLAttributes, CSSProperties } from "react";
import { Link } from "react-router-dom";
import CardNav from "./CardNav";
import type { CardNavItem } from "./CardNav";
import { BOT_NAME, INVITE_URL, SUPPORT_URL } from "@/config";

const items: CardNavItem[] = [
  {
    label: "Explore",
    description: "Everything the bot can do.",
    links: [
      { label: "Commands", href: "/commands" },
      { label: "Embeds", href: "/embeds" },
    ],
  },
  {
    label: "Help",
    description: "Check on the bot or get a hand.",
    links: [
      { label: "Status", href: "/status" },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
  {
    label: "Legal",
    description: "The fine print.",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

// CardNav passes `href`; react-router wants `to`. Internal paths go through
// the router, external URLs (support server, invite) stay plain anchors.
type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const NavLink = ({ href, children, ...rest }: NavLinkProps) =>
  href.startsWith("/") ? (
    <Link to={href} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={href} {...rest}>
      {children}
    </a>
  );

// Match the site's dark panel colours instead of CardNav's default purple.
const theme = {
  "--cn-panel": "rgba(18, 20, 19, 0.8)",
  "--cn-solid": "#121413",
  "--cn-edge": "rgba(255, 255, 255, 0.07)",
  "--cn-tile": "linear-gradient(180deg, #1b1e1c 0%, #141716 100%)",
} as CSSProperties;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // correct state on first load / refresh mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // never hide while the menu is open
  const hidden = scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-transform duration-300 ${
        hidden ? "-translate-y-[130%]" : ""
      }`}
    >
      <CardNav
        logo={
          <img
            src="/favicon.png"
            alt=""
            width={24}
            height={24}
            className="rounded-full"
          />
        }
        logoAlt={`${BOT_NAME} home`}
        logoHref="/"
        items={items}
        cta={{ label: "Invite", href: INVITE_URL }}
        cardEffect="rise"
        openOn="click"
        linkComponent={NavLink}
        onOpenChange={setOpen}
        ariaLabel="Main"
        style={theme}
      />
    </header>
  );
}
