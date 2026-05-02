import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTicker from "@/components/layout/BottomTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { getAllCategories, getBreakingNews } from "@/lib/payload-helpers";
import { logWarn } from "@/lib/logger";
import "../globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-8911175089831107";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bengali",
});

export const metadata = {
  title: "দৈনিক নিউ টাইমস - সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি",
  description: "দৈনিক নিউ টাইমস - বাংলাদেশের সত্য ও নিরপেক্ষ সংবাদপত্র।",
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
  icons: {
    icon: [
      { url: "/images/dainiknewtimes-logo.png", type: "image/png" },
    ],
    shortcut: "/images/dainiknewtimes-logo.png",
    apple: "/images/dainiknewtimes-logo.png",
  },
};

export const revalidate = 60;

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = ADSENSE_CLIENT;

  let breakingItems: { text: string; link?: string }[] = [];
  let categories: { name: string; slug: string }[] = [];
  try {
    const [breakingNews, categoriesResult] = await Promise.all([getBreakingNews(), getAllCategories()]);
    breakingItems = ((breakingNews as any)?.items || [])
      .filter((item: any) => item.isActive !== false)
      .filter((item: any) => !item.expiresAt || new Date(item.expiresAt).getTime() > Date.now())
      .map((item: any) => ({ text: item.text, link: item.link }));
    categories = categoriesResult.docs
      .filter((category) => typeof category.slug === "string" && category.slug.length > 0)
      .map((category) => ({ name: category.name, slug: category.slug }));
  } catch (error) {
    logWarn("Failed to load breaking news headlines", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to empty headlines on error
  }

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
      </head>
      <body className={`${notoBengali.variable} font-bengali antialiased pb-14 sm:pb-16`}>
        {adsenseClient && (
          <Script
            id="adsense-loader"
            async
            strategy="beforeInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <Header />
        <Navbar categories={categories} />
        <main className="pb-8 pt-2 lg:pt-3">{children}</main>
        <Footer />
        <BottomTicker headlines={breakingItems} />
        <ScrollToTop />
      </body>
    </html>
  );
}
