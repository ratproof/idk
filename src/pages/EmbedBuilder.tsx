import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Copy, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import { BOT_NAME } from "@/config";

type BtnStyle = "primary" | "secondary" | "success" | "danger" | "link";

interface Field {
  id: number;
  name: string;
  value: string;
  inline: boolean;
}

interface Btn {
  id: number;
  label: string;
  style: BtnStyle;
  url: string;
  emoji: string;
  disabled: boolean;
}

interface EmbedState {
  authorName: string;
  authorIcon: string;
  title: string;
  titleUrl: string;
  description: string;
  color: string;
  thumbnail: string;
  image: string;
  footerText: string;
  footerIcon: string;
  timestamp: boolean;
}

const LIMITS = { fields: 25, buttons: 5 };

const BTN_STYLES: { id: BtnStyle; label: string; bg: string; api: number }[] = [
  { id: "primary", label: "Primary", bg: "#5865f2", api: 1 },
  { id: "secondary", label: "Secondary", bg: "#4e5058", api: 2 },
  { id: "success", label: "Success", bg: "#248046", api: 3 },
  { id: "danger", label: "Danger", bg: "#da373c", api: 4 },
  { id: "link", label: "Link", bg: "#4e5058", api: 5 },
];

const EMPTY_EMBED: EmbedState = {
  authorName: "",
  authorIcon: "",
  title: "",
  titleUrl: "",
  description: "",
  color: "#0B1933",
  thumbnail: "",
  image: "",
  footerText: "",
  footerIcon: "",
  timestamp: false,
};

const EXAMPLE_EMBED: EmbedState = {
  ...EMPTY_EMBED,
  title: "Welcome to the server",
  description:
    "Glad you're here! Read the **rules** first, then grab your roles below.\nNeed help? Open a ticket or ask in `#support`.",
  footerText: BOT_NAME,
  timestamp: true,
};

const INLINE_RE =
  /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|~~[^~]+~~|`[^`\n]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if (part.startsWith("***") && part.endsWith("***") && part.length > 6)
      return <strong key={key}><em>{part.slice(3, -3)}</em></strong>;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__") && part.length > 4)
      return <u key={key}>{part.slice(2, -2)}</u>;
    if (part.startsWith("~~") && part.endsWith("~~") && part.length > 4)
      return <s key={key}>{part.slice(2, -2)}</s>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return (
        <code key={key} className="rounded bg-[#1e1f22] px-1 py-px font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    )
      return <em key={key}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link)
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer noopener" className="text-[#00a8fc] hover:underline">
          {link[1]}
        </a>
      );
    return <Fragment key={key}>{part}</Fragment>;
  });
}

