"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BreakingTickerProps {
  headlines?: { text: string; link?: string; isActive?: boolean }[];
}

export default function BreakingTicker({ headlines }: BreakingTickerProps) {
  const [visible, setVisible] = useState(true);
  const activeHeadlines = headlines?.filter((h) => h.isActive !== false) || [];

  if (!visible) return null;

  return (
    <div className="max-w-300 mx-auto px-4 my-3">
      <div className="flex items-center gap-0 rounded border border-dashed border-primary-red bg-white">
        {/* Label */}
        <span className="bg-primary-red text-white text-sm px-4 py-2 font-bold shrink-0 rounded-l">
          শিরোনাম :
        </span>

        {/* Scrolling area */}
        <div className="overflow-hidden flex-1 py-2 px-3">
          <div className="ticker-animate whitespace-nowrap text-sm">
            {activeHeadlines.length > 0
              ? activeHeadlines.map((h, i) => (
                  <span key={i}>
                    {h.link ? (
                      <Link href={h.link} className="hover:text-primary-red transition">
                        ◉ {h.text}
                      </Link>
                    ) : (
                      <span>◉ {h.text}</span>
                    )}
                    {i < activeHeadlines.length - 1 && (
                      <span className="mx-4 text-gray-300">|</span>
                    )}
                  </span>
                ))
              : "সর্বশেষ সংবাদ শিরোনাম এখানে প্রদর্শিত হবে।"}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="text-primary-red hover:text-red-700 px-3 py-2 transition shrink-0"
          aria-label="Close breaking news"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

