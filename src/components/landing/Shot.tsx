import type { ReactNode } from "react";
import {
  AutoroleArt, FilterDiagram, LiveGiveawayArt, ManageArt, PanelArt, PermissionsArt, ReactionRolesArt, RequirementsArt, SetupArt, ShieldArt,
} from "./Art";

// Every card slot has a code-built illustration. alt is kept for API parity.
const arts: Record<string, ReactNode> = {
  "purge-filters": <FilterDiagram />, honeypot: <ShieldArt />, autorole: <AutoroleArt />, "reaction-roles": <ReactionRolesArt />,
  "voicemaster-panel": <PanelArt />, "voicemaster-setup": <SetupArt />, "voicemaster-permissions": <PermissionsArt />,
  "giveaway-embed": <LiveGiveawayArt />, "giveaway-requirements": <RequirementsArt />, "giveaway-manage": <ManageArt />,
};
export function Shot({ name }: { name: string; alt?: string }) {
  return <div className="flex min-h-56 items-center justify-center pb-7">{arts[name]}</div>;
}
