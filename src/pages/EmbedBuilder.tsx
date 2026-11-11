import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Columns2,
  Copy,
  ExternalLink,
  Images,
  Minus,
  MousePointerClick,
  Plus,
  RotateCcw,
  Trash2,
  Type,
} from "lucide-react";
import { BOT_NAME } from "@/config";

type BtnStyle = "primary" | "secondary" | "success" | "danger" | "link";
type Mode = "embed" | "container";

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

type Comp =
  | { id: number; type: "text"; content: string }
  | { id: number; type: "section"; content: string; accessory: "thumbnail" | "button"; thumb: string; btn: Btn }
  | { id: number; type: "separator"; divider: boolean; large: boolean }
  | { id: number; type: "gallery"; urls: string[] }
  | { id: number; type: "buttons"; btns: Btn[] };

interface ContainerState {
  accent: boolean;
  color: string;
  spoiler: boolean;
}

const LIMITS = { fields: 25, buttons: 5 };
const CT_LIMITS = { components: 40, gallery: 10, text: 4000, buttons: 5 };
const V2_FLAG = 1 << 15;

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

const newBtn = (id: number, over: Partial<Btn> = {}): Btn => ({
  id,
  label: "Button",
  style: "primary",
  url: "",
  emoji: "",
  disabled: false,
  ...over,
});

const EMPTY_CT: ContainerState = { accent: true, color: "#0B1933", spoiler: false };

const exampleComps = (): Comp[] => [
  {
    id: 1,
    type: "text",
    content: "## Welcome to the server\nGlad you're here! Read the **rules** first, then grab your roles below.",
  },
  { id: 2, type: "separator", divider: true, large: false },
  {
    id: 3,
    type: "section",
    content: "**Rules**\nBe kind. No spam.",
    accessory: "button",
    thumb: "",
    btn: newBtn(0, { label: "Read", style: "link", url: "https://example.com/rules" }),
  },
  { id: 4, type: "buttons", btns: [newBtn(5, { label: "Verify", style: "success" })] },
];

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
const btnReady = (b: Btn) => !!(b.label || b.emoji);

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
/* components v2 container generators                                  */
/* ------------------------------------------------------------------ */

function btnJson(b: Btn, cid: string) {
  const style = BTN_STYLES.find((s) => s.id === b.style)!.api;
  return {
    type: 2,
    style,
    ...(b.label && { label: b.label }),
    ...(b.emoji && { emoji: { name: b.emoji } }),
    ...(b.style === "link" ? { url: b.url } : { custom_id: cid }),
    ...(b.disabled && { disabled: true }),
  };
}

function compJson(c: Comp): Record<string, unknown> | null {
  switch (c.type) {
    case "text":
      return c.content.trim() ? { type: 10, content: c.content } : null;
    case "section": {
      if (!c.content.trim()) return null;
      const text = { type: 10, content: c.content };
      // sections need an accessory, fall back to plain text if it's empty
      if (c.accessory === "thumbnail") {
        if (!c.thumb.trim()) return text;
        return { type: 9, components: [text], accessory: { type: 11, media: { url: c.thumb } } };
      }
      if (!btnReady(c.btn)) return text;
      return { type: 9, components: [text], accessory: btnJson(c.btn, `sec_${c.id}`) };
    }
    case "separator":
      return { type: 14, divider: c.divider, spacing: c.large ? 2 : 1 };
    case "gallery": {
      const urls = c.urls.filter((u) => u.trim());
      return urls.length ? { type: 12, items: urls.map((u) => ({ media: { url: u } })) } : null;
    }
    case "buttons": {
      const bs = c.btns.filter(btnReady);
      return bs.length ? { type: 1, components: bs.map((b, i) => btnJson(b, `btn_${c.id}_${i}`)) } : null;
    }
  }
}

function toContainerJson(ct: ContainerState, comps: Comp[]): string {
  const container = {
    type: 17,
    ...(ct.accent && { accent_color: colorInt(ct.color) }),
    ...(ct.spoiler && { spoiler: true }),
    components: comps.map(compJson).filter(Boolean),
  };
  return JSON.stringify({ flags: V2_FLAG, components: [container] }, null, 2);
}

