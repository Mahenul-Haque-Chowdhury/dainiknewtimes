import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Where } from "payload";

export interface SiteSettingsResult {
  siteName?: string;
  tagline?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  editorInfo?: {
    chiefEditor?: string;
    editor?: string;
    publisherInfo?: string;
  };
  footerText?: string;
}

export async function getPayloadClient() {
  return getPayload({ config: configPromise });
}

export function buildPublishedArticlesWhere(date?: string): Where {
  if (!date) {
    return {
      status: { equals: "published" },
    };
  }

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  return {
    and: [
      { status: { equals: "published" } },
      {
        publishDate: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      },
    ],
  };
}

export function buildPublishedEPaperWhere(date?: string): Where {
  if (!date) {
    return {
      status: { equals: "published" },
    };
  }

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  return {
    and: [
      { status: { equals: "published" } },
      {
        issueDate: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      },
    ],
  };
}

export function buildPublishedSlugWhere(slug: string): Where {
  return {
    and: [
      { slug: { equals: slug } },
      { status: { equals: "published" } },
    ],
  };
}

export async function getPublishedArticles(limit = 10, page = 1, date?: string) {
  const payload = await getPayloadClient();

  return payload.find({
    collection: "articles",
    where: buildPublishedArticlesWhere(date),
    sort: "-publishDate",
    limit,
    page,
    depth: 2,
  });
}

export async function getFeaturedArticles(limit = 6) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: {
      and: [
        { status: { equals: "published" } },
        { isFeatured: { equals: true } },
      ],
    },
    sort: "-publishDate",
    limit,
    depth: 2,
  });
}

export async function getArticlesByCategory(categorySlug: string, limit = 10, page = 1) {
  const payload = await getPayloadClient();

  // First get category ID from slug
  const categories = await payload.find({
    collection: "categories",
    where: { slug: { equals: categorySlug } },
    limit: 1,
  });

  if (categories.docs.length === 0) return null;

  const categoryId = categories.docs[0].id;

  const articles = await payload.find({
    collection: "articles",
    where: {
      and: [
        { status: { equals: "published" } },
        { category: { equals: categoryId } },
      ],
    },
    sort: "-publishDate",
    limit,
    page,
    depth: 2,
  });

  return { category: categories.docs[0], articles };
}

export async function getArticleBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    where: buildPublishedSlugWhere(slug),
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getBreakingArticles(limit = 10) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: {
      and: [
        { status: { equals: "published" } },
        { isBreaking: { equals: true } },
      ],
    },
    sort: "-publishDate",
    limit,
    depth: 1,
  });
}

export async function getPopularArticles(limit = 5) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    sort: "-viewCount",
    limit,
    depth: 2,
  });
}

export async function getAllCategories() {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "categories",
    sort: "displayOrder",
    limit: 50,
  });
}

export async function searchArticles(query: string, limit = 10, page = 1) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: {
      and: [
        { status: { equals: "published" } },
        {
          or: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
      ],
    },
    sort: "-publishDate",
    limit,
    page,
    depth: 2,
  });
}

export async function getEPaperByDate(dateString: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "epapers",
    where: buildPublishedEPaperWhere(dateString),
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getLatestEPaper() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "epapers",
    where: { status: { equals: "published" } },
    sort: "-issueDate",
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getSiteSettings() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 2 }) as Promise<SiteSettingsResult>;
}

export async function getBreakingNews() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "breaking-news" });
}

export async function incrementViewCount(articleId: number | string) {
  const payload = await getPayloadClient();
  const article = await payload.findByID({ collection: "articles", id: articleId });
  await payload.update({
    collection: "articles",
    id: articleId,
    data: { viewCount: (article.viewCount || 0) + 1 },
  });
}

// Media URL helpers are in @/lib/utils (client-safe)
