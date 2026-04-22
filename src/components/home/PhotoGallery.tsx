"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { getMediaSizeUrl } from "@/lib/utils";

interface GalleryImage {
  title?: string;
  featuredImage?: any;
  slug?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % Math.max(images.length, 1));
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % Math.max(images.length, 1));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2 border-b pb-2">
          📷 ফটো গ্যালারী
        </h2>
        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400">
          কোনো ছবি নেই
        </div>
      </div>
    );
  }

  const currentImage = images[current];

  return (
    <div>
      <h2 className="text-base font-bold mb-3 flex items-center gap-2 border-b pb-2">
        📷 ফটো গ্যালারী
      </h2>

      {/* Main image */}
      <div className="relative aspect-video bg-gray-900 rounded overflow-hidden mb-2 group">
        {currentImage?.featuredImage ? (
          <Image
            src={getMediaSizeUrl(currentImage.featuredImage, "large")}
            alt={currentImage.title || "Photo"}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}

        {/* Caption overlay */}
        {currentImage?.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3">
            <p className="text-white text-sm font-semibold line-clamp-2">
              {currentImage.title}
            </p>
          </div>
        )}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          ›
        </button>

        {/* Counter */}
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {current + 1}/{images.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-16 h-11 relative rounded overflow-hidden border-2 transition ${
              i === current ? "border-primary-red" : "border-transparent opacity-70 hover:opacity-100"
            }`}
            aria-label={`Image ${i + 1}`}
          >
            {img.featuredImage ? (
              <Image
                src={getMediaSizeUrl(img.featuredImage, "thumbnail")}
                alt={img.title || `Photo ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