function Md({ text }: { text: string }) {
  const blocks = text.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {blocks.map((block, bi) => {
        if (block.startsWith("```") && block.endsWith("```") && block.length > 6) {
          const code = block.slice(3, -3).replace(/^[a-z]*\n/i, "");
          return (
            <pre
              key={bi}
              className="my-1 overflow-x-auto rounded border border-[#1e1f22] bg-[#1e1f22] p-2 font-mono text-[0.85em] leading-snug"
            >
              {code}
            </pre>
          );
        }
        return (
          <Fragment key={bi}>
            {block.split("\n").map((line, li, arr) => {
              const h = line.match(/^(#{1,3}) (.+)$/);
              const size = h ? ["text-[1.5em]", "text-[1.25em]", "text-[1.1em]"][h[1].length - 1] : "";
              const content = renderInline(h ? h[2] : line, `${bi}-${li}`);
              return (
                <Fragment key={li}>
                  {h ? <div className={`${size} font-bold leading-tight`}>{content}</div> : content}
                  {!h && li < arr.length - 1 && <br />}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* script generators                                                   */
/* ------------------------------------------------------------------ */

type Tab = "script" | "json" | "python";

const q = (s: string) => JSON.stringify(s);
const colorInt = (hex: string) => parseInt(hex.replace("#", "") || "0", 16) || 0;
const hasUrl = (s: string) => /^https?:\/\//i.test(s.trim());

/**
 * Bleed/Greed-style "script" syntax:  {embed}$v{title: ...}$v{field: name && value && inline}
 * If your bot parses a different syntax, this is the only function you need to edit.
 */
function toScript(content: string, e: EmbedState, fields: Field[], btns: Btn[]): string {
  const p: string[] = [];
  if (content.trim()) p.push(`{content: ${content}}`);
  p.push("{embed}");
  if (e.authorName) p.push(`{author: ${[e.authorName, e.authorIcon].filter(Boolean).join(" && ")}}`);
  if (e.title) p.push(`{title: ${e.title}}`);
  if (e.titleUrl && e.title) p.push(`{url: ${e.titleUrl}}`);
  if (e.description) p.push(`{description: ${e.description}}`);
  p.push(`{color: ${e.color}}`);
  if (e.thumbnail) p.push(`{thumbnail: ${e.thumbnail}}`);
  if (e.image) p.push(`{image: ${e.image}}`);
  fields
    .filter((f) => f.name || f.value)
    .forEach((f) => p.push(`{field: ${f.name} && ${f.value} && ${f.inline ? "true" : "false"}}`));
  if (e.footerText) p.push(`{footer: ${[e.footerText, e.footerIcon].filter(Boolean).join(" && ")}}`);
  if (e.timestamp) p.push("{timestamp: true}");
  btns
    .filter((b) => b.label || b.emoji)
    .forEach((b) =>
      p.push(
        `{button: ${[b.label, b.style, b.style === "link" ? b.url : "", b.emoji]
          .filter((x, i) => x || i < 2)
          .join(" && ")}}`
      )
    );
  return p.join("$v");
}

function toJson(content: string, e: EmbedState, fields: Field[], btns: Btn[]): string {
  const embed: Record<string, unknown> = {};
  if (e.title) embed.title = e.title;
  if (e.titleUrl && e.title) embed.url = e.titleUrl;
  if (e.description) embed.description = e.description;
  embed.color = colorInt(e.color);
  if (e.authorName)
    embed.author = { name: e.authorName, ...(e.authorIcon && { icon_url: e.authorIcon }) };
  if (e.thumbnail) embed.thumbnail = { url: e.thumbnail };
  if (e.image) embed.image = { url: e.image };
  const fs = fields.filter((f) => f.name || f.value);
  if (fs.length) embed.fields = fs.map((f) => ({ name: f.name, value: f.value, inline: f.inline }));
  if (e.footerText)
    embed.footer = { text: e.footerText, ...(e.footerIcon && { icon_url: e.footerIcon }) };
  if (e.timestamp) embed.timestamp = new Date().toISOString();

  const payload: Record<string, unknown> = {};
  if (content.trim()) payload.content = content;
  payload.embeds = [embed];
  const bs = btns.filter((b) => b.label || b.emoji);
  if (bs.length)
    payload.components = [
      {
        type: 1,
        components: bs.map((b, i) => {
          const style = BTN_STYLES.find((s) => s.id === b.style)!.api;
          return {
            type: 2,
            style,
            ...(b.label && { label: b.label }),
            ...(b.emoji && { emoji: { name: b.emoji } }),
            ...(b.style === "link" ? { url: b.url } : { custom_id: `btn_${i}` }),
            ...(b.disabled && { disabled: true }),
          };
        }),
      },
    ];
  return JSON.stringify(payload, null, 2);
}

function toPython(content: string, e: EmbedState, fields: Field[], btns: Btn[]): string {
  const args = [
    e.title && `title=${q(e.title)}`,
    e.description && `description=${q(e.description)}`,
    e.titleUrl && e.title && `url=${q(e.titleUrl)}`,
    `color=discord.Color(0x${(e.color.replace("#", "") || "000000").toUpperCase()})`,
  ].filter(Boolean);
  const L: string[] = [`embed = discord.Embed(${args.join(", ")})`];
  if (e.authorName)
    L.push(`embed.set_author(name=${q(e.authorName)}${e.authorIcon ? `, icon_url=${q(e.authorIcon)}` : ""})`);
  if (e.thumbnail) L.push(`embed.set_thumbnail(url=${q(e.thumbnail)})`);
  if (e.image) L.push(`embed.set_image(url=${q(e.image)})`);
  fields
    .filter((f) => f.name || f.value)
    .forEach((f) =>
      L.push(`embed.add_field(name=${q(f.name || "\u200b")}, value=${q(f.value || "\u200b")}, inline=${f.inline ? "True" : "False"})`)
    );
  if (e.footerText)
    L.push(`embed.set_footer(text=${q(e.footerText)}${e.footerIcon ? `, icon_url=${q(e.footerIcon)}` : ""})`);
  if (e.timestamp) L.push("embed.timestamp = discord.utils.utcnow()");

  const bs = btns.filter((b) => b.label || b.emoji);
  if (bs.length) {
    L.push("", "view = discord.ui.View()");
    bs.forEach((b, i) => {
      const a = [
        b.label && `label=${q(b.label)}`,
        b.emoji && `emoji=${q(b.emoji)}`,
        `style=discord.ButtonStyle.${b.style}`,
        b.style === "link" ? `url=${q(b.url)}` : `custom_id=${q(`btn_${i}`)}`,
        b.disabled && "disabled=True",
      ].filter(Boolean);
      L.push(`view.add_item(discord.ui.Button(${a.join(", ")}))`);
    });
  }
  const send = [content.trim() && `content=${q(content)}`, "embed=embed", bs.length && "view=view"]
    .filter(Boolean)
    .join(", ");
  L.push("", `await ctx.send(${send})`);
  return L.join("\n");
}

/* ------------------------------------------------------------------ */
/* small ui bits                                                       */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full rounded-xl border border-white/[0.07] bg-black/30 px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-white/30 focus:border-white/30";

const card =
  "rounded-[22px] border border-white/[0.07] bg-[#121413]/80 p-5 backdrop-blur-xl";

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-white/60">
      <span>{children}</span>
      {hint && <span className="text-white/30">{hint}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-white/70">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 rounded-full bg-white/10 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#5865f2] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-white/40" />
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

export default function EmbedBuilder() {
  const nextId = useRef(10);
  const id = () => nextId.current++;

  const [content, setContent] = useState("");
  const [e, setE] = useState<EmbedState>(EXAMPLE_EMBED);
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: "Rules", value: "Be kind. No spam.", inline: true },
    { id: 2, name: "Roles", value: "Pick yours in #roles", inline: true },
    { id: 3, name: "Support", value: "Open a ticket anytime.", inline: true },
  ]);
  const [btns, setBtns] = useState<Btn[]>([
    { id: 4, label: "Verify", style: "success", url: "", emoji: "", disabled: false },
    { id: 5, label: "Rules", style: "link", url: "https://example.com/rules", emoji: "", disabled: false },
  ]);
  const [tab, setTab] = useState<Tab>("script");
  const [copied, setCopied] = useState(false);

  const upd = <K extends keyof EmbedState>(k: K, v: EmbedState[K]) => setE((p) => ({ ...p, [k]: v }));
  const updField = (fid: number, patch: Partial<Field>) =>
    setFields((fs) => fs.map((f) => (f.id === fid ? { ...f, ...patch } : f)));
  const updBtn = (bid: number, patch: Partial<Btn>) =>
    setBtns((bs) => bs.map((b) => (b.id === bid ? { ...b, ...patch } : b)));

  const reset = () => {
    setContent("");
    setE(EMPTY_EMBED);
    setFields([]);
    setBtns([]);
  };

  const output = useMemo(() => {
    if (tab === "json") return toJson(content, e, fields, btns);
    if (tab === "python") return toPython(content, e, fields, btns);
    return toScript(content, e, fields, btns);
  }, [tab, content, e, fields, btns]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked, user can select manually */
    }
  };

  const hasEmbed =
    e.title || e.description || e.authorName || e.footerText || e.image || e.thumbnail || fields.some((f) => f.name || f.value);

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // group fields into rows like discord does: consecutive inline fields, max 3 per row
  const rows = useMemo(() => {
    const out: Field[][] = [];
    for (const f of fields.filter((x) => x.name || x.value)) {
      const last = out[out.length - 1];
      if (f.inline && last && last[0].inline && last.length < 3) last.push(f);
      else out.push([f]);
    }
    return out;
  }, [fields]);

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg md:text-4xl">Embed builder</h1>
          <p className="mt-2 max-w-xl text-white/60">
            Design an embed with fields and buttons, see it exactly how Discord shows it, then copy the script.
          </p>
        </div>
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#121413]/80 px-4 py-2 text-sm font-medium text-fg transition-colors hover:text-accent-soft">
          <RotateCcw size={15} /> Clear all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ----------------------------- editor ----------------------------- */}
        <div className="space-y-6">
          <section className={card}>
            <Label hint={`${content.length}/2000`}>Message content</Label>
            <textarea
              value={content}
              onChange={(ev) => setContent(ev.target.value)}
              maxLength={2000}
              rows={2}
              placeholder="Text above the embed (optional)"
              className={`${inputCls} resize-y`}
            />
          </section>

          <section className={`${card} space-y-4`}>
            <h2 className="font-semibold text-fg">Embed</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Author name</Label>
                <input className={inputCls} maxLength={256} value={e.authorName} onChange={(ev) => upd("authorName", ev.target.value)} placeholder="Author" />
              </div>
              <div>
                <Label>Author icon URL</Label>
                <input className={inputCls} value={e.authorIcon} onChange={(ev) => upd("authorIcon", ev.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label hint={`${e.title.length}/256`}>Title</Label>
                <input className={inputCls} maxLength={256} value={e.title} onChange={(ev) => upd("title", ev.target.value)} placeholder="Title" />
              </div>
              <div>
                <Label>Title URL</Label>
                <input className={inputCls} value={e.titleUrl} onChange={(ev) => upd("titleUrl", ev.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div>
              <Label hint={`${e.description.length}/4096`}>Description</Label>
              <textarea
                className={`${inputCls} resize-y`}
                rows={5}
                maxLength={4096}
                value={e.description}
                onChange={(ev) => upd("description", ev.target.value)}
                placeholder="Supports **bold**, *italic*, __underline__, ~~strike~~, `code` and [links](https://...)"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
              <div>
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={e.color}
                    onChange={(ev) => upd("color", ev.target.value)}
                    aria-label="Embed color"
                    className="h-[42px] w-12 cursor-pointer rounded-xl border border-white/[0.07] bg-black/30 p-1"
                  />
                  <input
                    className={`${inputCls} w-28 font-mono`}
                    value={e.color}
                    maxLength={7}
                    onChange={(ev) => upd("color", ev.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Thumbnail URL</Label>
                <input className={inputCls} value={e.thumbnail} onChange={(ev) => upd("thumbnail", ev.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Image URL</Label>
                <input className={inputCls} value={e.image} onChange={(ev) => upd("image", ev.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label hint={`${e.footerText.length}/2048`}>Footer text</Label>
                <input className={inputCls} maxLength={2048} value={e.footerText} onChange={(ev) => upd("footerText", ev.target.value)} placeholder="Footer" />
              </div>
              <div>
                <Label>Footer icon URL</Label>
                <input className={inputCls} value={e.footerIcon} onChange={(ev) => upd("footerIcon", ev.target.value)} placeholder="https://..." />
              </div>
            </div>

            <Toggle checked={e.timestamp} onChange={(v) => upd("timestamp", v)}>
              Show timestamp
            </Toggle>
          </section>

          {/* fields */}
          <section className={`${card} space-y-3`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-fg">
                Fields <span className="text-sm font-normal text-white/40">{fields.length}/{LIMITS.fields}</span>
              </h2>
              <button
                disabled={fields.length >= LIMITS.fields}
                onClick={() => setFields((fs) => [...fs, { id: id(), name: "", value: "", inline: true }])}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent-soft disabled:opacity-40"
              >
                <Plus size={16} /> Add field
              </button>
            </div>
            {fields.length === 0 && <p className="text-sm text-white/40">No fields yet.</p>}
            {fields.map((f, i) => (
              <div key={f.id} className="space-y-2 rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-xs text-white/30">{i + 1}</span>
                  <input
                    className={inputCls}
                    maxLength={256}
                    value={f.name}
                    onChange={(ev) => updField(f.id, { name: ev.target.value })}
                    placeholder="Field name"
                  />
                  <button
                    onClick={() => setFields((fs) => fs.filter((x) => x.id !== f.id))}
                    aria-label={`Remove field ${i + 1}`}
                    className="shrink-0 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  className={`${inputCls} resize-y`}
                  rows={2}
                  maxLength={1024}
                  value={f.value}
                  onChange={(ev) => updField(f.id, { value: ev.target.value })}
                  placeholder="Field value"
                />
                <Toggle checked={f.inline} onChange={(v) => updField(f.id, { inline: v })}>
                  Inline
                </Toggle>
              </div>
            ))}
          </section>

          {/* buttons */}
          <section className={`${card} space-y-3`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-fg">
                Buttons <span className="text-sm font-normal text-white/40">{btns.length}/{LIMITS.buttons}</span>
              </h2>
              <button
                disabled={btns.length >= LIMITS.buttons}
                onClick={() =>
                  setBtns((bs) => [...bs, { id: id(), label: "Button", style: "primary", url: "", emoji: "", disabled: false }])
                }
                className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent-soft disabled:opacity-40"
              >
                <Plus size={16} /> Add button
              </button>
            </div>
            {btns.length === 0 && <p className="text-sm text-white/40">No buttons yet.</p>}
            {btns.map((b, i) => (
              <div key={b.id} className="space-y-2 rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_5rem_auto]">
                  <input
                    className={inputCls}
                    maxLength={80}
                    value={b.label}
                    onChange={(ev) => updBtn(b.id, { label: ev.target.value })}
                    placeholder="Label"
                  />
                  <select
                    className={inputCls}
                    value={b.style}
                    onChange={(ev) => updBtn(b.id, { style: ev.target.value as BtnStyle })}
                    aria-label="Button style"
                  >
                    {BTN_STYLES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#121413]">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className={inputCls}
                    value={b.emoji}
                    onChange={(ev) => updBtn(b.id, { emoji: ev.target.value })}
                    placeholder="😀"
                    aria-label="Emoji"
                  />
                  <button
                    onClick={() => setBtns((bs) => bs.filter((x) => x.id !== b.id))}
                    aria-label={`Remove button ${i + 1}`}
                    className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {b.style === "link" && (
                  <input
                    className={inputCls}
                    value={b.url}
                    onChange={(ev) => updBtn(b.id, { url: ev.target.value })}
                    placeholder="https://..."
                  />
                )}
                <Toggle checked={b.disabled} onChange={(v) => updBtn(b.id, { disabled: v })}>
                  Disabled
                </Toggle>
              </div>
            ))}
          </section>
        </div>

        {/* ----------------------------- preview ----------------------------- */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <section className={card}>
            <h2 className="mb-3 font-semibold text-fg">Preview</h2>

            {/* discord message */}
            <div className="overflow-hidden rounded-xl bg-[#313338] p-4 font-[gg_sans,'Noto_Sans','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[#dbdee1]">
              <div className="flex gap-4">
                <img src="/favicon.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-medium text-white">{BOT_NAME}</span>
                    <span className="rounded bg-[#5865f2] px-1.5 py-px text-[10px] font-semibold uppercase leading-[15px] text-white">App</span>
                    <span className="text-xs text-[#949ba4]">Today at {time}</span>
                  </div>

                  {content && (
                    <div className="mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-[1.375]">
                      <Md text={content} />
                    </div>
                  )}

                  {hasEmbed && (
                    <div
                      className="mt-1.5 grid max-w-[520px] rounded border border-[#1e1f22] border-l-4 bg-[#2b2d31] py-2 pl-3 pr-4 pb-4"
                      style={{ borderLeftColor: e.color }}
                    >
                      <div className="flex gap-4">
                        <div className="min-w-0 flex-1 space-y-2">
                          {e.authorName && (
                            <div className="mt-1 flex items-center gap-2">
                              {hasUrl(e.authorIcon) && (
                                <img src={e.authorIcon} alt="" className="h-6 w-6 rounded-full object-cover" />
                              )}
                              <span className="text-sm font-semibold text-white">{e.authorName}</span>
                            </div>
                          )}

                          {e.title &&
                            (hasUrl(e.titleUrl) ? (
                              <a href={e.titleUrl} target="_blank" rel="noreferrer noopener" className="block break-words text-base font-semibold text-[#00a8fc] hover:underline">
                                {e.title}
                              </a>
                            ) : (
                              <div className="break-words text-base font-semibold text-white">{e.title}</div>
                            ))}

                          {e.description && (
                            <div className="whitespace-pre-wrap break-words text-sm leading-[1.375]">
                              <Md text={e.description} />
                            </div>
                          )}

                          {rows.length > 0 && (
                            <div className="space-y-2">
                              {rows.map((row, ri) => (
                                <div key={ri} className="grid gap-x-3 gap-y-2" style={{ gridTemplateColumns: `repeat(${row[0].inline ? 3 : 1}, minmax(0, 1fr))` }}>
                                  {row.map((f) => (
                                    <div key={f.id} className="min-w-0">
                                      {f.name && <div className="break-words text-sm font-semibold text-white">{f.name}</div>}
                                      {f.value && (
                                        <div className="whitespace-pre-wrap break-words text-sm leading-[1.375]">
                                          <Md text={f.value} />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {hasUrl(e.thumbnail) && (
                          <img src={e.thumbnail} alt="" className="mt-1 h-20 w-20 shrink-0 rounded object-cover" />
                        )}
                      </div>

                      {hasUrl(e.image) && (
                        <img src={e.image} alt="" className="mt-4 max-h-[300px] w-full rounded object-cover" />
                      )}

                      {(e.footerText || e.timestamp) && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#b5bac1]">
                          {e.footerText && hasUrl(e.footerIcon) && (
                            <img src={e.footerIcon} alt="" className="h-5 w-5 rounded-full object-cover" />
                          )}
                          <span className="font-medium">
                            {e.footerText}
                            {e.footerText && e.timestamp && " • "}
                            {e.timestamp && `Today at ${time}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {btns.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {btns.map((b) => {
                        const st = BTN_STYLES.find((s) => s.id === b.style)!;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            tabIndex={-1}
                            style={{ backgroundColor: st.bg }}
                            className={`inline-flex h-8 items-center gap-1.5 rounded px-4 text-sm font-medium text-white transition-[filter] ${
                              b.disabled ? "cursor-not-allowed opacity-50" : "hover:brightness-90"
                            }`}
                          >
                            {b.emoji && <span>{b.emoji}</span>}
                            {b.label}
                            {b.style === "link" && <ExternalLink size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* script box */}
          <section className={card}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div role="tablist" aria-label="Output format" className="flex gap-1 rounded-xl bg-black/30 p-1">
                {(["script", "json", "python"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      tab === t ? "bg-white/10 text-fg" : "text-white/50 hover:text-fg"
                    }`}
                  >
                    {t === "script" ? "Script" : t === "json" ? "JSON" : "discord.py"}
                  </button>
                ))}
              </div>
              <button onClick={copy} className="btn btn-accent inline-flex items-center gap-2 !py-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/[0.07] bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-white/80">
              {output}
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}
