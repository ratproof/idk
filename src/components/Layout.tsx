import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BOT_NAME } from "@/config";

const TITLES: Record<string, string> = {
  "/": BOT_NAME,
  "/commands": "Commands",
  "/terms": "Terms",
  "/privacy": "Privacy",
};

export default function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  useEffect(() => {
    document.title = TITLES[pathname] ?? "Not Found";
  }, [pathname]);
  return (<><Navbar /><Outlet /><Footer /></>);
}
