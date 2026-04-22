import { describe, expect, it } from "vitest";

import {
  buildPublishedArticlesWhere,
  buildPublishedEPaperWhere,
  buildPublishedSlugWhere,
} from "@/lib/payload-helpers";

describe("payload helper query builders", () => {
  it("builds published-only where clause without date", () => {
    expect(buildPublishedArticlesWhere()).toEqual({
      status: { equals: "published" },
    });
  });

  it("builds published + date range where clause", () => {
    const where = buildPublishedArticlesWhere("2026-04-19") as {
      and: [
        { status: { equals: string } },
        { publishDate: { greater_than_equal: string; less_than: string } }
      ];
    };

    expect(where.and[0].status.equals).toBe("published");
    expect(where.and[1].publishDate.greater_than_equal.startsWith("2026-04-19")).toBe(true);
    expect(where.and[1].publishDate.less_than.startsWith("2026-04-20")).toBe(true);
  });

  it("builds published e-paper + issue date range where clause", () => {
    const where = buildPublishedEPaperWhere("2026-04-09") as {
      and: [
        { status: { equals: string } },
        { issueDate: { greater_than_equal: string; less_than: string } }
      ];
    };

    expect(where.and[0].status.equals).toBe("published");
    expect(where.and[1].issueDate.greater_than_equal.startsWith("2026-04-09")).toBe(true);
    expect(where.and[1].issueDate.less_than.startsWith("2026-04-10")).toBe(true);
  });

  it("builds published slug where clause", () => {
    expect(buildPublishedSlugWhere("my-article")).toEqual({
      and: [
        { slug: { equals: "my-article" } },
        { status: { equals: "published" } },
      ],
    });
  });
});
