"use client";

import React, { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-2 py-3 border-t border-b border-gray-200 my-4">
      <span className="text-sm text-text-muted font-medium mr-1">শেয়ার:</span>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-[#1877F2] text-white rounded flex items-center justify-center text-sm hover:opacity-80 transition"
        aria-label="Share on Facebook"
      >
        f
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-sm hover:opacity-80 transition"
        aria-label="Share on X"
      >
        𝕏
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-[#25D366] text-white rounded flex items-center justify-center text-sm hover:opacity-80 transition"
        aria-label="Share on WhatsApp"
      >
        W
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-sm hover:bg-gray-300 transition"
        aria-label="Copy link"
      >
        {copied ? "✓" : "🔗"}
      </button>
    </div>
  );
}
