import type { ReactNode } from "react";

// Hand-drawn 24px stroke icons, one per command group.
const paths: Record<string, ReactNode> = {
  all: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>,
  configuration: <><circle cx="12" cy="12" r="5.4" /><circle cx="12" cy="12" r="2.2" /><circle cx="12" cy="12" r="7.9" strokeWidth="2.6" strokeDasharray="2.9 3.15" /></>,
  giveaways: <><rect x="4" y="10" width="16" height="10" rx="1.6" /><path d="M3 7.5h18V10H3zM12 7.5V20" /><path d="M12 7.5C10 4 7 4.5 7.6 6.4c.4 1.4 4.4 1.1 4.4 1.1s4 .3 4.4-1.1C17 4.5 14 4 12 7.5Z" /></>,
  moderation: <><path d="M12.8 5.2l6 6-2.4 2.4-6-6z" /><path d="M10.6 8.4 4.6 14.4a2.1 2.1 0 0 0 3 3l6-6" /><path d="M5 20h8" /></>,
  premium: <path d="M4 18.5h16M5 18.5 3.6 8.2l5 4L12 5l3.4 7.2 5-4L19 18.5" />,
  lastfm: <><circle cx="7.2" cy="13.3" r="3.2" /><path d="M10.4 10v7M20.4 11.2c-.9-1.2-3.8-1.3-3.8.4 0 2.3 4 1.2 4 3.5 0 1.9-3.1 1.9-4.2.5" /></>,
  misc: <path d="M20 11.4l-7.7 7.8a4.5 4.5 0 0 1-6.4-6.4l8.3-8.4a3 3 0 0 1 4.3 4.2l-8.4 8.4a1.5 1.5 0 0 1-2.1-2.1l7.6-7.7" />,
  utility: <><path d="M7 4h10.5a.8.8 0 0 1 .8.8V20H8a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z" /><path d="M9.5 8.5h5.5M9.5 12h5.5M5 17a3 3 0 0 1 3-3h10.3" /></>,
  fun: <path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
  default: <path d="M5 7l5 5-5 5M12.5 18H19" />,
};

export function GroupIcon({ slug, className = "h-5 w-5" }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[slug] ?? paths.default}
    </svg>
  );
}
