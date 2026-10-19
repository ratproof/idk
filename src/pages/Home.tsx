import { lazy, Suspense } from "react";
import Hero from "@/components/landing/Hero";
import { moderation, voicemaster, giveaways } from "@/components/landing/bentoConfig";

const SocialProof = lazy(() => import("@/components/landing/SocialProof"));
const Servers = lazy(() => import("@/components/landing/ServersMarquee"));
const Bento = lazy(() => import("@/components/landing/BentoSection").then((m) => ({ default: m.BentoSection })));
const Integrations = lazy(() => import("@/components/landing/IntegrationsMarquee"));
const MoreFeatures = lazy(() => import("@/components/landing/MoreFeatures"));
const Premium = lazy(() => import("@/components/landing/Premium"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));

// orange glow running down the whole page: [side, top%, size, color]
const glows: ["l" | "r", number, string, string][] = [
  ["l", 2, "38rem", "bg-accent"], ["r", 12, "34rem", "bg-accent-deep"], ["l", 30, "40rem", "bg-accent-deep"], ["r", 46, "38rem", "bg-accent"],
  ["l", 62, "40rem", "bg-accent"], ["r", 78, "36rem", "bg-accent-deep"], ["l", 92, "34rem", "bg-accent"],
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        {glows.map(([side, top, size, color], i) => (
          <div key={i} className={`blob ${color}`} style={{ top: `${top}%`, [side === "l" ? "left" : "right"]: "-12rem", width: size, height: size, animationDelay: `${-i * 3}s` }} />
        ))}
        <div className="grain" />
      </div>
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <SocialProof />
        <Servers />
        <Bento {...moderation} />
        <Bento {...voicemaster} />
        <Bento {...giveaways} />
        <Integrations />
        <MoreFeatures />
        <Premium />
        <Testimonials />
        <FinalCTA />
      </Suspense>
    </main>
  );
}
