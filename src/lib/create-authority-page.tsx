import type { Metadata } from "next";
import AuthorityPageLayout from "@/components/AuthorityPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAuthorityPage,
  type AuthorityPage,
} from "@/lib/litbuy-authority-pages";

export function createAuthorityPageMetadata(page: AuthorityPage): Metadata {
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
    type: "article",
    publishedTime: page.publishedTime,
    modifiedTime: page.modifiedTime,
  });
}

export function AuthorityPageView({ slug }: { slug: string }) {
  const page = getAuthorityPage(slug);
  if (!page) return null;

  return <AuthorityPageLayout page={page} />;
}

export function getAuthorityPageMetadata(slug: string): Metadata | null {
  const page = getAuthorityPage(slug);
  if (!page) return null;
  return createAuthorityPageMetadata(page);
}
