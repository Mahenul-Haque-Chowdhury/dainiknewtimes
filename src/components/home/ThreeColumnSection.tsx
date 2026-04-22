import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaSizeUrl } from "@/lib/utils";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
}

interface ColumnData {
  title: string;
  slug: string;
  articles: Article[];
}

interface ThreeColumnSectionProps {
  columns: ColumnData[];
}

export default function ThreeColumnSection({ columns }: ThreeColumnSectionProps) {
  return (
    <section className="mb-8">
      <div className="max-w-300 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Column key={col.slug} title={col.title} slug={col.slug} articles={col.articles} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Column({ title, slug, articles }: ColumnData) {
  return (
    <div>
      <div className="flex items-center justify-between bg-navy text-white px-3 py-2 mb-3">
        <h2 className="font-bold text-base flex items-center gap-2">
          <span>☰</span> {title}
        </h2>
        <Link href={`/${slug}`} className="text-xs text-white/80 hover:text-white">
          আরও ›
        </Link>
      </div>
      <div className="space-y-3">
        {articles.length > 0
          ? articles.map((article) => (
              <Link
                key={article.slug}
                href={`/post/${article.slug}`}
                className="flex gap-3 items-start group"
              >
                <div className="w-20 h-14 bg-gray-200 rounded shrink-0 relative overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={getMediaSizeUrl(article.featuredImage, "thumbnail")}
                      alt={article.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <h3 className="text-xs font-semibold leading-snug line-clamp-3 group-hover:text-primary-red transition">
                  {article.title}
                </h3>
              </Link>
            ))
          : [1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-20 h-14 bg-gray-200 rounded shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

