import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[7rem] font-bold leading-none tracking-tight sm:text-[9rem]">404</h1>
      <p className="mt-4 text-xl text-muted">Page not found</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/[0.06] px-6 py-4 font-medium transition-colors hover:bg-white/10">
        <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />Go back
      </Link>
    </main>
  );
}
