"use client";

import React, { useEffect } from "react";

interface AdZoneProps {
  slot: "header-banner" | "sidebar" | "in-article" | "between-sections";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const slotSizes: Record<AdZoneProps["slot"], { w: number; h: number; label: string }> = {
  "header-banner": { w: 728, h: 90, label: "বিজ্ঞাপন (728×90)" },
  sidebar: { w: 300, h: 250, label: "বিজ্ঞাপন (300×250)" },
  "in-article": { w: 728, h: 90, label: "বিজ্ঞাপন" },
  "between-sections": { w: 970, h: 90, label: "বিজ্ঞাপন (970×90)" },
};

const adSlotByPlacement: Record<AdZoneProps["slot"], string | undefined> = {
  "header-banner": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  "in-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
  "between-sections": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN,
};

export default function AdZone({ slot, className = "" }: AdZoneProps) {
  const size = slotSizes[slot];
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = adSlotByPlacement[slot];
  const isAdConfigured = Boolean(adClient && adSlot);

  useEffect(() => {
    if (!isAdConfigured) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Keep UI resilient even if ad script fails.
    }
  }, [isAdConfigured, slot]);

  if (isAdConfigured) {
    return (
      <ins
        className={`adsbygoogle block overflow-hidden mx-auto ${className}`}
        style={{ width: "100%", maxWidth: size.w, height: size.h }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-xs overflow-hidden mx-auto ${className}`}
      style={{ maxWidth: size.w, height: size.h }}
      data-ad-slot={slot}
    >
      {size.label}
    </div>
  );
}
