"use client";

import React, { useState } from "react";
import FlipbookViewer from "@/components/epaper/FlipbookViewer";
import PageThumbnails from "@/components/epaper/PageThumbnails";

interface Page {
  pageImage: any;
  pageNumber: number;
  articleClips?: any[] | null;
}

interface EpaperClientViewerProps {
  pages: Page[];
  pageLabels: string[];
  issueDate: string;
}

export default function EpaperClientViewer({ pages, pageLabels, issueDate }: EpaperClientViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const currentPageData = pages[currentPage];

  const clips = (currentPageData?.articleClips || []).map((c: any) => ({
    title: c.title || "",
    zoneX: typeof c.zoneX === "number" ? c.zoneX : undefined,
    zoneY: typeof c.zoneY === "number" ? c.zoneY : undefined,
    zoneW: typeof c.zoneW === "number" ? c.zoneW : undefined,
    zoneH: typeof c.zoneH === "number" ? c.zoneH : undefined,
  }));

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <>
      {/* Page navigation tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {pageLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1.5 text-sm rounded transition ${
              i === currentPage
                ? "bg-primary-red text-white font-bold"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left sidebar — thumbnails (desktop) */}
        <div className="hidden lg:block lg:col-span-2">
          <PageThumbnails
            pages={pages}
            currentPage={currentPage}
            onPageSelect={handlePageChange}
            layout="vertical"
          />
        </div>

        {/* Main viewer */}
        <div className="lg:col-span-10">
          <FlipbookViewer
            pages={pages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            issueDate={issueDate}
            clips={clips}
          />

          {/* Bottom thumbnails (mobile + desktop) */}
          <div className="mt-4">
            <PageThumbnails
              pages={pages}
              currentPage={currentPage}
              onPageSelect={handlePageChange}
              layout="horizontal"
            />
          </div>
        </div>
      </div>
    </>
  );
}
