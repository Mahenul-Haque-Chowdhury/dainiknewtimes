"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

interface Page {
  pageImage: any;
  pageNumber: number;
  articleClips?: any[] | null;
}

interface ArticleClip {
  title: string;
  zoneX?: number;
  zoneY?: number;
  zoneW?: number;
  zoneH?: number;
}

interface FlipbookViewerProps {
  pages: Page[];
  onPageChange?: (page: number) => void;
  currentPage?: number;
  issueDate: string;
  clips?: ArticleClip[];
}

export default function FlipbookViewer({
  pages,
  onPageChange,
  currentPage: controlledPage,
  issueDate,
  clips = [],
}: FlipbookViewerProps) {
  const [internalPage, setInternalPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);

  const currentPage = controlledPage ?? internalPage;
  const totalPages = pages.length;

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalPages || isFlipping) return;
      setFlipDirection(index > currentPage ? "left" : "right");
      setIsFlipping(true);
      setTimeout(() => {
        setInternalPage(index);
        onPageChange?.(index);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    },
    [totalPages, currentPage, isFlipping, onPageChange]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextPage();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevPage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextPage, prevPage]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  if (totalPages === 0) {
    return (
      <div className="aspect-3/4 bg-white rounded-lg shadow flex items-center justify-center text-gray-400">
        কোনো পাতা নেই
      </div>
    );
  }

  const currentPageData = pages[currentPage];
  const imageUrl =
    typeof currentPageData?.pageImage === "object"
      ? currentPageData.pageImage.url
      : null;
  const visibleZones = clips
    .map((clip, index) => ({ clip, index }))
    .filter(
      ({ clip }) =>
        typeof clip.zoneX === "number" &&
        typeof clip.zoneY === "number" &&
        typeof clip.zoneW === "number" &&
        typeof clip.zoneH === "number"
    );

  useEffect(() => {
    const currentImage = imageRef.current;

    if (!imageUrl) {
      setImageLoaded(false);
      return;
    }

    if (currentImage?.complete && currentImage.naturalWidth > 0) {
      setImageLoaded(true);
      return;
    }

    setImageLoaded(false);
  }, [currentPage, imageUrl]);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Page display */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className={`transition-transform duration-300 ease-in-out ${
            isFlipping && flipDirection === "left"
              ? "-translate-x-2 scale-[0.98]"
              : isFlipping && flipDirection === "right"
              ? "translate-x-2 scale-[0.98]"
              : ""
          }`}
        >
          {imageUrl ? (
            <div className="relative w-full bg-gray-100">
              {/* Keep editor and preview on the same coordinate system: real image box, no forced aspect ratio. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={imageUrl}
                ref={imageRef}
                src={imageUrl}
                alt={`পাতা ${currentPageData.pageNumber}`}
                className="block h-auto w-full"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
                draggable={false}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                  ছবি লোড হচ্ছে...
                </div>
              )}
              {visibleZones.length > 0 && (
                <div className="absolute inset-0 z-10">
                  {visibleZones.map(({ clip, index }) => {
                    const articleHref = `/epaper/article/${issueDate.split("T")[0]}/${currentPageData.pageNumber}/${index}`;

                    return (
                      <Link
                        key={`${currentPageData.pageNumber}-${index}`}
                        href={articleHref}
                        className="group absolute rounded-sm border-2 border-primary-red/0 transition-all duration-200 hover:border-primary-red hover:bg-primary-red/10 focus:outline-none focus:ring-2 focus:ring-primary-red/60"
                        style={{
                          left: `${clip.zoneX}%`,
                          top: `${clip.zoneY}%`,
                          width: `${clip.zoneW}%`,
                          height: `${clip.zoneH}%`,
                        }}
                        aria-label={clip.title || `সংবাদ ${index + 1}`}
                        title={clip.title || `সংবাদ ${index + 1}`}
                      >
                        <span
                          className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-navy px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          {clip.title || `সংবাদ ${index + 1}`}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-3/4 bg-gray-100 flex items-center justify-center text-gray-400">
              ছবি লোড হচ্ছে...
            </div>
          )}
        </div>

        {/* Previous button (left side) */}
        {currentPage > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-start pl-2 bg-linear-to-r from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="আগের পাতা"
          >
            <span className="bg-white/90 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow text-xl">
              ‹
            </span>
          </button>
        )}

        {/* Next button (right side) */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-end pr-2 bg-linear-to-l from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="পরের পাতা"
          >
            <span className="bg-white/90 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow text-xl">
              ›
            </span>
          </button>
        )}
      </div>

      {/* Page number indicator */}
      <div className="text-center mt-3 text-sm text-gray-600">
        পাতা {currentPageData?.pageNumber || currentPage + 1} / {totalPages}
      </div>
    </div>
  );
}

