export interface CropCoordinates {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ALLOWED_MEDIA_PATHS = ["/media/", "/api/media/file/"];

export function parseCropCoordinates(searchParams: URLSearchParams): CropCoordinates {
  return {
    x: parseFloat(searchParams.get("x") || "0"),
    y: parseFloat(searchParams.get("y") || "0"),
    w: parseFloat(searchParams.get("w") || "100"),
    h: parseFloat(searchParams.get("h") || "100"),
  };
}

export function areValidCoordinates({ x, y, w, h }: CropCoordinates): boolean {
  if (![x, y, w, h].every((value) => Number.isFinite(value))) {
    return false;
  }

  if (x < 0 || y < 0 || w <= 0 || h <= 0) {
    return false;
  }

  return x + w <= 101 && y + h <= 101;
}

export function isAllowedMediaPath(pathname: string): boolean {
  return ALLOWED_MEDIA_PATHS.some((allowedPath) => pathname.startsWith(allowedPath));
}

export function parseAllowedHosts(value: string | undefined, fallbackHost: string): Set<string> {
  const result = new Set<string>([fallbackHost.toLowerCase()]);

  if (!value) return result;

  value
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
    .forEach((host) => result.add(host));

  return result;
}

interface ResolveCropSourceUrlArgs {
  src: string;
  origin: string;
  allowedHosts: Set<string>;
}

export function resolveCropSourceUrl({
  src,
  origin,
  allowedHosts,
}: ResolveCropSourceUrlArgs): URL | null {
  let url: URL;

  try {
    url = src.startsWith("http://") || src.startsWith("https://")
      ? new URL(src)
      : new URL(src, origin);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  if (!allowedHosts.has(url.hostname.toLowerCase())) {
    return null;
  }

  if (!isAllowedMediaPath(url.pathname)) {
    return null;
  }

  return url;
}
