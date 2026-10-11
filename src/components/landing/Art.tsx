import { AtSign, Link2, Mail, TriangleAlert } from "lucide-react";

const pill = "absolute flex items-center gap-1.5 rounded-full border border-white/10 bg-[#15151a] px-3 py-1.5 text-sm";
export const FilterDiagram = () => (
  <div className="relative mx-auto h-60 w-full max-w-md">
    <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" fill="none" stroke="#fff" strokeOpacity=".16" strokeDasharray="2 4" aria-hidden>
      <path d="M200 0V240M120 100H200M300 52V105H200M100 195H150V105M250 195V125H200" />
    </svg>
    <span className={pill} style={{ left: "14%", top: "34%" }}><Link2 className="h-3.5 w-3.5 text-accent-soft" aria-hidden />Links</span>
    <span className={pill} style={{ right: "4%", top: "14%" }}><AtSign className="h-3.5 w-3.5 text-accent-soft" aria-hidden />Mass Mentions</span>
    <span className={pill} style={{ left: "4%", top: "76%" }}><TriangleAlert className="h-3.5 w-3.5 text-accent-soft" aria-hidden />Spoilers</span>
    <span className={pill} style={{ left: "52%", top: "78%" }}><Mail className="h-3.5 w-3.5 text-accent-soft" aria-hidden />Invites</span>
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
