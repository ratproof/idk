import { API_URL, DEFAULT_PREFIX, HIDDEN_GROUPS, STATUS_URL } from "@/config";

export interface Command {
  name: string; aliases: string[]; description: string; usage: string; subcommands: Command[];
  permissions?: string[]; // undefined when the API does not send it
}
export interface Group { id: string; slug: string; name: string; commands: Command[]; count: number }

interface RawCommand {
  name: string; aliases?: string[]; description?: string; usage?: string;
  hidden?: boolean; subcommands?: RawCommand[]; permissions?: string[];
}
interface RawGroup { group: string; commands: RawCommand[] }

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
    name: c.name,
    aliases: c.aliases ?? [],
    description: (c.description ?? "").trim(),
    usage: cleanUsage(c.usage),
    permissions: Array.isArray(c.permissions) ? c.permissions : undefined,
    subcommands: (c.subcommands ?? []).filter((s) => !s.hidden).map(normCommand),
  };
}

export const countCommands = (cmds: Command[]) =>
  cmds.reduce((n, c) => n + 1 + c.subcommands.length, 0);

// All cleanup lives here: hidden groups/commands dropped, usage fixed, names prettified.
export function normalize(raw: RawGroup[]): Group[] {
  return raw
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
  return normalize(await res.json());
}

export const totalCount = (groups: Group[]) => groups.reduce((n, g) => n + g.count, 0);

export interface ShardStatus { id: number; ping: number | null; guilds?: number; users?: number; connected?: boolean }
export interface BotStatus {
  guilds: number; users: number; prefix: string; avatar_url: string | null;
  uptime: number; ping: number; shard_count: number; shards: ShardStatus[] | null;
}
export async function fetchStatus(): Promise<BotStatus> {
  const res = await fetch(STATUS_URL);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
