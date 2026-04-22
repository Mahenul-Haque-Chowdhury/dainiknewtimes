import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LiveIndicator from "@/components/sidebar/LiveIndicator";
import ArchivePicker from "@/components/sidebar/ArchivePicker";
import LatestPopularTabs from "@/components/sidebar/LatestPopularTabs";
import {
  getPublishedArticles,
  getPopularArticles,
} from "@/lib/payload-helpers";
import { getMediaSizeUrl } from "@/lib/utils";
import { formatBengaliDate } from "@/lib/bengali-date";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "আর্কাইভ | দৈনিক নিউ টাইমস",
  description: "তারিখ অনুসারে সংবাদ আর্কাইভ",
  alternates: {
    canonical: `${getSiteUrl()}/archive`,
  },
};

interface Props {
  searchParams: Promise<{ date?: string; page?: string }>;
}

export const revalidate = 60;

export default async function ArchivePage({ searchParams }: Props) {
  const { date, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  // Fetch articles filtered by date if provided
  const [articlesResult, latestResult, popularResult] = await Promise.all([
    getPublishedArticles(12, page, date),
    getPublishedArticles(5),
    getPopularArticles(5),
  ]);

  const articles = articlesResult.docs;
  const totalPages = articlesResult.totalPages;

  return (
    <div className="max-w-300 mx-auto px-4">
      {/* Archive header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-primary-red">☰</span> সংবাদ আর্কাইভ
          <span className="flex-1 h-0.75 bg-linear-to-r from-red-500 via-blue-500 to-red-500 ml-2" />
        </h1>

        {/* Date picker */}
        <form action="/archive" method="GET" className="flex gap-2 items-center max-w-md">
          <input
            type="date"
            name="date"
            defaultValue={date || ""}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-red transition"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-primary-red text-white rounded font-medium hover:bg-red-700 transition"
          >
            খুঁজুন
          </button>
        </form>

        {date && (
          <p className="text-sm text-text-muted mt-2">
            {formatBengaliDate(date)} তারিখের সংবাদ
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Articles — 9 cols */}
        <div className="lg:col-span-9">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article: any) => (
                <Link
                  key={article.slug}
                  href={`/post/${article.slug}`}
                  className="block group bg-white rounded overflow-hidden shadow-sm border border-gray-100"
                >
                  <div className="aspect-4/3 relative overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(article.featuredImage, "card")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary-red transition">
                      {article.title}
                    </h3>
                    {article.publishDate && (
                      <p className="text-xs text-text-muted mt-1">
                        {formatBengaliDate(article.publishDate)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              এই তারিখে কোনো সংবাদ পাওয়া যায়নি।
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/archive?${date ? `date=${date}&` : ""}page=${page - 1}`}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                >
                  « আগের
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/archive?${date ? `date=${date}&` : ""}page=${p}`}
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
                  href={`/archive?${date ? `date=${date}&` : ""}page=${page + 1}`}
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

