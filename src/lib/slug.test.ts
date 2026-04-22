import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("normalizes spaces and case", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("removes unsupported symbols", () => {
    expect(slugify("News!!! ## 2026")).toBe("news-2026");
  });

  it("collapses duplicate dashes", () => {
    expect(slugify("one---two  three")).toBe("one-two-three");
  });
});
