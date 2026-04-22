import { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload-helpers";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const payload = await getPayloadClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
    { url: `${siteUrl}/archive`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
    { url: `${siteUrl}/epaper`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  // Categories
  const categories = await payload.find({
    collection: "categories",
    limit: 50,
  });

  const categoryPages: MetadataRoute.Sitemap = categories.docs.map((cat) => ({
    url: `${siteUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // Articles (latest 500)
  const articles = await payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    sort: "-publishDate",
    limit: 500,
    depth: 0,
  });

  const articlePages: MetadataRoute.Sitemap = articles.docs.map((article) => ({
    url: `${siteUrl}/post/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishDate),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
