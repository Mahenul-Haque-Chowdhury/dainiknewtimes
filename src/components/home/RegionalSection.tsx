import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaSizeUrl } from "@/lib/utils";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
}

interface RegionalSectionProps {
  title: string;
  slug: string;
  articles: Article[];
}

export default function RegionalSection({ title, slug, articles }: RegionalSectionProps) {
  const mainStory = articles[0];
  const sideStories = articles.slice(1, 5);

  return (
    <section className="mb-8">
      <div className="max-w-300 mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary-red">☰</span> {title}
            <span className="flex-1 h-0.75 bg-linear-to-r from-red-500 via-blue-500 to-red-500 ml-2" />
          </h2>
          <Link
            href={`/${slug}`}
            className="text-primary-red text-sm font-bold hover:underline shrink-0 ml-4"
          >
            আরও ›
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6">
              <div className="aspect-4/3 bg-gray-200 rounded" />
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="aspect-4/3 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main story — left half */}
            {mainStory && (
              <div className="lg:col-span-6">
                <Link href={`/post/${mainStory.slug}`} className="block group">
                  <div className="aspect-4/3 relative overflow-hidden rounded">
                    {mainStory.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(mainStory.featuredImage, "large")}
                        alt={mainStory.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold mt-2 leading-snug group-hover:text-primary-red transition line-clamp-2">
                    {mainStory.title}
                  </h3>
                </Link>
              </div>
            )}

            {/* 2×2 grid — right half */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {sideStories.map((article) => (
                <Link
                  key={article.slug}
                  href={`/post/${article.slug}`}
                  className="block group"
                >
                  <div className="aspect-4/3 relative overflow-hidden rounded">
                    {article.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(article.featuredImage, "card")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold mt-2 leading-snug group-hover:text-primary-red transition line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

