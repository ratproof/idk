export default function Legal({ kind }: { kind: "terms" | "privacy" }) {
  const title = kind === "terms" ? "Terms of Service" : "Privacy Policy";
  return (
    <main className="mx-auto max-w-3xl px-4 py-28">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">Placeholder content. Replace before launch.</p>
      {["Overview", "Usage", "Contact"].map((h) => (
        <section key={h} className="mt-8"><h2 className="text-lg font-medium">{h}</h2>
          <p className="mt-2 text-zinc-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder text for the {title.toLowerCase()}.</p></section>
      ))}
    </main>
  );
}
