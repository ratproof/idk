import type { SVGProps } from "react";
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const LastfmIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3M21 12h-3M7.5 19.8l1.5-2.6" /></svg>
);
export const TikTokIcon = (p: P) => (
  <svg {...base} {...p}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.4 2.6 2 4.2 5 4.5" /></svg>
);
export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>
);
export const RedditIcon = (p: P) => (
  <svg {...base} {...p}><ellipse cx="12" cy="14" rx="8" ry="5.5" /><circle cx="9" cy="13.5" r="1" fill="currentColor" /><circle cx="15" cy="13.5" r="1" fill="currentColor" /><path d="M9.5 16.5c1.4.9 3.6.9 5 0M12 8.5l1-4.5 4 1" /><circle cx="18.5" cy="5.5" r="1.2" /><circle cx="4.2" cy="11.5" r="1.4" /><circle cx="19.8" cy="11.5" r="1.4" /></svg>
);
export const SnapchatIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 3.5c-2.8 0-4.8 2-4.8 4.8v2.2c-.8.3-2 .6-2 1.2 0 .8 1.5 1 2 1.4-.3 1.4-1.6 2.3-2.5 2.6.3.8 1.8.9 3 1.1.4.5.6 1.2 1.5 1.2.9 0 1.5-.8 2.8-.8s1.9.8 2.8.8c.9 0 1.1-.7 1.5-1.2 1.2-.2 2.7-.3 3-1.1-.9-.3-2.2-1.2-2.5-2.6.5-.4 2-.6 2-1.4 0-.6-1.2-.9-2-1.2V8.3c0-2.8-2-4.8-4.8-4.8Z" /></svg>
);
