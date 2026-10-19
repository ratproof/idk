import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { INVITE_URL, SUPPORT_URL } from "@/config";
import Layout from "@/components/Layout";
import BackToTop from "@/components/BackToTop";
import Home from "@/pages/Home";
import EmbedBuilder from "@/pages/EmbedBuilder";
function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return <p className="px-4 py-28 text-center text-muted">Redirecting… <a href={to} className="text-accent-soft hover:underline">Click here if nothing happens</a></p>;
}

const Commands = lazy(() => import("@/pages/Commands"));
const Status = lazy(() => import("@/pages/Status"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/status" element={<Status />} />
          <Route path="/help" element={<Navigate to="/commands" replace />} />
          <Route path="/support" element={<ExternalRedirect to={SUPPORT_URL} />} />
          <Route path="/invite" element={<ExternalRedirect to={INVITE_URL} />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/tos" element={<Navigate to="/terms" replace />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/embeds" element={<EmbedBuilder />} />
          <Route path="/embed" element={<Navigate to="/embeds" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <BackToTop />
    </Suspense>
  );
}
