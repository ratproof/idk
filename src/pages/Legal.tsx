import { BOT_NAME, CONTACT_EMAIL, SUPPORT_URL } from "@/config";

type Section = { h: string; p?: string[]; ul?: string[]; after?: string[] };

const UPDATED = "October 11, 2026";

const TERMS: Section[] = [
  { h: "1. Agreement", p: [
    `These Terms of Service ("Terms") are a binding agreement between you and the operator of ${BOT_NAME} ("we", "us"). They apply when you visit our website, add the ${BOT_NAME} bot ("Bot") to a Discord server, or use any command or feature we provide (together, the "Services").`,
    "If you don't agree with these Terms, don't use the Services. Using them means you accept the Terms as written." ] },
  { h: "2. Who can use the Services", p: [
    "You must be old enough to use Discord in your country, and in any case at least 13 years old. If you add the Bot to a server, you confirm that you have permission to manage that server.",
    "Your use of the Services must also follow Discord's Terms of Service and Community Guidelines. Breaking Discord's rules while using the Bot is also a breach of these Terms." ] },
  { h: "3. Using the Bot", p: ["You agree not to:"], ul: [
    "use the Bot to harass, threaten, dox or target anyone, or to carry out raids or spam;",
    "use the Bot for anything illegal, or to share content that is illegal on Discord;",
    "exploit bugs or vulnerabilities, or try to bypass rate limits, permission checks or other safeguards;",
    "copy, resell, sublicense or redistribute the Bot or its features, or build a competing service from them;",
    "use automated means to overload, probe or interfere with the Bot or its infrastructure;",
    "operate a server that Discord has removed for policy violations." ] },
  { h: "4. Using the website", p: ["The website is provided for information about the Bot. Don't scrape it at scale, mirror or frame it without permission, attempt to break into it, or pass off its design or content as your own."] },
  { h: "5. Server owners and administrators", p: [
    "The Bot gives server staff tools such as moderation actions, filters, voice channel controls and giveaways. If you configure or run these tools, you are responsible for how they are used in your community.",
    "That includes making sure your moderation decisions comply with the law and with Discord's rules, running giveaways lawfully (including any local rules on prizes, entry requirements and eligibility), and telling your members what the Bot does in your server where the law requires it. We don't supervise individual servers and aren't a party to anything between you and your members." ] },
  { h: "6. Paid features", p: [
    "Some features may be offered as paid or premium. Where they are, the price, billing period and what's included will be shown at checkout. Paid access is a personal, non-transferable, revocable licence to use those features and doesn't give you ownership of anything.",
    "Unless the law says otherwise or we state otherwise at checkout, payments are non-refundable. If you dispute a charge, contact us first so we can try to sort it out. Access may be withdrawn if a payment is reversed." ] },
  { h: "7. Availability and changes to the Services", p: [
    "We do our best to keep the Bot online, but we don't promise uninterrupted or error-free service. Outages can come from our own maintenance, Discord, hosting providers or other things outside our control.",
    "We may add, change or remove features at any time." ] },
  { h: "8. Suspension and termination", p: [
    "We may restrict or remove access to the Services for any user or server, at any time, if we reasonably believe these Terms have been broken, that the Services or other people are at risk, or that we are legally required to. Where practical we'll tell you why, but we don't have to give notice first.",
    "You can stop using the Services at any time by removing the Bot from your server. Sections that are meant to continue after termination (such as ownership, disclaimers, limits of liability and indemnity) continue to apply." ] },
  { h: "9. Intellectual property", p: [
    `The Bot, the website and their code, branding and design belong to us or our licensors. You keep ownership of the content you and your community create. By using the Bot you give us permission to process that content only as needed to run the Services, as described in our Privacy Policy.` ] },
  { h: "10. Third-party services", p: [
    "The Services rely on third parties such as Discord and, for some features, services like Last.fm. We don't control them, aren't responsible for them, and their own terms apply when you use them." ] },
  { h: "11. Disclaimer of warranties", p: [
    `The Services are provided "as is" and "as available". To the fullest extent the law allows, we disclaim all warranties, express or implied, including fitness for a particular purpose, accuracy and non-infringement. We don't guarantee that moderation filters will catch everything, that they won't flag something by mistake, or that any feature will meet your needs.` ] },
  { h: "12. Limitation of liability", p: [
    "To the fullest extent the law allows, we are not liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, data, goodwill or community members, arising from your use of (or inability to use) the Services. Our total liability for any claim relating to the Services will not exceed the amount you paid us in the 12 months before the claim, or zero if you paid nothing.",
    "Nothing in these Terms limits liability that can't legally be limited." ] },
  { h: "13. Indemnity", p: [
    "You agree to cover reasonable losses, costs and legal fees that we incur from claims caused by your breach of these Terms, your misuse of the Services, or content and actions in a server you manage." ] },
  { h: "14. Changes to these Terms", p: [
    "We may update these Terms from time to time. The date at the top of this page shows the latest version. If you keep using the Services after a change, you accept the updated Terms." ] },
  { h: "15. General", p: [
    "If a part of these Terms is found unenforceable, the rest still applies. If we don't enforce something straight away, that doesn't mean we've given up the right to later. These Terms are the full agreement between you and us about the Services and replace any earlier understanding." ] },
];

