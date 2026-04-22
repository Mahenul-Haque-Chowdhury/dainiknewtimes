import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getMediaSizeUrl } from "@/lib/utils";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
  publishDate?: string;
}

interface RelatedPostsProps {
  articles: Article[];
}

export default function RelatedPosts({ articles }: RelatedPostsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-primary-red">☰</span> সম্পর্কিত সংবাদ
        <span className="flex-1 h-0.5 bg-gray-200 ml-2" />
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {articles.map((article) => (
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
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <h3 className="text-sm font-semibold mt-2 leading-snug line-clamp-2 group-hover:text-primary-red transition">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

