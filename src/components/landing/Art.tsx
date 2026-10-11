import { useEffect, useState, type ReactNode } from "react";
import {
  AtSign, BadgeCheck, BookOpen, Check, Clock, Crown, EyeOff, Folder, Gamepad2, Gift, Headphones, LayoutGrid, Link2, Lock, Mail,
  MessageSquare, Mic, MousePointerClick, Music, Palette, Pencil, RefreshCw, Flag, Terminal, TriangleAlert, Unlock, UserCheck, UserPlus, Users, UserX, Volume2, X,
  type LucideIcon,
} from "lucide-react";

const chip = "flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#15151a] px-3 py-1.5 text-sm";
const panel = "mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-[#15151a] p-4";
const hi = "h-3.5 w-3.5 text-accent-soft";

interface Node { x: number; y: number; label: string; Icon: LucideIcon; tone?: string }
// Center icon with dotted elbow lines to chips. Coordinates are in a 400x240 box.
function Diagram({ center: Center, nodes }: { center: LucideIcon; nodes: Node[] }) {
  return (
    <div className="relative mx-auto aspect-[5/3] w-full max-w-md">
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" fill="none" stroke="#fff" strokeOpacity=".18" strokeDasharray="2 4" aria-hidden>
        {nodes.map((n) => <path key={n.label} d={`M200 120H${n.x}V${n.y}`} />)}
      </svg>
      <span className="icon-circle absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}><Center className="h-7 w-7 text-accent-soft" aria-hidden /></span>
      {nodes.map(({ x, y, label, Icon, tone }) => (
        <span key={label} className={`${chip} absolute -translate-x-1/2 -translate-y-1/2`} style={{ left: `${x / 4}%`, top: `${y / 2.4}%` }}>
          <Icon className={tone ?? hi} aria-hidden />{label}
        </span>
      ))}
    </div>
  );
}
const ok = "h-3.5 w-3.5 text-emerald-400", bad = "h-3.5 w-3.5 text-red-400";

export const FilterDiagram = () => (
  <div className="relative mx-auto aspect-[5/3] w-full max-w-md">
    <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" fill="none" stroke="#fff" strokeOpacity=".16" strokeDasharray="2 4" aria-hidden>
      <path d="M200 0V240M120 100H200M300 52V105H200M100 195H150V105M250 195V125H200" />
    </svg>
    <span className={`${chip} absolute`} style={{ left: "14%", top: "34%" }}><Link2 className={hi} aria-hidden />Links</span>
    <span className={`${chip} absolute`} style={{ right: "4%", top: "14%" }}><AtSign className={hi} aria-hidden />Mass Mentions</span>
    <span className={`${chip} absolute`} style={{ left: "4%", top: "76%" }}><TriangleAlert className={hi} aria-hidden />Spoilers</span>
    <span className={`${chip} absolute`} style={{ left: "52%", top: "78%" }}><Mail className={hi} aria-hidden />Invites</span>
  </div>
);
export const ShieldArt = () => (
  <svg viewBox="0 0 260 220" className="mx-auto h-56" aria-hidden>
    <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffc2b0" /><stop offset="1" stopColor="#7a2410" /></linearGradient></defs>
    <path d="M20 40H240M20 190H240M60 8V212M200 8V212" stroke="#fff" strokeOpacity=".16" strokeDasharray="2 4" fill="none" />
    <path d="M130 22 192 44V112C192 150 164 176 130 190 96 176 68 150 68 112V44Z" fill="url(#sg)" stroke="#2a1410" strokeWidth="8" />
    <circle cx="130" cy="96" r="14" fill="none" stroke="#1a0c08" strokeWidth="6" />
    <path d="M130 110V152M130 130H144M130 146H142" stroke="#1a0c08" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);
export const AutoroleArt = () => <Diagram center={UserPlus} nodes={[
  { x: 80, y: 50, label: "@Member", Icon: BadgeCheck }, { x: 325, y: 50, label: "@Verified", Icon: Check }, { x: 200, y: 200, label: "@Updates", Icon: Mail }]} />;
