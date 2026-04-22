"use server";

import { incrementViewCount } from "@/lib/payload-helpers";
import { logWarn } from "@/lib/logger";

export async function trackView(articleId: number | string) {
  try {
    await incrementViewCount(articleId);
  } catch (error) {
    logWarn("Failed to increment article view count", {
      articleId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Silently fail — view tracking is non-critical
  }
}
