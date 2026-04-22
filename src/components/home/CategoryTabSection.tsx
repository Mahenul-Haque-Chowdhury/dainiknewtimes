"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaSizeUrl } from "@/lib/utils";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
  category?: any;
}

interface CategoryTab {
  name: string;
  slug: string;
  articles: Article[];
}

interface CategoryTabSectionProps {
  tabs: CategoryTab[];
}

export default function CategoryTabSection({ tabs }: CategoryTabSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  const currentArticles = tabs[activeTab]?.articles || [];

  return (
    <section className="bg-section-blue py-8 mb-8">
      <div className="max-w-300 mx-auto px-4">
        {/* Tab buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tabs.map((tab, i) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm font-bold rounded transition ${
                i === activeTab
                  ? "bg-primary-red text-white"
                  : "bg-white text-text-dark hover:bg-gray-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
          <span className="flex-1 h-0.75 bg-gray-600 ml-2 hidden sm:block" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentArticles.length > 0
            ? currentArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/post/${article.slug}`}
                  className="card-red-border bg-white overflow-hidden group block"
                >
                  <div className="aspect-4/3 relative overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(article.featuredImage, "card")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <div className="bg-primary-red p-3">
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))
            : Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="card-red-border bg-white overflow-hidden">
                  <div className="aspect-4/3 bg-gray-300" />
                  <div className="bg-primary-red p-3">
                    <div className="h-3 bg-red-400 rounded w-3/4" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

