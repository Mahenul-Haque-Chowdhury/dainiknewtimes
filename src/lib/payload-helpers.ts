import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Where } from "payload";
import { ORDERED_CATEGORY_SLUGS, sortConfiguredCategories } from "@/lib/category-config";
import { logWarn } from "@/lib/logger";

export interface SiteSettingsResult {
  siteName?: string;
  tagline?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
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
  const result = await payload.find({
    collection: "categories",
    where: {
      slug: {
        in: [...ORDERED_CATEGORY_SLUGS],
      },
    },
    limit: 50,
  });

  return {
    ...result,
    docs: sortConfiguredCategories(result.docs),
  };
}

export async function getHomepageCategoryTabs(limit = 4, articleLimit = 8) {
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.docs.filter((category) => category.slug);
  const selectedCategories = categories.slice(0, limit);

  const articleResults = await Promise.all(
    selectedCategories.map((category) => getArticlesByCategory(category.slug, articleLimit))
  );

  return selectedCategories.map((category, index) => ({
    name: category.name,
    slug: category.slug,
    articles: articleResults[index]?.articles?.docs || [],
  }));
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

function getTodayDateInDhaka(): string {
  // E-paper issue dates should follow Bangladesh local day boundaries.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getTodayEPaperOrLatest() {
  const todayDate = getTodayDateInDhaka();
  const todaysIssue = await getEPaperByDate(todayDate);
  if (todaysIssue) return todaysIssue;

  return getLatestEPaper();
}

export async function getSiteSettings() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 2 }) as Promise<SiteSettingsResult>;
}

function isMissingRelationError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const nestedCause = error.cause as { code?: string; message?: string } | undefined;

  return (
    nestedCause?.code === "42P01" ||
    error.message.includes("relation ") ||
    nestedCause?.message?.includes("relation ") === true
  );
}

export async function getHeadlines() {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({ slug: "headlines" });
  } catch (error) {
    if (isMissingRelationError(error)) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      logWarn("Headlines table not available yet", {
        error: errorMessage,
      });

      return null;
    }

    throw error;
  }
}

export async function getBreakingNews() {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({ slug: "breaking-news" });
  } catch (error) {
    if (isMissingRelationError(error)) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      logWarn("Breaking news table not available yet", {
        error: errorMessage,
      });

      return null;
    }

    throw error;
  }
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
