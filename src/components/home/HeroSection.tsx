"use client";

import React, { useEffect, useMemo, useState } from "react";
import NewsCard from "@/components/ui/NewsCard";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
  category?: any;
  publishDate?: string;
  excerpt?: string | null;
}

interface HeroSectionProps {
  featured: Article[];
  latest: Article[];
}

export default function HeroSection({ featured, latest }: HeroSectionProps) {
  const slides = useMemo(() => featured.slice(0, Math.max(featured.length, 1)), [featured]);
  const [activeSlide, setActiveSlide] = useState(0);
  const mainStory = slides[activeSlide] || null;
  const sideStories = latest.slice(0, 4);
  const bottomStories = latest.slice(4, 6);

  useEffect(() => {
    if (slides.length <= 1) {
      setActiveSlide(0);
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide < slides.length) return;
    setActiveSlide(0);
  }, [activeSlide, slides.length]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <section className="mb-4">
      {/* Top row: featured + sidebar stories */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main featured story */}
        <div className="md:col-span-7">
          {mainStory ? (
            <div className="relative">
              <NewsCard
                title={mainStory.title}
                slug={mainStory.slug}
                image={mainStory.featuredImage}
                category={mainStory.category}
                variant="overlay"
                priority
              />

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl text-white transition hover:bg-black/65"
                    aria-label="আগের সংবাদ"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl text-white transition hover:bg-black/65"
                    aria-label="পরের সংবাদ"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.slug}
                        type="button"
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          index === activeSlide ? "bg-white" : "bg-white/45 hover:bg-white/70"
                        }`}
                        aria-label={`স্লাইড ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-4/3 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              কোনো প্রধান সংবাদ নেই
            </div>
          )}
        </div>

        {/* Side stories */}
        <div className="md:col-span-5 space-y-3">
          {sideStories.length > 0
            ? sideStories.map((article) => (
                <NewsCard
                  key={article.slug}
                  title={article.title}
                  slug={article.slug}
                  image={article.featuredImage}
                  date={article.publishDate}
                  variant="medium"
                />
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-24 h-16 bg-gray-200 rounded shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Below hero — 2 cards */}
      {bottomStories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {bottomStories.map((article) => (
            <NewsCard
              key={article.slug}
              title={article.title}
              slug={article.slug}
              image={article.featuredImage}
              date={article.publishDate}
              variant="medium"
            />
          ))}
        </div>
      )}
    </section>
  );
}

