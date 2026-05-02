"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaSizeUrl } from "@/lib/utils";

interface Article {
  title: string;
  slug: string;
  featuredImage?: any;
}

interface SportsCarouselProps {
  title: string;
  slug: string;
  articles: Article[];
}

export default function SportsCarousel({ title, slug, articles }: SportsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxSlide = Math.max(0, articles.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  }, [maxSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  useEffect(() => {
    if (isPaused || articles.length <= visibleCount) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isPaused, articles.length, nextSlide]);

  if (articles.length === 0) {
    return (
      <section className="bg-section-blue py-8 mb-8">
        <div className="max-w-300 mx-auto px-4">
          <SectionHeader title={title} slug={slug} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow">
                <div className="aspect-4/3 bg-gray-300" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-section-blue py-8 mb-8">
      <div className="max-w-300 mx-auto px-4">
        <SectionHeader title={title} slug={slug} />

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / visibleCount)}%)`,
              }}
            >
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/post/${article.slug}`}
                  className="bg-white rounded overflow-hidden shadow group block shrink-0"
                  style={{ width: `calc(${100 / visibleCount}% - ${(3 * 16) / visibleCount}px)` }}
                >
                  <div className="aspect-4/3 relative overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={getMediaSizeUrl(article.featuredImage, "card")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {articles.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 rounded-full shadow flex items-center justify-center transition z-10"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => nextSlide()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 rounded-full shadow flex items-center justify-center transition z-10"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: maxSlide + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === currentSlide ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-white text-xl font-bold flex items-center gap-2">
        <span>☰</span> {title}
        <span className="flex-1 h-0.75 bg-linear-to-r from-red-500 via-blue-500 to-red-500 ml-2" />
      </h2>
      <Link href={`/${slug}`} className="shrink-0 text-sm font-semibold text-white/85 hover:text-white">
        আরও ›
      </Link>
    </div>
  );
}