function btnPy(b: Btn, cid: string) {
  const a = [
    b.label && `label=${q(b.label)}`,
    b.emoji && `emoji=${q(b.emoji)}`,
    `style=discord.ButtonStyle.${b.style}`,
    b.style === "link" ? `url=${q(b.url)}` : `custom_id=${q(cid)}`,
    b.disabled && "disabled=True",
  ].filter(Boolean);
  return `discord.ui.Button(${a.join(", ")})`;
}

/** needs discord.py 2.6+ for LayoutView and friends */
function toContainerPython(ct: ContainerState, comps: Comp[]): string {
  const args = [
    ct.accent && `accent_colour=discord.Colour(0x${(ct.color.replace("#", "") || "000000").toUpperCase()})`,
    ct.spoiler && "spoiler=True",
  ].filter(Boolean);
  const L: string[] = ["view = discord.ui.LayoutView()", `container = discord.ui.Container(${args.join(", ")})`, ""];

  comps.forEach((c) => {
    switch (c.type) {
      case "text":
        if (c.content.trim()) L.push(`container.add_item(discord.ui.TextDisplay(${q(c.content)}))`);
        break;
      case "section": {
        if (!c.content.trim()) break;
        if (c.accessory === "thumbnail" && c.thumb.trim())
          L.push(`container.add_item(discord.ui.Section(${q(c.content)}, accessory=discord.ui.Thumbnail(${q(c.thumb)})))`);
        else if (c.accessory === "button" && btnReady(c.btn))
          L.push(`container.add_item(discord.ui.Section(${q(c.content)}, accessory=${btnPy(c.btn, `sec_${c.id}`)}))`);
        else L.push(`container.add_item(discord.ui.TextDisplay(${q(c.content)}))`);
        break;
      }
      case "separator":
        L.push(
          `container.add_item(discord.ui.Separator(visible=${c.divider ? "True" : "False"}, spacing=discord.SeparatorSpacing.${c.large ? "large" : "small"}))`
        );
        break;
      case "gallery": {
        const urls = c.urls.filter((u) => u.trim());
        if (urls.length)
          L.push(
            `container.add_item(discord.ui.MediaGallery(${urls.map((u) => `discord.MediaGalleryItem(${q(u)})`).join(", ")}))`
          );
        break;
      }
      case "buttons": {
        const bs = c.btns.filter(btnReady);
        if (!bs.length) break;
        L.push(`row_${c.id} = discord.ui.ActionRow()`);
        bs.forEach((b, i) => L.push(`row_${c.id}.add_item(${btnPy(b, `btn_${c.id}_${i}`)})`));
        L.push(`container.add_item(row_${c.id})`);
        break;
      }
    }
  });

  L.push("", "view.add_item(container)", "", "await ctx.send(view=view)");
  return L.join("\n");
}

/**
 * Script syntax for containers. This is a guess in the same style as toScript,
 * edit this one function if your bot parses something different.
 */
function toContainerScript(ct: ContainerState, comps: Comp[]): string {
  const p: string[] = ["{container}"];
  if (ct.accent) p.push(`{color: ${ct.color}}`);
  if (ct.spoiler) p.push("{spoiler: true}");
  comps.forEach((c) => {
    switch (c.type) {
      case "text":
        if (c.content.trim()) p.push(`{text: ${c.content}}`);
        break;
      case "section":
        if (!c.content.trim()) break;
        if (c.accessory === "thumbnail" && c.thumb.trim()) p.push(`{section: ${c.content} && thumbnail && ${c.thumb}}`);
        else if (c.accessory === "button" && btnReady(c.btn))
          p.push(
            `{section: ${[c.content, "button", c.btn.label, c.btn.style, c.btn.style === "link" ? c.btn.url : "", c.btn.emoji]
              .filter((x, i) => x || i < 4)
              .join(" && ")}}`
          );
        else p.push(`{text: ${c.content}}`);
        break;
      case "separator":
        p.push(`{separator: ${c.divider ? "true" : "false"} && ${c.large ? "large" : "small"}}`);
        break;
      case "gallery": {
        const urls = c.urls.filter((u) => u.trim());
        if (urls.length) p.push(`{gallery: ${urls.join(" && ")}}`);
        break;
      }
      case "buttons":
        c.btns.filter(btnReady).forEach((b) =>
          p.push(
            `{button: ${[b.label, b.style, b.style === "link" ? b.url : "", b.emoji]
              .filter((x, i) => x || i < 2)
              .join(" && ")}}`
          )
        );
        break;
    }
  });
  return p.join("$v");
}

