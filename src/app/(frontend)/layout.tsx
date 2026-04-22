import React from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTicker from "@/components/layout/BottomTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { getBreakingNews } from "@/lib/payload-helpers";
import { logWarn } from "@/lib/logger";
import "../globals.css";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bengali",
});

export const metadata = {
  title: "দৈনিক নিউ টাইমস - সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি",
  description: "দৈনিক নিউ টাইমস - বাংলাদেশের সত্য ও নিরপেক্ষ সংবাদপত্র।",
};

export const revalidate = 60;

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  let headlines: { text: string; link?: string }[] = [];
  try {
    const breakingNews = await getBreakingNews();
    headlines = ((breakingNews as any)?.headlines || [])
      .filter((h: any) => h.isActive !== false)
      .map((h: any) => ({ text: h.text, link: h.link }));
  } catch (error) {
    logWarn("Failed to load breaking news headlines", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to empty headlines on error
  }

  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${notoBengali.variable} font-bengali antialiased`}>
        <Header />
        <Navbar />
        <main className="pb-10 pt-2 lg:pt-3">{children}</main>
        <Footer />
        <BottomTicker headlines={headlines} />
        <ScrollToTop />

        {adsenseClient && (
          <Script
            id="adsense-loader"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