export const ReactionRolesArt = () => <Diagram center={MousePointerClick} nodes={[
  { x: 80, y: 50, label: "Gamer", Icon: Gamepad2 }, { x: 325, y: 50, label: "Artist", Icon: Palette },
  { x: 80, y: 190, label: "Music", Icon: Music }, { x: 325, y: 190, label: "Reader", Icon: BookOpen }]} />;
export const SetupArt = () => <Diagram center={Terminal} nodes={[
  { x: 75, y: 55, label: "Category", Icon: Folder }, { x: 325, y: 55, label: "Join to Create", Icon: Volume2 }, { x: 200, y: 200, label: "Interface", Icon: LayoutGrid }]} />;
export const PermissionsArt = () => <Diagram center={Mic} nodes={[
  { x: 80, y: 55, label: "@friend", Icon: Check, tone: ok }, { x: 325, y: 55, label: "@troll", Icon: X, tone: bad }, { x: 200, y: 200, label: "@guest", Icon: Check, tone: ok }]} />;
export const RequirementsArt = () => <Diagram center={Gift} nodes={[
  { x: 75, y: 50, label: "Role", Icon: BadgeCheck }, { x: 325, y: 50, label: "500 Messages", Icon: MessageSquare },
  { x: 75, y: 190, label: "60 Voice Min", Icon: Clock }, { x: 325, y: 190, label: "In Voice", Icon: Headphones }]} />;

export const ManageArt = () => (
  <div className="flex flex-col items-center">
    <span className="icon-circle"><Gift className="h-7 w-7 text-accent-soft" aria-hidden /></span>
    <div className="h-6 border-l border-dotted border-white/25" />
    <div className="flex flex-col items-center gap-3">
      {([["Reroll", RefreshCw], ["Edit", Pencil], ["End", Flag]] as [string, LucideIcon][]).map(([l, I]) => (
        <span key={l} className={chip}><I className={hi} aria-hidden />{l}</span>))}
    </div>
  </div>
);

const tiles: [string, LucideIcon][] = [["Lock", Lock], ["Unlock", Unlock], ["Limit", Users], ["Rename", Pencil], ["Claim", Crown], ["Permit", UserCheck], ["Reject", UserX], ["Hide", EyeOff]];
const Avatars = () => <span className="flex -space-x-2" aria-hidden>{["#ff7a52", "#7a2410", "#ffb4a1"].map((c) => <i key={c} className="h-6 w-6 rounded-full border-2 border-[#15151a]" style={{ background: c }} />)}</span>;
export const PanelArt = () => (
  <div className={panel}>
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm font-medium"><Mic className={hi} aria-hidden />Quiet Room</span><Avatars />
    </div>
    <div className="mt-4 grid grid-cols-4 gap-2">
      {tiles.map(([l, I]) => (
        <div key={l} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-[11px] text-muted">
          <I className="h-5 w-5 text-accent-soft" aria-hidden />{l}</div>))}
    </div>
    <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs text-muted">
      <div className="flex justify-between"><span>Owner</span><span className="text-fg">@you</span></div>
      <div className="flex justify-between"><span>User limit</span><span className="text-fg">5</span></div>
      <div className="flex justify-between"><span>Status</span><span className="text-fg">Locked</span></div>
    </div>
  </div>
);

export function LiveGiveawayArt() {
  const [s, setS] = useState(2 * 3600 + 14 * 60 + 9);
  useEffect(() => { const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000); return () => clearInterval(t); }, []);
  const parts: [string, number][] = [["Hours", Math.floor(s / 3600)], ["Min", Math.floor((s % 3600) / 60)], ["Sec", s % 60]];
  return (
    <div className={panel}>
      <div className="flex items-center gap-3"><span className="icon-tile !h-10 !w-10"><Gift className="h-5 w-5 text-accent-soft" aria-hidden /></span>
        <div><div className="font-semibold">Nitro Giveaway</div><div className="text-xs text-muted">Hosted by @you</div></div></div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {parts.map(([l, n]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] py-2 text-center">
            <div className="font-mono text-2xl">{String(n).padStart(2, "0")}</div><div className="text-[11px] text-muted">{l}</div></div>))}
      </div>
      <div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-muted"><Avatars />128 entries</span>
        <span className="bg-grad rounded-lg px-4 py-1.5 text-xs">Enter</span></div>
    </div>
  );
}
export type ArtMap = Record<string, ReactNode>;
