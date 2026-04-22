"use client";

import React from "react";

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-200 mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-red-700 mb-3">দুঃখিত, একটি ত্রুটি ঘটেছে</h2>
      <p className="text-sm text-text-muted mb-6">{error.message || "পৃষ্ঠা লোড করা যায়নি।"}</p>
      <button
        type="button"
        onClick={reset}
        className="px-5 py-2 bg-primary-red text-white rounded hover:bg-red-700 transition"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}

