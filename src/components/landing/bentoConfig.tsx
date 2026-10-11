import { Gift, Mic, ShieldCheck } from "lucide-react";
import { G } from "@/components/ui/SectionHead";
import type { BentoProps } from "./BentoSection";

export const moderation: BentoProps = {
  icon: ShieldCheck, title: <><G>Moderation</G> and <G>Security</G></>, group: "moderation", grid: "md:grid-cols-3",
  subtitle: "Tools for keeping your server clean and your members safe.",
  cards: [
    { title: "Purge Filters", desc: "Clear messages from bots, links, embeds and more with one command.", shot: "purge-filters", cls: "md:col-span-2" },
    { title: "Honeypot", desc: "A trap channel that bans spam bots and raiders the moment they post.", shot: "honeypot", cls: "" },
    { title: "Autorole", desc: "Give new members their roles as soon as they join.", shot: "autorole", cls: "" },
    { title: "Reaction Roles", desc: "Let members pick their own roles with a click.", shot: "reaction-roles", cls: "md:col-span-2" },
  ],
};
export const voicemaster: BentoProps = {
  icon: Mic, title: <>Your Channel, <G>Your Rules</G></>, group: "voicemaster", grid: "md:grid-cols-2",
  subtitle: "Voicemaster gives members temporary voice channels they control themselves.",
  cards: [
    { title: "Control Panel", desc: "Lock, limit, rename, claim and more, all from buttons.", shot: "voicemaster-panel", cls: "md:row-span-2" },
    { title: "Easy Setup", desc: "One command creates the category, join channel and panel.", shot: "voicemaster-setup", cls: "" },
    { title: "Permissions", desc: "Permit or reject specific members in your own channel.", shot: "voicemaster-permissions", cls: "" },
  ],
};
export const giveaways: BentoProps = {
  icon: Gift, title: <>Giveaways with <G>Real Requirements</G></>, group: "giveaways", grid: "md:grid-cols-5",
  subtitle: "Reward the people who are actually active in your server.",
  cards: [
    { title: "Requirements", desc: "Require a role, message count, voice minutes or a seat in voice.", shot: "giveaway-requirements", cls: "md:col-span-2" },
    { title: "Management", desc: "Reroll, edit or end a giveaway at any time.", shot: "giveaway-manage", cls: "md:col-span-1" },
    { title: "Live Giveaway", desc: "Entries and time left show on the embed as people join.", shot: "giveaway-embed", cls: "md:col-span-2" },
  ],
};
