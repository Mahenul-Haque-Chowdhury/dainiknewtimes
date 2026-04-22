"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ZoneData {
  title: string;
  pageImageUrl: string;
  zoneX: number;
  zoneY: number;
  zoneW: number;
  zoneH: number;
  linkedArticleSlug?: string;
  continuedParts?: {
    pageImageUrl: string;
    zoneX: number;
    zoneY: number;
    zoneW: number;
    zoneH: number;
    pageNumber: number;
  }[];
}

interface ArticleZoneModalProps {
  zone: ZoneData;
  onClose: () => void;
}

function cropUrl(src: string, x: number, y: number, w: number, h: number) {
  return `/api/epaper/crop?src=${encodeURIComponent(src)}&x=${x}&y=${y}&w=${w}&h=${h}`;
}

export default function ArticleZoneModal({ zone, onClose }: ArticleZoneModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const allParts = [
      { pageImageUrl: zone.pageImageUrl, zoneX: zone.zoneX, zoneY: zone.zoneY, zoneW: zone.zoneW, zoneH: zone.zoneH },
      ...(zone.continuedParts || []),
    ];

    const images = allParts
      .map(
        (part) =>
          `<div style="margin-bottom:10px;"><img src="${cropUrl(part.pageImageUrl, part.zoneX, part.zoneY, part.zoneW, part.zoneH)}" style="width:100%;height:auto;" /></div>`
      )
      .join("");

    printWindow.document.write(`
      <html><head><title>${zone.title}</title></head>
      <body style="margin:20px;font-family:sans-serif;">
        <h2>${zone.title}</h2>
        ${images}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const allParts = [
    { pageImageUrl: zone.pageImageUrl, zoneX: zone.zoneX, zoneY: zone.zoneY, zoneW: zone.zoneW, zoneH: zone.zoneH, pageNumber: 0 },
    ...(zone.continuedParts || []),
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 z-100 flex items-start justify-center overflow-y-auto cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8 mx-4 relative cursor-default">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-navy line-clamp-1 flex-1 mr-4">
            {zone.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1"
            aria-label="বন্ধ"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cropped article parts — using server-side crop API */}
        <div className="p-4 space-y-4">
          {allParts.map((part, idx) => (
            <div key={idx} className="overflow-hidden rounded border border-gray-100">
              <Image
                src={cropUrl(part.pageImageUrl, part.zoneX, part.zoneY, part.zoneW, part.zoneH)}
                alt={zone.title}
                width={1600}
                height={2200}
                className="w-full h-auto"
                unoptimized
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {allParts.length > 1 && (
                <p className="text-xs text-center text-text-muted py-1 bg-gray-50">
                  {part.pageNumber > 0 ? `পাতা ${part.pageNumber} এর অংশ` : "প্রথম অংশ"}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 rounded-b-lg flex items-center gap-3 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            প্রিন্ট
          </button>

          {zone.linkedArticleSlug && (
            <Link
              href={`/post/${zone.linkedArticleSlug}`}
              className="ml-auto flex items-center gap-1.5 text-sm bg-primary-blue text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
            >
              অনলাইনে পড়ুন →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
