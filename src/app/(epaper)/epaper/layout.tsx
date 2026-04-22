import React from "react";
import Link from "next/link";
import SiteLogo from "@/components/ui/SiteLogo";

export const metadata = {
  title: "ই-পেপার | দৈনিক নিউ টাইমস",
  description: "দৈনিক নিউ টাইমস ই-পেপার — পত্রিকার পাতা অনলাইনে পড়ুন",
};

export default function EpaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* E-Paper Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-350 mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/epaper" className="block bg-white px-3 py-2 transition hover:bg-slate-50">
              <SiteLogo className="w-32.5 sm:w-38.75" imageClassName="object-contain" />
            </Link>
            <span className="mt-5 text-xs bg-primary-red px-2 py-0.5 rounded">ই-পেপার</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-gray-200 transition hidden sm:inline">
              অনলাইন ভার্সন
            </Link>
            <Link href="/" className="bg-primary-red px-3 py-1.5 rounded text-white font-medium hover:bg-red-700 transition">
              হোম
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-navy text-white/60 text-center text-xs py-3 mt-8">
        &copy; {new Date().getFullYear()} দৈনিক নিউ টাইমস। সকল স্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}

