import { describe, expect, it } from "vitest";

import { getMediaSizeUrl, getMediaUrl } from "@/lib/utils";

describe("media utils", () => {
  it("returns placeholder when media is missing", () => {
    expect(getMediaUrl(null)).toBe("/images/placeholder.svg");
  });

  it("returns url from string media", () => {
    expect(getMediaUrl("/media/image.jpg")).toBe("/media/image.jpg");
  });

  it("prefers requested size URL", () => {
    expect(
      getMediaSizeUrl(
        {
          url: "/media/original.jpg",
          sizes: {
            card: { url: "/media/card.jpg" },
          },
        },
        "card"
      )
    ).toBe("/media/card.jpg");
  });

  it("falls back to original URL when size missing", () => {
    expect(getMediaSizeUrl({ url: "/media/original.jpg" }, "large")).toBe("/media/original.jpg");
  });
});
