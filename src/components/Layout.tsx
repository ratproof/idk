import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BOT_NAME } from "@/config";

export default function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  useEffect(() => {
    document.title = pathname === "/commands" ? `Commands | ${BOT_NAME}` : `${BOT_NAME} | Discord bot for moderation, voice and giveaways`;
  }, [pathname]);
  return (<><Navbar /><Outlet /><Footer /></>);
}
