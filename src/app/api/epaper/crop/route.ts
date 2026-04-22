import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import {
  areValidCoordinates,
  parseAllowedHosts,
  parseCropCoordinates,
  resolveCropSourceUrl,
} from "@/lib/epaper-crop";
import { reportError } from "@/lib/error-monitor";
import { getStringEnv } from "@/lib/env";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.EPAPER_CROP_RATE_LIMIT_MAX || "30");
const FETCH_TIMEOUT_MS = Number(process.env.EPAPER_CROP_FETCH_TIMEOUT_MS || "10000");
const MAX_IMAGE_BYTES = Number(process.env.EPAPER_CROP_MAX_BYTES || "10485760");

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const globalRateLimit = globalThis as typeof globalThis & {
  __epaperCropRateLimit?: Map<string, RateLimitBucket>;
};

const rateLimitBuckets = globalRateLimit.__epaperCropRateLimit ?? new Map<string, RateLimitBucket>();
globalRateLimit.__epaperCropRateLimit = rateLimitBuckets;

function getLocalMediaFilePath(sourceUrl: URL): string | null {
  if (sourceUrl.pathname.startsWith("/api/media/file/")) {
    const encodedFilename = sourceUrl.pathname.slice("/api/media/file/".length);
    if (!encodedFilename) return null;

    return path.join(process.cwd(), "media", decodeURIComponent(encodedFilename));
  }

  if (sourceUrl.pathname.startsWith("/media/")) {
    const encodedFilename = sourceUrl.pathname.slice("/media/".length);
    if (!encodedFilename) return null;

    return path.join(process.cwd(), "media", decodeURIComponent(encodedFilename));
  }

  return null;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  for (const [bucketKey, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(bucketKey);
    }
  }

  const existing = rateLimitBuckets.get(key);

  if (!existing) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  rateLimitBuckets.set(key, existing);
  return { limited: false };
}

/**
 * Dynamic image crop API for e-paper articles.
 * Like ebrahmaputra.com: /image/find/.../{x}px/{y}px/{w}px/{h}px
 *
 * Usage: GET /api/epaper/crop?src=/media/page.jpg&x=20&y=30&w=50&h=40
 * Coordinates are percentages (0-100) of original image.
 * Returns cropped JPEG.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const src = searchParams.get("src");

  const clientIp = getClientIp(request);
  const rateLimitKey = `crop:${clientIp}`;
  const rateLimitResult = isRateLimited(rateLimitKey);

  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds || 60),
        },
      }
    );
  }

  if (!src) {
    return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
  }

  const cropCoordinates = parseCropCoordinates(searchParams);

  // Validate range
  if (!areValidCoordinates(cropCoordinates)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const allowedHosts = parseAllowedHosts(
    getStringEnv("EPAPER_CROP_ALLOWED_HOSTS"),
    request.nextUrl.hostname
  );

  const sourceUrl = resolveCropSourceUrl({
    src,
    origin: request.nextUrl.origin,
    allowedHosts,
  });

  if (!sourceUrl) {
    return NextResponse.json(
      { error: "Invalid image source. Only allowed media hosts/paths are accepted." },
      { status: 400 }
    );
  }

  try {
    const localMediaFilePath = getLocalMediaFilePath(sourceUrl);

    const buffer = localMediaFilePath
      ? await readFile(localMediaFilePath)
      : await (async () => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

          const imageRes = await fetch(sourceUrl.toString(), {
            signal: controller.signal,
            headers: {
              Accept: "image/*",
            },
          });

          clearTimeout(timeout);

          if (!imageRes.ok) {
            throw new Error(`Image fetch failed with status ${imageRes.status}`);
          }

          const contentType = imageRes.headers.get("content-type") || "";
          if (!contentType.startsWith("image/")) {
            throw new Error("Unsupported content type");
          }

          const contentLength = parseInt(imageRes.headers.get("content-length") || "0", 10);
          if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
            throw new Error("Image too large");
          }

          return Buffer.from(await imageRes.arrayBuffer());
        })();

    if (buffer.length > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const metadata = await sharp(buffer).metadata();
    const imgW = metadata.width || 1;
    const imgH = metadata.height || 1;
    const { x, y, w, h } = cropCoordinates;

    // Convert percentage coordinates to pixel coordinates
    const cropX = Math.round((x / 100) * imgW);
    const cropY = Math.round((y / 100) * imgH);
    const cropW = Math.round((w / 100) * imgW);
    const cropH = Math.round((h / 100) * imgH);

    // Clamp values to image bounds
    const safeX = Math.max(0, Math.min(imgW - 1, cropX));
    const safeY = Math.max(0, Math.min(imgH - 1, cropY));
    const safeW = Math.max(1, Math.min(imgW - safeX, cropW));
    const safeH = Math.max(1, Math.min(imgH - safeY, cropH));

    const croppedBuffer = await sharp(buffer)
      .extract({ left: safeX, top: safeY, width: safeW, height: safeH })
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(new Uint8Array(croppedBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch (err: unknown) {
    await reportError({
      source: "epaper-crop-api",
      message: "Crop API failed",
      error: err,
      context: {
        src,
        ip: clientIp,
      },
    });

    return NextResponse.json(
      {
        error: "Crop failed",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
