export function getMediaUrl(
  media: { url?: string } | string | null | undefined
): string {
  if (!media) return "/images/placeholder.svg";
  if (typeof media === "string") return media;
  return media.url || "/images/placeholder.svg";
}

export function getMediaSizeUrl(
  media: { url?: string; sizes?: Record<string, { url?: string }> } | null | undefined,
  size: "thumbnail" | "card" | "medium" | "large"
): string {
  if (!media) return "/images/placeholder.svg";
  if (media.sizes?.[size]?.url) return media.sizes[size].url!;
  return media.url || "/images/placeholder.svg";
}
