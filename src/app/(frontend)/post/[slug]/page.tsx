import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/article/Breadcrumb";
import ArticleBody from "@/components/article/ArticleBody";
import SocialShare from "@/components/article/SocialShare";
import RelatedPosts from "@/components/article/RelatedPosts";
import LiveIndicator from "@/components/sidebar/LiveIndicator";
import ArchivePicker from "@/components/sidebar/ArchivePicker";
import LatestPopularTabs from "@/components/sidebar/LatestPopularTabs";
import AdZone from "@/components/ui/AdZone";
import JsonLd, { newsArticleJsonLd, breadcrumbJsonLd } from "@/components/ui/JsonLd";
import ViewTracker from "./ViewTracker";
import {
  getArticleBySlug,
  getArticlesByCategory,
  getPublishedArticles,
  getPopularArticles,
} from "@/lib/payload-helpers";
import { getMediaSizeUrl } from "@/lib/utils";
import { formatBengaliDate } from "@/lib/bengali-date";
import { getSiteUrl } from "@/lib/env";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "সংবাদ পাওয়া যায়নি" };

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/post/${slug}`;

  const imageUrl = article.featuredImage
    ? getMediaSizeUrl(article.featuredImage as any, "large")
    : undefined;

  return {
    title: `${article.title} | দৈনিক নিউ টাইমস`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.publishDate,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const category =
    typeof article.category === "object" ? article.category : null;
  const reporter =
    typeof article.reporter === "object" ? article.reporter : null;

  // Fetch related posts + sidebar data
  const [relatedResult, latestResult, popularResult] = await Promise.all([
    category
      ? getArticlesByCategory(category.slug, 4)
      : Promise.resolve(null),
    getPublishedArticles(5),
    getPopularArticles(5),
  ]);

  const related = (relatedResult?.articles?.docs || []).filter(
    (a: any) => a.slug !== slug
  ).slice(0, 4);

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/post/${slug}`;
  const imageUrl = article.featuredImage
    ? getMediaSizeUrl(article.featuredImage as any, "large")
    : undefined;

  return (
    <div className="max-w-300 mx-auto px-4">
      {/* Schema.org JSON-LD */}
      <JsonLd
        data={newsArticleJsonLd({
          title: article.title,
          description: article.excerpt || article.title,
          url: articleUrl,
          imageUrl,
          publishDate: article.publishDate,
          modifiedDate: article.updatedAt,
          authorName: reporter?.name,
          categoryName: category?.name,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "প্রচ্ছদ", url: siteUrl },
          ...(category ? [{ name: category.name, url: `${siteUrl}/${category.slug}` }] : []),
          { name: article.title, url: articleUrl },
        ])}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content — 9 cols */}
        <article className="lg:col-span-9">
          <Breadcrumb category={category} articleTitle={article.title} />

          {/* Category badge + meta */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {category && (
              <span className="bg-primary-red text-white text-xs px-2 py-1 rounded font-medium">
                {category.name}
              </span>
            )}
            <span className="text-text-muted text-xs">
              {formatBengaliDate(article.publishDate)}
            </span>
          </div>

          {/* Featured Image */}
          <div className="aspect-video relative rounded overflow-hidden mb-4">
            {article.featuredImage ? (
              <Image
                src={getMediaSizeUrl(article.featuredImage as any, "large")}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
            {article.title}
          </h1>

          {/* Reporter */}
          {reporter && (
            <p className="text-sm text-text-muted mb-4">
              প্রতিবেদক: <span className="font-medium text-text-dark">{reporter.name}</span>
            </p>
          )}

          {/* Share buttons */}
          <SocialShare url={articleUrl} title={article.title} />

          {/* In-article ad */}
          <div className="my-4 hidden md:block">
            <AdZone slot="in-article" />
          </div>

          {/* Article body */}
          <ArticleBody content={article.content} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 mb-4">
              <span className="text-sm font-medium text-text-muted">ট্যাগ:</span>
              {article.tags.map((t: any, i: number) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-text-dark px-2 py-1 rounded"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom share */}
          <SocialShare url={articleUrl} title={article.title} />

          {/* Related posts */}
          <RelatedPosts articles={related} />

          {/* View tracker (client component, fires on mount) */}
          <ViewTracker articleId={article.id} />
        </article>

        {/* Sidebar — 3 cols */}
        <aside className="lg:col-span-3 space-y-4">
          <LiveIndicator />
          <AdZone slot="sidebar" className="hidden lg:flex" />
          <ArchivePicker />
          <LatestPopularTabs
            latest={latestResult.docs}
            popular={popularResult.docs}
          />
        </aside>
      </div>
    </div>
  );
}

