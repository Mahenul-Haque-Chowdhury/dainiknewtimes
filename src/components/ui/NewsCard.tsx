import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaSizeUrl } from "@/lib/utils";
import { formatBengaliDate } from "@/lib/bengali-date";

type NewsCardVariant = "large" | "medium" | "small" | "overlay";

interface NewsCardProps {
  title: string;
  slug: string;
  image?: { url?: string; sizes?: Record<string, { url?: string }> } | null;
  category?: { name?: string; slug?: string } | null;
  date?: string;
  variant?: NewsCardVariant;
  excerpt?: string;
  priority?: boolean;
}

export default function NewsCard({
  title,
  slug,
  image,
  category,
  date,
  variant = "medium",
  excerpt,
  priority = false,
}: NewsCardProps) {
  const href = `/post/${slug}`;

  const imageSizesByVariant: Record<NewsCardVariant, string> = {
    overlay: "(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 820px",
    large: "(max-width: 768px) 100vw, 66vw",
    small: "80px",
    medium: "96px",
  };

  if (variant === "overlay") {
    return (
      <Link href={href} className="block relative overflow-hidden rounded group">
        <div className="aspect-4/3 bg-gray-200 relative">
          {image ? (
            <Image
              src={getMediaSizeUrl(image, "large")}
              alt={title}
              fill
              priority={priority}
              sizes={imageSizesByVariant.overlay}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {category?.name && (
              <span className="bg-primary-red text-xs px-2 py-0.5 rounded mb-2 inline-block font-medium">
                {category.name}
              </span>
            )}
            <h2 className="text-lg font-bold leading-tight">{title}</h2>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={href} className="block group">
        <div className="aspect-16/10 bg-gray-200 relative overflow-hidden rounded">
          {image ? (
            <Image
              src={getMediaSizeUrl(image, "large")}
              alt={title}
              fill
              priority={priority}
              sizes={imageSizesByVariant.large}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
        <div className="mt-2">
          {category?.name && (
            <span className="text-primary-red text-xs font-bold">{category.name}</span>
          )}
          <h3 className="text-base font-bold leading-snug mt-1 group-hover:text-primary-red transition">
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{excerpt}</p>
          )}
          {date && (
            <p className="text-xs text-text-muted mt-1">{formatBengaliDate(date)}</p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "small") {
    return (
      <Link href={href} className="flex gap-3 items-start group">
        <div className="w-20 h-14 bg-gray-200 rounded shrink-0 relative overflow-hidden">
          {image ? (
            <Image
              src={getMediaSizeUrl(image, "thumbnail")}
              alt={title}
              fill
              priority={priority}
              sizes={imageSizesByVariant.small}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
        <h3 className="text-xs font-semibold leading-snug line-clamp-3 group-hover:text-primary-red transition">
          {title}
        </h3>
      </Link>
    );
  }

  // medium (default)
  return (
    <Link href={href} className="flex gap-3 items-start group">
      <div className="w-24 h-16 bg-gray-200 rounded shrink-0 relative overflow-hidden">
        {image ? (
          <Image
            src={getMediaSizeUrl(image, "card")}
            alt={title}
            fill
            priority={priority}
            sizes={imageSizesByVariant.medium}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold leading-snug line-clamp-3 group-hover:text-primary-red transition">
          {title}
        </h3>
        {date && (
          <p className="text-xs text-text-muted mt-1">{formatBengaliDate(date)}</p>
        )}
      </div>
    </Link>
  );
}

