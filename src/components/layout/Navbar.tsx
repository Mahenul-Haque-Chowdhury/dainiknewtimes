"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { name: "প্রচ্ছদ", slug: "/" },
  { name: "জাতীয়", slug: "/national" },
  { name: "বিদেশ", slug: "/international" },
  { name: "ময়মনসিংহ", slug: "/mymensingh" },
  { name: "আইন-আদালত", slug: "/law-court" },
  { name: "স্বাস্থ-শিক্ষা", slug: "/health-education" },
  { name: "খেলা", slug: "/sports" },
  { name: "সংস্কৃতি", slug: "/culture" },
  { name: "গবেষনা-উন্নয়ন", slug: "/research-development" },
  { name: "মতামত", slug: "/opinion" },
];

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        className={`border-b-2 border-primary-blue bg-[#0947A3] z-50 transition-shadow ${
          isSticky ? "fixed top-0 left-0 right-0 shadow-md" : ""
        }`}
      >
        <div className="max-w-300 mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Desktop nav */}
            <ul className="hidden lg:flex w-full items-stretch justify-between gap-1 whitespace-nowrap">
              {categories.map((cat) => (
                <li key={cat.slug} className="flex-1 min-w-0">
                  <Link
                    href={cat.slug}
                    className={`flex h-full items-center justify-center px-2 py-3 text-center text-sm font-medium text-white transition hover:bg-primary-red hover:text-white ${
                      pathname === cat.slug ? "bg-primary-red text-white" : "text-white"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile: ad box + hamburger */}
            <div className="lg:hidden flex items-center justify-between w-full py-2">
              <div className="flex h-10 w-32 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 px-3 text-[11px] font-medium text-gray-400 sm:w-36">
                বিজ্ঞাপন
              </div>
              <button
                className="p-2 text-text-dark"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMobileOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for sticky nav */}
      {isSticky && <div className="h-11.5" />}

      {/* Mobile slide-in drawer overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 bg-navy text-white">
          <span className="font-bold text-sm">মেনু</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <ul className="overflow-y-auto max-h-[calc(100vh-120px)]">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={cat.slug}
                className={`block px-4 py-3 text-sm font-medium border-b border-gray-100 transition ${
                  pathname === cat.slug
                    ? "bg-primary-red/10 text-primary-red font-bold"
                    : "text-text-dark hover:bg-gray-50 hover:text-primary-red"
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Drawer footer links */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 px-4 py-3 flex gap-2">
          <Link
            href="/epaper"
            className="flex-1 text-center text-xs bg-primary-red text-white py-2 rounded font-medium"
            onClick={() => setIsMobileOpen(false)}
          >
            ই-পেপার
          </Link>
          <Link
            href="/search"
            className="flex-1 text-center text-xs bg-navy text-white py-2 rounded font-medium"
            onClick={() => setIsMobileOpen(false)}
          >
            অনুসন্ধান
          </Link>
        </div>
      </div>
    </>
  );
}

