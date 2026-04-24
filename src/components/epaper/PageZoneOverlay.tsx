"use client";

import React from "react";
import Link from "next/link";

interface ArticleZone {
  title: string;
  zoneX: number;
  zoneY: number;
  zoneW: number;
  zoneH: number;
  linkedArticleSlug?: string;
  continuedFrom?: string;
}

interface PageZoneOverlayProps {
  zones: ArticleZone[];
  issueDate: string;
  currentPageNumber: number;
}

export default function PageZoneOverlay({
  zones,
  issueDate,
  currentPageNumber,
}: PageZoneOverlayProps) {
  if (!zones || zones.length === 0) return null;

  const dateStr = issueDate.split("T")[0];

  return (
    <div className="absolute inset-0 z-10">
      {zones.map((zone, idx) => (
        <Link
          key={idx}
          href={`/epaper/article/${dateStr}/${currentPageNumber}/${idx}`}
          className="absolute border-2 border-transparent hover:border-primary-red hover:bg-primary-red/10 transition-all duration-200 cursor-pointer group rounded-sm block"
          style={{
            left: `${zone.zoneX}%`,
            top: `${zone.zoneY}%`,
            width: `${zone.zoneW}%`,
            height: `${zone.zoneH}%`,
          }}
          aria-label="সংবাদ খুলুন"
        >
          {/* Corner indicators */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-red/0 group-hover:border-primary-red/80 transition-colors" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-red/0 group-hover:border-primary-red/80 transition-colors" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary-red/0 group-hover:border-primary-red/80 transition-colors" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary-red/0 group-hover:border-primary-red/80 transition-colors" />
        </Link>
      ))}
    </div>
  );
}
