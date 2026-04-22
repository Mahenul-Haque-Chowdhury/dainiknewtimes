import React from "react";
import Link from "next/link";

interface BreadcrumbProps {
  category?: { name: string; slug: string } | null;
  articleTitle: string;
}

export default function Breadcrumb({ category, articleTitle }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-text-muted mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-primary-red transition">
            প্রচ্ছদ
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        {category && (
          <>
            <li>
              <Link
                href={`/${category.slug}`}
                className="hover:text-primary-red transition"
              >
                {category.name}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
          </>
        )}
        <li className="text-text-dark font-medium line-clamp-1">
          {articleTitle}
        </li>
      </ol>
    </nav>
  );
}