const PRIVACY: Section[] = [
  { h: "1. About this policy", p: [
    `This policy explains what information ${BOT_NAME} ("we", "us") handles when you use our Discord bot and website, why we handle it, and the choices you have. By using the Services you agree to it.` ] },
  { h: "2. What we collect", p: ["Depending on the features in use, we process:"], ul: [
    "Discord identifiers: user IDs, usernames and display names, and avatar URLs;",
    "Server information: server IDs and names, plus channel, role and message IDs and timestamps needed to carry out commands;",
    "Command input: the arguments you provide when you run a command;",
    "Settings and records created through the Bot: server configuration, moderation actions (such as warnings, mutes and bans with their reasons), voice channel ownership and settings, and giveaway entries;",
    "Linked accounts: if you connect a Last.fm username, that username;",
    "Basic technical data: standard server logs and error reports used to keep the Services running.",
  ], after: ["We don't ask for passwords, payment card details or your real name, and the Bot doesn't read direct messages between you and other people."] },
  { h: "3. How we use it", p: ["We use information:"], ul: [
    "to run commands and features you or your server staff ask for;",
    "to store the settings and records your server relies on;",
    "to prevent abuse, enforce our Terms and keep the Services secure;",
    "to find and fix bugs and improve reliability;",
    "to comply with the law." ],
    after: ["We don't use your data for advertising and we don't build advertising profiles."] },
  { h: "4. How long we keep it", p: [
    "Data is kept only as long as it's needed for the feature it supports. Short-lived data, such as temporary caches used for filtering, is cleared automatically. Server settings and records stay until server staff remove them, or until the Bot has been removed from the server and the data is deleted, which we aim to do within 30 days.",
    "Backups and logs may keep copies for a limited extra time before they're overwritten." ] },
  { h: "5. Who we share it with", p: [
    "We don't sell or rent your information. We share it only with service providers who help us run the Services (such as hosting), with Discord and Last.fm as needed for features you use, and when the law or a valid legal process requires it or to protect the rights and safety of users and the Services.",
    "Server staff can see moderation records and settings for their own server, as part of how the Bot works." ] },
  { h: "6. Security", p: [
    "We use reasonable technical and organisational measures to protect the data we hold. No online service is completely secure, so we can't guarantee absolute security." ] },
  { h: "7. Your choices and rights", p: [
    "You can ask us to tell you what we hold about you, to correct it, or to delete it, by emailing us from the contact address below. We may need to verify who you are first, and we'll respond within a reasonable time (generally within 30 days).",
    "Depending on where you live, you may have extra rights under local data protection law, such as objecting to certain processing. Some information may need to be kept where we have a legal or security reason. You can also stop all collection by removing the Bot from your server and unlinking any connected accounts." ] },
  { h: "8. Children", p: [
    "The Services are not meant for anyone under 13, or under the minimum age Discord allows in your country. If you believe a child has given us information, contact us and we'll delete it." ] },
  { h: "9. Changes to this policy", p: [
    "We may update this policy from time to time. The date at the top of the page shows the latest version, and continuing to use the Services after a change means you accept it." ] },
];

export default function Legal({ kind }: { kind: "terms" | "privacy" }) {
  const isTerms = kind === "terms";
  const sections = isTerms ? TERMS : PRIVACY;
  return (
    <main className="mx-auto max-w-3xl px-4 py-28">
      <h1 className="text-3xl font-semibold">{isTerms ? "Terms of Service" : "Privacy Policy"}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {UPDATED}</p>
      {sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-lg font-medium">{s.h}</h2>
          {s.p && !s.ul && s.p.map((t, i) => <p key={i} className="mt-2 text-muted">{t}</p>)}
          {s.p && s.ul && <p className="mt-2 text-muted">{s.p[0]}</p>}
          {s.ul && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              {s.ul.map((t) => <li key={t}>{t}</li>)}
            </ul>
          )}
          {s.ul && s.p && s.p.length > 1 && s.p.slice(1).map((t, i) => <p key={i} className="mt-2 text-muted">{t}</p>)}
          {s.after?.map((t, i) => <p key={i} className="mt-2 text-muted">{t}</p>)}
        </section>
      ))}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Contact</h2>
        <p className="mt-2 text-muted">
          Questions about this {isTerms ? "agreement" : "policy"}? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-soft hover:underline">{CONTACT_EMAIL}</a>
          {" "}or reach us in the <a href={SUPPORT_URL} className="text-accent-soft hover:underline">support server</a>.
        </p>
      </section>
    </main>
  );
}
