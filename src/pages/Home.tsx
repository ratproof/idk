import { lazy, Suspense } from "react";
import Hero from "@/components/landing/Hero";
import { moderation, voicemaster, giveaways } from "@/components/landing/bentoConfig";

// below-the-fold: lazy chunks
const SocialProof = lazy(() => import("@/components/landing/SocialProof"));
const Bento = lazy(() => import("@/components/landing/BentoSection").then((m) => ({ default: m.BentoSection })));
const Integrations = lazy(() => import("@/components/landing/IntegrationsMarquee"));
const MoreFeatures = lazy(() => import("@/components/landing/MoreFeatures"));
const Premium = lazy(() => import("@/components/landing/Premium"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <SocialProof />
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