/* ------------------------------------------------------------------ */
/* small ui bits                                                       */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-white/30 focus:border-[#538CE5]/70";

const panelCls = "rounded-2xl border border-white/[0.07] bg-[#121413]/80 p-5 backdrop-blur-xl";

function Panel({ title, count, action, children }: { title?: string; count?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className={panelCls}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg">
            {title}
            {count && <span className="ml-2 font-normal text-white/40">{count}</span>}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3 border-t border-white/[0.06] pt-5 first:border-t-0 first:pt-0">
      <div className="text-[11px] font-medium uppercase tracking-wider text-white/40">{title}</div>
      {children}
    </div>
  );
}

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between text-xs text-white/50">
      <span>{children}</span>
      {hint && <span className="text-white/30">{hint}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-white/70">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 rounded-full bg-white/10 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#538CE5] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-white/40" />
      {children}
    </label>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 disabled:opacity-30 ${
        danger ? "hover:text-red-400" : "hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function AddBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-accent-soft disabled:opacity-40"
    >
      <Plus size={15} /> {children}
    </button>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-0.5 rounded-lg bg-black/30 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id ? "bg-white/10 text-fg" : "text-white/50 hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        aria-label={label}
        className="h-9 w-10 cursor-pointer rounded-lg border border-white/[0.08] bg-black/25 p-1"
      />
      <input
        className={`${inputCls} w-24 font-mono`}
        value={value}
        maxLength={7}
        onChange={(ev) => onChange(ev.target.value)}
        aria-label={`${label} hex`}
      />
    </div>
  );
}

function PreviewBtn({ b }: { b: Btn }) {
  const st = BTN_STYLES.find((s) => s.id === b.style)!;
  return (
    <button
      type="button"
      tabIndex={-1}
      style={{ backgroundColor: st.bg }}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded px-4 text-sm font-medium text-white transition-[filter] ${
        b.disabled ? "cursor-not-allowed opacity-50" : "hover:brightness-90"
      }`}
    >
      {b.emoji && <span>{b.emoji}</span>}
      {b.label}
      {b.style === "link" && <ExternalLink size={14} />}
    </button>
  );
}

function BtnRow({ b, onChange, onRemove }: { b: Btn; onChange: (p: Partial<Btn>) => void; onRemove?: () => void }) {
  return (
    <div className="space-y-2">
      <div className={`grid items-center gap-2 ${onRemove ? "sm:grid-cols-[1fr_8rem_4.5rem_auto]" : "sm:grid-cols-[1fr_8rem_4.5rem]"}`}>
        <input className={inputCls} maxLength={80} value={b.label} onChange={(ev) => onChange({ label: ev.target.value })} placeholder="Label" />
        <select className={inputCls} value={b.style} onChange={(ev) => onChange({ style: ev.target.value as BtnStyle })} aria-label="Button style">
          {BTN_STYLES.map((s) => (
            <option key={s.id} value={s.id} className="bg-[#121413]">
              {s.label}
            </option>
          ))}
        </select>
        <input className={inputCls} value={b.emoji} onChange={(ev) => onChange({ emoji: ev.target.value })} placeholder="Emoji" aria-label="Emoji" />
        {onRemove && (
          <IconBtn label="Remove button" onClick={onRemove} danger>
            <Trash2 size={16} />
          </IconBtn>
        )}
      </div>
      {b.style === "link" && (
        <input className={inputCls} value={b.url} onChange={(ev) => onChange({ url: ev.target.value })} placeholder="https://..." />
      )}
      <Toggle checked={b.disabled} onChange={(v) => onChange({ disabled: v })}>
        Disabled
      </Toggle>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* container editor + preview                                          */
/* ------------------------------------------------------------------ */

const COMP_META: Record<Comp["type"], { label: string; icon: ReactNode }> = {
  text: { label: "Text", icon: <Type size={15} /> },
  section: { label: "Section", icon: <Columns2 size={15} /> },
  separator: { label: "Separator", icon: <Minus size={15} /> },
  gallery: { label: "Gallery", icon: <Images size={15} /> },
  buttons: { label: "Buttons", icon: <MousePointerClick size={15} /> },
};

function ContainerEditor({
  ct,
  setCt,
  comps,
  setComps,
  newId,
}: {
  ct: ContainerState;
  setCt: (fn: (p: ContainerState) => ContainerState) => void;
  comps: Comp[];
  setComps: (fn: (p: Comp[]) => Comp[]) => void;
  newId: () => number;
}) {
  const upd = (cid: number, patch: Partial<Comp>) =>
    setComps((cs) => cs.map((c) => (c.id === cid ? ({ ...c, ...patch } as Comp) : c)));
  const del = (cid: number) => setComps((cs) => cs.filter((c) => c.id !== cid));
  const move = (i: number, d: -1 | 1) =>
    setComps((cs) => {
      const j = i + d;
      if (j < 0 || j >= cs.length) return cs;
      const n = [...cs];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const make = (type: Comp["type"]): Comp => {
    const id = newId();
    switch (type) {
      case "text":
        return { id, type: "text", content: "" };
      case "section":
        return { id, type: "section", content: "", accessory: "thumbnail", thumb: "", btn: newBtn(newId()) };
      case "separator":
        return { id, type: "separator", divider: true, large: false };
      case "gallery":
        return { id, type: "gallery", urls: [""] };
      case "buttons":
        return { id, type: "buttons", btns: [newBtn(newId())] };
    }
  };

  const textLen = comps.reduce(
    (n, c) => n + (c.type === "text" || c.type === "section" ? c.content.length : 0),
    0
  );

  return (
    <div className="space-y-6">
      <Panel title="Container">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Toggle checked={ct.accent} onChange={(v) => setCt((p) => ({ ...p, accent: v }))}>
              Accent color
            </Toggle>
            <Toggle checked={ct.spoiler} onChange={(v) => setCt((p) => ({ ...p, spoiler: v }))}>
              Spoiler
            </Toggle>
          </div>
          {ct.accent && (
            <div>
              <Label>Color</Label>
              <ColorField value={ct.color} onChange={(v) => setCt((p) => ({ ...p, color: v }))} label="Accent color" />
            </div>
          )}
          <p className="text-xs text-white/40">
            Container messages can't have message content or embeds. Text across all components: {textLen}/{CT_LIMITS.text}
          </p>
        </div>
      </Panel>

      <Panel title="Components" count={`${comps.length}/${CT_LIMITS.components}`}>
        {comps.length === 0 && <p className="text-sm text-white/40">Nothing in the container yet.</p>}

        <div className="space-y-3">
          {comps.map((c, i) => (
            <div key={c.id} className="space-y-3 rounded-xl bg-black/20 p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
                  {COMP_META[c.type].icon} {COMP_META[c.type].label}
                </span>
                <div className="flex items-center">
                  <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronUp size={16} />
                  </IconBtn>
                  <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === comps.length - 1}>
                    <ChevronDown size={16} />
                  </IconBtn>
                  <IconBtn label="Remove component" onClick={() => del(c.id)} danger>
                    <Trash2 size={16} />
                  </IconBtn>
                </div>
              </div>

              {c.type === "text" && (
                <textarea
                  className={`${inputCls} resize-y`}
                  rows={4}
                  maxLength={CT_LIMITS.text}
                  value={c.content}
                  onChange={(ev) => upd(c.id, { content: ev.target.value })}
                  placeholder="Supports # headers, **bold**, *italic*, __underline__, ~~strike~~, `code` and [links](https://...)"
                />
              )}

              {c.type === "section" && (
                <>
                  <textarea
                    className={`${inputCls} resize-y`}
                    rows={3}
                    maxLength={CT_LIMITS.text}
                    value={c.content}
                    onChange={(ev) => upd(c.id, { content: ev.target.value })}
                    placeholder="Section text"
                  />
                  <div>
                    <Label>Accessory</Label>
                    <select
                      className={inputCls}
                      value={c.accessory}
                      onChange={(ev) => upd(c.id, { accessory: ev.target.value as "thumbnail" | "button" })}
                      aria-label="Accessory type"
                    >
                      <option value="thumbnail" className="bg-[#121413]">
                        Thumbnail
                      </option>
                      <option value="button" className="bg-[#121413]">
                        Button
                      </option>
                    </select>
                  </div>
                  {c.accessory === "thumbnail" ? (
                    <input
                      className={inputCls}
                      value={c.thumb}
                      onChange={(ev) => upd(c.id, { thumb: ev.target.value })}
                      placeholder="Thumbnail URL https://..."
                    />
                  ) : (
                    <BtnRow b={c.btn} onChange={(p) => upd(c.id, { btn: { ...c.btn, ...p } })} />
                  )}
                </>
              )}

              {c.type === "separator" && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Toggle checked={c.divider} onChange={(v) => upd(c.id, { divider: v })}>
                    Show divider line
                  </Toggle>
                  <Toggle checked={c.large} onChange={(v) => upd(c.id, { large: v })}>
                    Large spacing
                  </Toggle>
                </div>
              )}

              {c.type === "gallery" && (
                <div className="space-y-2">
                  {c.urls.map((u, ui) => (
                    <div key={ui} className="flex items-center gap-2">
                      <input
                        className={inputCls}
                        value={u}
                        onChange={(ev) => upd(c.id, { urls: c.urls.map((x, xi) => (xi === ui ? ev.target.value : x)) })}
                        placeholder="Image URL https://..."
                      />
                      <IconBtn
                        label={`Remove image ${ui + 1}`}
                        onClick={() => upd(c.id, { urls: c.urls.filter((_, xi) => xi !== ui) })}
                        danger
                      >
                        <Trash2 size={16} />
                      </IconBtn>
                    </div>
                  ))}
                  <AddBtn disabled={c.urls.length >= CT_LIMITS.gallery} onClick={() => upd(c.id, { urls: [...c.urls, ""] })}>
                    Add image <span className="text-white/40">{c.urls.length}/{CT_LIMITS.gallery}</span>
                  </AddBtn>
                </div>
              )}

              {c.type === "buttons" && (
                <div className="space-y-2">
                  <div className="divide-y divide-white/[0.06]">
                    {c.btns.map((b) => (
                      <div key={b.id} className="py-3 first:pt-0 last:pb-0">
                        <BtnRow
                          b={b}
                          onChange={(p) => upd(c.id, { btns: c.btns.map((x) => (x.id === b.id ? { ...x, ...p } : x)) })}
                          onRemove={() => upd(c.id, { btns: c.btns.filter((x) => x.id !== b.id) })}
                        />
                      </div>
                    ))}
                  </div>
                  <AddBtn disabled={c.btns.length >= CT_LIMITS.buttons} onClick={() => upd(c.id, { btns: [...c.btns, newBtn(newId())] })}>
                    Add button <span className="text-white/40">{c.btns.length}/{CT_LIMITS.buttons}</span>
                  </AddBtn>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1 border-t border-white/[0.06] pt-4">
          {(Object.keys(COMP_META) as Comp["type"][]).map((t) => (
            <AddBtn key={t} disabled={comps.length >= CT_LIMITS.components} onClick={() => setComps((cs) => [...cs, make(t)])}>
              {COMP_META[t].label}
            </AddBtn>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ContainerPreview({ ct, comps }: { ct: ContainerState; comps: Comp[] }) {
  const visible = comps.filter((c) => compJson(c) !== null || c.type === "separator");
  if (visible.length === 0) return null;
  return (
    <div
      className={`relative mt-1.5 max-w-[520px] space-y-2 overflow-hidden rounded-lg border border-[#1e1f22] bg-[#2b2d31] p-4 ${
        ct.accent ? "border-l-4" : ""
      }`}
      style={ct.accent ? { borderLeftColor: ct.color } : undefined}
    >
      {ct.spoiler && (
        <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-px text-[10px] font-semibold uppercase text-white/70">
          Spoiler
        </span>
      )}
      {visible.map((c) => {
        switch (c.type) {
          case "text":
            return (
              <div key={c.id} className="whitespace-pre-wrap break-words text-sm leading-[1.375]">
                <Md text={c.content} />
              </div>
            );
          case "section":
            return (
              <div key={c.id} className="flex items-center gap-4">
                <div className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-[1.375]">
                  <Md text={c.content} />
                </div>
                {c.accessory === "thumbnail" && hasUrl(c.thumb) && (
                  <img src={c.thumb} alt="" className="h-20 w-20 shrink-0 rounded object-cover" />
                )}
                {c.accessory === "button" && btnReady(c.btn) && <PreviewBtn b={c.btn} />}
              </div>
            );
          case "separator":
            return (
              <div key={c.id} className={c.large ? "py-2" : "py-0.5"}>
                {c.divider && <div className="h-px bg-white/10" />}
              </div>
            );
          case "gallery": {
            const urls = c.urls.filter(hasUrl);
            if (!urls.length) return null;
            return (
              <div
                key={c.id}
                className="grid gap-1 overflow-hidden rounded-lg"
                style={{ gridTemplateColumns: `repeat(${urls.length === 1 ? 1 : 2}, minmax(0, 1fr))` }}
              >
                {urls.map((u, i) => (
                  <img key={i} src={u} alt="" className={`w-full object-cover ${urls.length === 1 ? "max-h-[300px]" : "h-32"}`} />
                ))}
              </div>
            );
          }
          case "buttons": {
            const bs = c.btns.filter(btnReady);
            if (!bs.length) return null;
            return (
              <div key={c.id} className="flex flex-wrap gap-2">
                {bs.map((b) => (
                  <PreviewBtn key={b.id} b={b} />
                ))}
              </div>
            );
          }
        }
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

export default function EmbedBuilder() {
  const nextId = useRef(10);
  const id = () => nextId.current++;

  const [mode, setMode] = useState<Mode>("embed");

  // embed mode
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

  // container (components v2) mode
  const [ct, setCt] = useState<ContainerState>(EMPTY_CT);
  const [comps, setComps] = useState<Comp[]>(exampleComps);

  const [tab, setTab] = useState<Tab>("script");
  const [copied, setCopied] = useState(false);

  const upd = <K extends keyof EmbedState>(k: K, v: EmbedState[K]) => setE((p) => ({ ...p, [k]: v }));
  const updField = (fid: number, patch: Partial<Field>) =>
    setFields((fs) => fs.map((f) => (f.id === fid ? { ...f, ...patch } : f)));
  const updBtn = (bid: number, patch: Partial<Btn>) =>
    setBtns((bs) => bs.map((b) => (b.id === bid ? { ...b, ...patch } : b)));

  const reset = () => {
    if (mode === "container") {
      setCt(EMPTY_CT);
      setComps([]);
      return;
    }
    setContent("");
    setE(EMPTY_EMBED);
    setFields([]);
    setBtns([]);
  };

  const output = useMemo(() => {
    if (mode === "container") {
      if (tab === "json") return toContainerJson(ct, comps);
      if (tab === "python") return toContainerPython(ct, comps);
      return toContainerScript(ct, comps);
    }
    if (tab === "json") return toJson(content, e, fields, btns);
    if (tab === "python") return toPython(content, e, fields, btns);
    return toScript(content, e, fields, btns);
  }, [mode, ct, comps, tab, content, e, fields, btns]);

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
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg md:text-4xl">Embed builder</h1>
          <p className="mt-2 max-w-xl text-white/60">
            {mode === "embed"
              ? "Design an embed with fields and buttons, see it exactly how Discord shows it, then copy the script."
              : "Build a components v2 container with text, sections, galleries and buttons, then copy the script."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Message type"
            value={mode}
            onChange={setMode}
            options={[
              { id: "embed", label: "Embed" },
              { id: "container", label: "Container (v2)" },
            ]}
          />
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-fg"
          >
            <RotateCcw size={15} /> Clear all
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ----------------------------- editor ----------------------------- */}
        {mode === "container" ? (
          <ContainerEditor ct={ct} setCt={setCt} comps={comps} setComps={setComps} newId={id} />
        ) : (
          <div className="space-y-6">
            <Panel title="Message">
              <Label hint={`${content.length}/2000`}>Content</Label>
              <textarea
                value={content}
                onChange={(ev) => setContent(ev.target.value)}
                maxLength={2000}
                rows={2}
                placeholder="Text above the embed (optional)"
                className={`${inputCls} resize-y`}
              />
            </Panel>

            <Panel title="Embed">
              <div className="space-y-5">
                <Group title="Author">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <input className={inputCls} maxLength={256} value={e.authorName} onChange={(ev) => upd("authorName", ev.target.value)} placeholder="Author" />
                    </div>
                    <div>
                      <Label>Icon URL</Label>
                      <input className={inputCls} value={e.authorIcon} onChange={(ev) => upd("authorIcon", ev.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </Group>

                <Group title="Content">
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
                </Group>

                <Group title="Color and media">
                  <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
                    <div>
                      <Label>Color</Label>
                      <ColorField value={e.color} onChange={(v) => upd("color", v)} label="Embed color" />
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
                </Group>

                <Group title="Footer">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label hint={`${e.footerText.length}/2048`}>Text</Label>
                      <input className={inputCls} maxLength={2048} value={e.footerText} onChange={(ev) => upd("footerText", ev.target.value)} placeholder="Footer" />
                    </div>
                    <div>
                      <Label>Icon URL</Label>
                      <input className={inputCls} value={e.footerIcon} onChange={(ev) => upd("footerIcon", ev.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                  <Toggle checked={e.timestamp} onChange={(v) => upd("timestamp", v)}>
                    Show timestamp
                  </Toggle>
                </Group>
              </div>
            </Panel>

            <Panel
              title="Fields"
              count={`${fields.length}/${LIMITS.fields}`}
              action={
                <AddBtn
                  disabled={fields.length >= LIMITS.fields}
                  onClick={() => setFields((fs) => [...fs, { id: id(), name: "", value: "", inline: true }])}
                >
                  Add field
                </AddBtn>
              }
            >
              {fields.length === 0 ? (
                <p className="text-sm text-white/40">No fields yet.</p>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {fields.map((f, i) => (
                    <div key={f.id} className="space-y-2 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-xs text-white/30">{i + 1}</span>
                        <input
                          className={inputCls}
                          maxLength={256}
                          value={f.name}
                          onChange={(ev) => updField(f.id, { name: ev.target.value })}
                          placeholder="Field name"
                        />
                        <IconBtn label={`Remove field ${i + 1}`} onClick={() => setFields((fs) => fs.filter((x) => x.id !== f.id))} danger>
                          <Trash2 size={16} />
                        </IconBtn>
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
                </div>
              )}
            </Panel>

            <Panel
              title="Buttons"
              count={`${btns.length}/${LIMITS.buttons}`}
              action={
                <AddBtn disabled={btns.length >= LIMITS.buttons} onClick={() => setBtns((bs) => [...bs, newBtn(id())])}>
                  Add button
                </AddBtn>
              }
            >
              {btns.length === 0 ? (
                <p className="text-sm text-white/40">No buttons yet.</p>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {btns.map((b, i) => (
                    <div key={b.id} className="py-3 first:pt-0 last:pb-0">
                      <BtnRow
                        b={b}
                        onChange={(patch) => updBtn(b.id, patch)}
                        onRemove={() => setBtns((bs) => bs.filter((x) => x.id !== b.id))}
                      />
                      <span className="sr-only">Button {i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        )}

        {/* ----------------------------- preview ----------------------------- */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Panel title="Preview">
            {/* discord message */}
            <div className="overflow-hidden rounded-xl bg-[#313338] p-4 font-[gg_sans,'Noto_Sans','Helvetica_Neue',Helvetica,Arial,sans-serif] text-[#dbdee1]">
              <div className="flex gap-4">
                <img src="/favicon.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-medium text-white">{BOT_NAME}</span>
                    <span
                      title="Verified App"
                      className="inline-flex items-center gap-0.5 rounded bg-[#5865f2] px-1.5 py-px text-[10px] font-semibold uppercase leading-[15px] text-white"
                    >
                      <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor" aria-hidden="true">
                        <path d="M6.4 11.8 2.6 8l1.4-1.4 2.4 2.4 5.6-5.6L13.4 4.8z" />
                      </svg>
                      App
                    </span>
                    <span className="text-xs text-[#949ba4]">Today at {time}</span>
                  </div>

                  {mode === "container" ? (
                    <ContainerPreview ct={ct} comps={comps} />
                  ) : (
                    <>
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
                          {btns.map((b) => (
                            <PreviewBtn key={b.id} b={b} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          {/* script box */}
          <Panel>
            <div className="mb-3 flex items-center justify-between gap-3">
              <Segmented
                label="Output format"
                value={tab}
                onChange={setTab}
                options={[
                  { id: "script", label: "Script" },
                  { id: "json", label: "JSON" },
                  { id: "python", label: "discord.py" },
                ]}
              />
              <button onClick={copy} className="btn btn-accent inline-flex items-center gap-2 !px-4 !py-1.5 !text-sm">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/[0.07] bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-white/80">
              {output}
            </pre>
          </Panel>
        </div>
      </div>
    </main>
  );
}
