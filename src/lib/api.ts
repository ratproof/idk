import { API_URL, DEFAULT_PREFIX, HIDDEN_GROUPS } from "@/config";

export interface Command {
  name: string; aliases: string[]; description: string; usage: string; subcommands: Command[];
}
export interface Group { id: string; slug: string; name: string; commands: Command[]; count: number }

interface RawCommand {
  name: string; aliases?: string[]; description?: string; usage?: string;
  hidden?: boolean; subcommands?: RawCommand[];
}
interface RawGroup { group: string; commands: RawCommand[] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const hidden = new Set(HIDDEN_GROUPS.map((g) => g.toLowerCase()));
const PLACEHOLDER = /<function get_prefix at 0x[0-9a-f]+>/gi;

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function displayGroup(name: string) {
  if (name.toLowerCase() === "lastfm") return "Last.fm";
  return name.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const cleanUsage = (u?: string) =>
  `${DEFAULT_PREFIX}${(u ?? "").replace(PLACEHOLDER, "").trim()}`;

function normCommand(c: RawCommand): Command {
  return {
    name: c.name ?? (c as Any).qualified_name ?? "",
    aliases: c.aliases ?? [],
    description: (c.description ?? "").trim(),
    usage: cleanUsage(c.usage),
    subcommands: (c.subcommands ?? (c as Any).commands ?? []).filter((s: RawCommand) => !s.hidden).map(normCommand),
  };
}

export const countCommands = (cmds: Command[]) =>
  cmds.reduce((n, c) => n + 1 + c.subcommands.length, 0);

// Accepts [{group, commands}], { Group: [...] }, { commands | groups | data: ... } or a flat list with a category field.
function toGroups(raw: Any): RawGroup[] {
  const body = Array.isArray(raw) ? raw : raw?.groups ?? raw?.commands ?? raw?.data ?? raw;
  if (Array.isArray(body)) {
    if (body.every((g: Any) => Array.isArray(g?.commands))) {
      return body.map((g: Any) => ({ group: g.group ?? g.name ?? g.category ?? g.cog ?? "Other", commands: g.commands }));
    }
    const by = new Map<string, RawCommand[]>();
    for (const c of body as Any[]) {
      const k = c.group ?? c.category ?? c.cog ?? c.module ?? "Other";
      by.set(k, [...(by.get(k) ?? []), c]);
    }
    return [...by].map(([group, commands]) => ({ group, commands }));
  }
  if (body && typeof body === "object") {
    return Object.entries(body)
      .filter(([, v]) => Array.isArray(v))
      .map(([group, commands]) => ({ group, commands: commands as RawCommand[] }));
  }
  throw new Error("Unexpected commands payload");
}

// All cleanup lives here: hidden groups/commands dropped, usage fixed, names prettified.
export function normalize(input: unknown): Group[] {
  return toGroups(input)
    .filter((g) => !hidden.has(g.group.trim().toLowerCase()))
    .map((g) => {
      const commands = g.commands.filter((c) => !c.hidden).map(normCommand);
      const slug = slugify(g.group);
      return { id: slug, slug, name: displayGroup(g.group), commands, count: countCommands(commands) };
    })
    .filter((g) => g.commands.length > 0);
}

export async function fetchCommands(): Promise<Group[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  try { return normalize(json); } catch (e) { console.error("commands payload:", json); throw e; }
}

export const totalCount = (groups: Group[]) => groups.reduce((n, g) => n + g.count, 0);
