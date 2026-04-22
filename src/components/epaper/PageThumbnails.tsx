"use client";

import React from "react";
import Image from "next/image";

interface Page {
  pageImage: any;
  pageNumber: number;
}

interface PageThumbnailsProps {
  pages: Page[];
  currentPage: number;
  onPageSelect: (index: number) => void;
  layout?: "vertical" | "horizontal";
}

export default function PageThumbnails({
  pages,
  currentPage,
  onPageSelect,
  layout = "vertical",
}: PageThumbnailsProps) {
  if (pages.length === 0) return null;

  const isVertical = layout === "vertical";

  return (
    <div
      className={`${
        isVertical
          ? "flex flex-col gap-2 overflow-y-auto max-h-150 no-scrollbar"
          : "flex gap-2 overflow-x-auto no-scrollbar py-2"
      }`}
    >
      {pages.map((page, index) => {
        const imageUrl =
          typeof page.pageImage === "object" ? page.pageImage.url : null;
        const isActive = index === currentPage;

        return (
          <button
            key={index}
            onClick={() => onPageSelect(index)}
            className={`shrink-0 rounded overflow-hidden border-2 transition ${
              isActive
                ? "border-primary-red shadow-md"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
            } ${isVertical ? "w-full" : "w-20"}`}
            aria-label={`পাতা ${page.pageNumber}`}
          >
            <div className={`relative ${isVertical ? "aspect-3/4" : "aspect-3/4 w-20"}`}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`পাতা ${page.pageNumber}`}
                  fill
                  sizes={isVertical ? "(max-width: 1024px) 120px, 180px" : "80px"}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                  {page.pageNumber}
                </div>
              )}
            </div>
            <div
              className={`text-xs text-center py-1 font-medium ${
                isActive ? "bg-primary-red text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              পাতা {page.pageNumber}
            </div>
          </button>
        );
      })}
    </div>
  );
}

