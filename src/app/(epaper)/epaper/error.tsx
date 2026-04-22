"use client";

import React from "react";
import Link from "next/link";

export default function EpaperError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-225 mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-red-700 mb-3">ই-পেপার লোড করা যায়নি</h2>
      <p className="text-sm text-gray-500 mb-6">{error.message || "অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।"}</p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 bg-primary-red text-white rounded hover:bg-red-700 transition"
        >
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

