import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LiveIndicator from "@/components/sidebar/LiveIndicator";
import ArchivePicker from "@/components/sidebar/ArchivePicker";
import LatestPopularTabs from "@/components/sidebar/LatestPopularTabs";
import {
  searchArticles,
  getPublishedArticles,
  getPopularArticles,
} from "@/lib/payload-helpers";
import { getMediaSizeUrl } from "@/lib/utils";
import { formatBengaliDate } from "@/lib/bengali-date";
import { getSiteUrl } from "@/lib/env";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const siteUrl = getSiteUrl();

  return {
    title: q
      ? `"${q}" - অনুসন্ধান ফলাফল | দৈনিক নিউ টাইমস`
      : "অনুসন্ধান | দৈনিক নিউ টাইমস",
    alternates: {
      canonical: q ? `${siteUrl}/search?q=${encodeURIComponent(q)}` : `${siteUrl}/search`,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const query = q?.trim() || "";

  const [searchResult, latestResult, popularResult] = await Promise.all([
    query ? searchArticles(query, 12, page) : Promise.resolve(null),
    getPublishedArticles(5),
    getPopularArticles(5),
  ]);

  const articles = searchResult?.docs || [];
  const totalPages = searchResult?.totalPages || 0;
  const totalDocs = searchResult?.totalDocs || 0;

  return (
    <div className="max-w-300 mx-auto px-4">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">অনুসন্ধান</h1>

        {/* Search form */}
        <form action="/search" method="GET" className="flex gap-2 max-w-lg">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="সংবাদ খুঁজুন..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-red transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-red text-white rounded font-medium hover:bg-red-700 transition"
          >
            খুঁজুন
          </button>
        </form>

        {query && (
          <p className="text-sm text-text-muted mt-3">
            &quot;{query}&quot; - মোট {totalDocs}টি ফলাফল পাওয়া গেছে
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Results — 9 cols */}
        <div className="lg:col-span-9">
          {!query ? (
            <div className="text-center py-12 text-text-muted">
              উপরে সার্চ বক্সে আপনার কীওয়ার্ড লিখুন।
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article: any) => (
                <Link
                  key={article.slug}
                  href={`/post/${article.slug}`}
                  className="flex gap-4 items-start group p-3 bg-white rounded border border-gray-100 hover:shadow-sm transition"
                >
                  <div className="w-32 h-20 shrink-0 relative rounded overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(article.featuredImage, "card")}
                        alt={article.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary-red transition">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-1">
                      {formatBengaliDate(article.publishDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              কোনো ফলাফল পাওয়া যায়নি। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                >
                  « আগের
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/search?q=${encodeURIComponent(query)}&page=${p}`}
                  className={`px-3 py-1.5 rounded text-sm transition ${
                    p === page
                      ? "bg-primary-red text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                >
                  পরের »
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — 3 cols */}
        <aside className="lg:col-span-3 space-y-4">
          <LiveIndicator />
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

