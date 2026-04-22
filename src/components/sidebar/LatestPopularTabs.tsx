"use client";

import React, { useState } from "react";
import NewsCard from "@/components/ui/NewsCard";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
  publishDate?: string;
}

interface LatestPopularTabsProps {
  latest: Article[];
  popular: Article[];
}

export default function LatestPopularTabs({ latest, popular }: LatestPopularTabsProps) {
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");

  const articles = activeTab === "latest" ? latest : popular;

  return (
    <div className="border rounded overflow-hidden">
      <div className="flex">
        <button
          onClick={() => setActiveTab("latest")}
          className={`flex-1 px-3 py-2 text-sm font-bold transition ${
            activeTab === "latest"
              ? "bg-primary-red text-white"
              : "bg-gray-100 text-text-dark hover:bg-gray-200"
          }`}
        >
          সর্বশেষ
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex-1 px-3 py-2 text-sm font-bold transition ${
            activeTab === "popular"
              ? "bg-primary-blue text-white"
              : "bg-gray-100 text-text-dark hover:bg-gray-200"
          }`}
        >
          অধিক পঠিত
        </button>
      </div>
      <div className="p-3 space-y-3">
        {articles.length > 0 ? (
          articles.slice(0, 5).map((article) => (
            <NewsCard
              key={article.slug}
              title={article.title}
              slug={article.slug}
              image={article.featuredImage}
              variant="small"
            />
          ))
        ) : (
          <p className="text-xs text-text-muted text-center py-4">
            কোনো সংবাদ নেই
          </p>
        )}
      </div>
    </div>
  );
}
