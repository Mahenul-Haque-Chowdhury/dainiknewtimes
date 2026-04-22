import React from "react";
import BreakingTicker from "@/components/home/BreakingTicker";
import HeroSection from "@/components/home/HeroSection";
import CategoryTabSection from "@/components/home/CategoryTabSection";
import SportsCarousel from "@/components/home/SportsCarousel";
import RegionalSection from "@/components/home/RegionalSection";
import ThreeColumnSection from "@/components/home/ThreeColumnSection";
import PhotoGallery from "@/components/home/PhotoGallery";
import LiveIndicator from "@/components/sidebar/LiveIndicator";
import ArchivePicker from "@/components/sidebar/ArchivePicker";
import LatestPopularTabs from "@/components/sidebar/LatestPopularTabs";
import AdZone from "@/components/ui/AdZone";
import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/ui/JsonLd";
import {
  getFeaturedArticles,
  getPublishedArticles,
  getPopularArticles,
  getArticlesByCategory,
  getBreakingNews,
} from "@/lib/payload-helpers";
import { getSiteUrl } from "@/lib/env";

export const metadata = {
  title: "দৈনিক নিউ টাইমস - সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি",
  description:
    "দৈনিক নিউ টাইমস - বাংলাদেশের শীর্ষ সংবাদপত্র। জাতীয়, আন্তর্জাতিক, রাজনীতি, খেলা, বিনোদন সকল সংবাদ।",
};

export const revalidate = 60;

export default async function HomePage() {
  const [
    featuredResult,
    latestResult,
    popularResult,
    breakingNews,
    sportsResult,
    politicsResult,
    financeResult,
    educationResult,
    techResult,
    countryResult,
    entertainmentResult,
    diasporaResult,
    editorialResult,
  ] = await Promise.all([
    getFeaturedArticles(6),
    getPublishedArticles(10),
    getPopularArticles(5),
    getBreakingNews(),
    getArticlesByCategory("sports", 8),
    getArticlesByCategory("politics", 8),
    getArticlesByCategory("finance", 8),
    getArticlesByCategory("education", 8),
    getArticlesByCategory("technology", 8),
    getArticlesByCategory("country", 5),
    getArticlesByCategory("entertainment", 5),
    getArticlesByCategory("diaspora", 5),
    getArticlesByCategory("editorial", 5),
  ]);

  const featured = featuredResult.docs;
  const latest = latestResult.docs;
  const popular = popularResult.docs;
  const headlines = (breakingNews as any)?.headlines || [];

  const sports = sportsResult?.articles?.docs || [];
  const regional = countryResult?.articles?.docs || [];
  const entertainment = entertainmentResult?.articles?.docs || [];
  const diaspora = diasporaResult?.articles?.docs || [];
  const editorial = editorialResult?.articles?.docs || [];

  // Build category tabs data
  const categoryTabs = [
    { name: "রাজনীতি", slug: "politics", articles: politicsResult?.articles?.docs || [] },
    { name: "অর্থ-বাণিজ্য", slug: "finance", articles: financeResult?.articles?.docs || [] },
    { name: "শিক্ষাঙ্গন", slug: "education", articles: educationResult?.articles?.docs || [] },
    { name: "তথ্য-প্রযুক্তি", slug: "technology", articles: techResult?.articles?.docs || [] },
  ];

  // Use featured articles as photo gallery (articles with images)
  const galleryImages = featured.filter((a: any) => a.featuredImage).slice(0, 6);

  const siteUrl = getSiteUrl();

  return (
    <>
      {/* Schema.org JSON-LD */}
      <JsonLd data={websiteJsonLd(siteUrl)} />
      <JsonLd data={organizationJsonLd(siteUrl)} />

      {/* Breaking News Ticker */}
      <BreakingTicker headlines={headlines} />

      {/* Header Ad */}
      <div className="max-w-300 mx-auto px-4 py-3 hidden md:block">
        <AdZone slot="header-banner" />
      </div>

      <div className="max-w-300 mx-auto px-4">
        {/* Hero + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Hero — 9 cols */}
          <div className="lg:col-span-9">
            <HeroSection featured={featured} latest={latest} />
          </div>

          {/* Right Sidebar — 3 cols */}
          <aside className="lg:col-span-3 space-y-4">
            <LiveIndicator />
            <ArchivePicker />
            <AdZone slot="sidebar" className="hidden lg:flex" />
            <LatestPopularTabs latest={latest} popular={popular} />
          </aside>
        </div>
      </div>

      {/* Category Tab Section — Blue background */}
      <CategoryTabSection tabs={categoryTabs} />

      {/* Ad between sections */}
      <div className="max-w-300 mx-auto px-4 py-3 hidden md:block">
        <AdZone slot="between-sections" />
      </div>

      {/* Sports Carousel — Blue background */}
      <SportsCarousel articles={sports} />

      {/* Regional Section */}
      <RegionalSection articles={regional} />

      {/* Three Column Section: Entertainment | Diaspora | Editorial */}
      <ThreeColumnSection
        columns={[
          { title: "বিনোদন", slug: "entertainment", articles: entertainment },
          { title: "প্রবাস", slug: "diaspora", articles: diaspora },
          { title: "সম্পাদকীয়", slug: "editorial", articles: editorial },
        ]}
      />

      {/* Photo Gallery */}
      <div className="max-w-300 mx-auto px-4">
        <section className="mb-8">
          <PhotoGallery images={galleryImages} />
        </section>
      </div>
    </>
  );
}

