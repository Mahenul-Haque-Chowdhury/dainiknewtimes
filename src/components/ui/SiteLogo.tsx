import React from "react";
import Image from "next/image";

interface SiteLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export default function SiteLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: SiteLogoProps) {
  return (
    <span className={`block ${className}`}>
      <Image
        src="/images/dainiknewtimes-logo.png"
        alt="দৈনিক নিউ টাইমস"
        width={780}
        height={244}
        priority={priority}
        className={`h-auto w-full ${imageClassName}`}
        sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 280px"
      />
    </span>
  );
}