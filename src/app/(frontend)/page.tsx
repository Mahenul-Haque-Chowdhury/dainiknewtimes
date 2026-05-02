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
  getHeadlines,
  getHomepageCategoryTabs,
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
    headlinesResult,
    categoryTabs,
    sportsResult,
    mymensinghResult,
    cultureResult,
    researchResult,
    opinionResult,
  ] = await Promise.all([
    getFeaturedArticles(6),
    getPublishedArticles(10),
    getPopularArticles(5),
    getHeadlines(),
    getHomepageCategoryTabs(4, 8),
    getArticlesByCategory("sports", 8),
    getArticlesByCategory("mymensingh", 5),
    getArticlesByCategory("culture", 5),
    getArticlesByCategory("research-development", 5),
    getArticlesByCategory("opinion", 5),
  ]);

  const featured = featuredResult.docs;
  const latest = latestResult.docs;
  const popular = popularResult.docs;
  const headlines = ((headlinesResult as any)?.items || []).filter((item: any) => item.isActive !== false);

  const sports = sportsResult?.articles?.docs || [];
  const regional = mymensinghResult?.articles?.docs || [];
  const culture = cultureResult?.articles?.docs || [];
  const research = researchResult?.articles?.docs || [];
  const opinion = opinionResult?.articles?.docs || [];

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
      <SportsCarousel title="খেলা" slug="sports" articles={sports} />

      {/* Regional Section */}
      <RegionalSection title="ময়মনসিংহ" slug="mymensingh" articles={regional} />

      {/* Three Column Section */}
      <ThreeColumnSection
        columns={[
          { title: "সংস্কৃতি", slug: "culture", articles: culture },
          { title: "গবেষনা-উন্নয়ন", slug: "research-development", articles: research },
          { title: "মতামত", slug: "opinion", articles: opinion },
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

