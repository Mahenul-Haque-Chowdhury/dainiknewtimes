import React from "react";
import Link from "next/link";
import HeaderDateTime from "@/components/layout/HeaderDateTime";
import SiteLogo from "@/components/ui/SiteLogo";
import { getSiteSettings } from "@/lib/payload-helpers";

export default async function Header() {
  const settings = await getSiteSettings().catch(() => null);
  const tagline = settings?.tagline || "সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি";
  const facebookUrl = settings?.socialLinks?.facebook;
  const youtubeUrl = settings?.socialLinks?.youtube;

  return (
    <header className="bg-white border-b border-border-gray">
      {/* Top date bar */}
      <div className="bg-white py-1.5 px-4 border-b border-gray-200">
        <div className="max-w-300 mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted truncate">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <HeaderDateTime />
          </div>
          {/* Search bar — hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex items-center gap-2">
            <form action="/search" method="get" className="flex">
              <input
                type="text"
                name="q"
                placeholder="লিখুন"
                className="border border-gray-300 px-3 py-1 text-sm rounded-l focus:outline-none focus:border-primary-blue w-32 md:w-40"
              />
              <button
                type="submit"
                className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Logo + Social row */}
      <div className="max-w-300 mx-auto py-3 px-4 flex items-center justify-between gap-3">
        <Link href="/" className="block shrink-0">
          <SiteLogo className="w-38.75 sm:w-55 md:w-62.5" imageClassName="object-contain" priority />
          <p className="text-[10px] sm:text-xs text-text-muted">{tagline}</p>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* E-paper link */}
          <Link
            href="/epaper"
            className="bg-white border border-gray-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded hover:bg-gray-50 font-medium transition"
          >
            ই-পেপার
          </Link>
          {/* Facebook */}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877F2] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded font-medium hover:opacity-90 transition hidden sm:inline-block"
            >
              facebook
            </a>
          )}
          {/* YouTube */}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF0000] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded font-medium items-center gap-1 hover:opacity-90 transition hidden md:flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
              </svg>
              subscribe
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

