import { useEffect } from "react";

export default function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return <p className="px-4 py-28 text-center text-muted">Redirecting… <a href={to} className="text-accent-soft hover:underline">Click here if nothing happens</a></p>;
}
// hi
