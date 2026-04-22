"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface ClipImage {
  image: { url?: string } | null;
  caption?: string;
}

interface ArticleClip {
  title: string;
  clipImages: ClipImage[];
  linkedArticleSlug?: string;
}

interface ArticleClipModalProps {
  clip: ArticleClip;
  onClose: () => void;
}

export default function ArticleClipModal({ clip, onClose }: ArticleClipModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
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

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const images = clip.clipImages
      .map((ci) => ci.image && typeof ci.image === "object" && ci.image.url
        ? `<img src="${ci.image.url}" style="max-width:100%;margin-bottom:10px;" />`
        : ""
      )
      .join("");
    printWindow.document.write(`
      <html><head><title>${clip.title}</title></head>
      <body style="margin:20px;font-family:sans-serif;">
        <h2>${clip.title}</h2>
        ${images}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: clip.title, text: clip.title });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(clip.title);
      alert("শিরোনাম কপি করা হয়েছে!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-100 flex items-start justify-center overflow-y-auto cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8 mx-4 relative cursor-default"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-navy line-clamp-1 flex-1 mr-4">
            {clip.title}
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

        {/* Article clip images */}
        <div className="p-4 space-y-3">
          {clip.clipImages.map((ci, idx) => {
            const url = ci.image && typeof ci.image === "object" ? ci.image.url : null;
            if (!url) return null;
            return (
              <div key={idx}>
                <div className="relative w-full">
                  <Image
                    src={url}
                    alt={ci.caption || `${clip.title} — অংশ ${idx + 1}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto rounded"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                {ci.caption && (
                  <p className="text-xs text-center text-text-muted mt-1">{ci.caption}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 rounded-b-lg flex items-center gap-3 flex-wrap">
          {/* Print */}
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

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            শেয়ার
          </button>

          {/* Link to online article */}
          {clip.linkedArticleSlug && (
            <Link
              href={`/post/${clip.linkedArticleSlug}`}
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
