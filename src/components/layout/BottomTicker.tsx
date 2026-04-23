"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BottomTickerProps {
  headlines?: { text: string; link?: string }[];
}

export default function BottomTicker({ headlines = [] }: BottomTickerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy text-white z-40 py-1.5 border-t border-primary-blue">
      <div className="max-w-300 mx-auto px-4 flex items-center gap-3">
        <span className="bg-primary-red text-white text-sm px-4 py-2 rounded shrink-0 font-bold leading-none">
          ব্রেকিং নিউজ
        </span>
        <div className="overflow-hidden flex-1 no-scrollbar">
          <div className="ticker-animate whitespace-nowrap text-sm">
            {headlines.length > 0
              ? headlines.map((h, i) => (
                  <span key={i}>
                    {i > 0 && "  |  "}
                    {h.link ? (
                      <Link href={h.link} className="hover:underline">
                        {h.text}
                      </Link>
                    ) : (
                      h.text
                    )}
                  </span>
                ))
              : "ব্রেকিং নিউজ এখানে প্রদর্শিত হবে।"}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white hover:text-gray-300 transition shrink-0"
          aria-label="Close ticker"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

