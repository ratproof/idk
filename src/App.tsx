import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { INVITE_URL, SUPPORT_URL } from "@/config";
import ExternalRedirect from "@/components/ExternalRedirect";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
const Commands = lazy(() => import("@/pages/Commands"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/help" element={<Navigate to="/commands" replace />} />
          <Route path="/support" element={<ExternalRedirect to={SUPPORT_URL} />} />
          <Route path="/invite" element={<ExternalRedirect to={INVITE_URL} />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
