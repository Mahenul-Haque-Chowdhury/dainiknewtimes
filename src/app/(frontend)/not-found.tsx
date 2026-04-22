import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-300 mx-auto px-4 py-20 text-center">
      <div className="text-8xl font-bold text-primary-red mb-4">৪০৪</div>
      <h1 className="text-2xl font-bold mb-3">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="text-text-muted mb-8 max-w-md mx-auto">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে, মুছে ফেলা হয়েছে, অথবা কখনো
        বিদ্যমান ছিল না।
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary-red text-white rounded font-medium hover:bg-red-700 transition"
        >
          প্রচ্ছদ পাতায় যান
        </Link>
        <Link
          href="/search"
          className="px-6 py-2.5 bg-white border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
        >
          অনুসন্ধান করুন
        </Link>
      </div>
    </div>
  );
}

