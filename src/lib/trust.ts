import { CONTACT_EMAIL, SITE_NAME, SOCIAL_LINKS } from "./constants";
import { SITE_URL } from "./site";

export const CONTENT_TEAM_NAME = "LitBuy Finds Team";

export const CONTENT_TEAM_DESCRIPTION =
  "We curate product discoveries from public spreadsheets, organize categories and brands, and help users browse agent marketplaces with clearer structure and guides.";

export const CONTENT_REVIEW_NOTE =
  "Reviewed regularly to ensure information remains accurate.";

export const ORGANIZATION_SCHEMA_ID = `${SITE_URL}/#organization`;
export const WEBSITE_SCHEMA_ID = `${SITE_URL}/#website`;

export const TRUST_FOOTER_SIGNALS = [
  "Updated regularly",
  "3,000+ product listings",
  "Guides and buying resources",
  "Community support via Discord and Telegram",
] as const;

export const TRUST_CONTACT_CHANNELS = [
  {
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    description: CONTACT_EMAIL,
  },
  {
    label: "Discord",
    href: SOCIAL_LINKS.discord,
    description: "Buyer community — QC help and daily finds",
  },
  {
    label: "Telegram",
    href: SOCIAL_LINKS.telegram,
    description: "@RNFinds — quick questions and updates",
  },
  {
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    description: "Highlights and catalog updates",
  },
  {
    label: "TikTok",
    href: SOCIAL_LINKS.tiktok,
    description: "Short finds and browsing tips",
  },
] as const;

export function getContentAuthorSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#content-team`,
    name: CONTENT_TEAM_NAME,
    url: SITE_URL,
    parentOrganization: { "@id": ORGANIZATION_SCHEMA_ID },
  };
}
