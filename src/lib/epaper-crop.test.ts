import { describe, expect, it } from "vitest";

import {
  areValidCoordinates,
  isAllowedMediaPath,
  parseAllowedHosts,
  parseCropCoordinates,
  resolveCropSourceUrl,
} from "@/lib/epaper-crop";

describe("epaper crop helpers", () => {
  it("parses crop coordinates from URL params", () => {
    const params = new URLSearchParams("x=10&y=20&w=30&h=40");
    expect(parseCropCoordinates(params)).toEqual({ x: 10, y: 20, w: 30, h: 40 });
  });

  it("validates coordinate boundaries", () => {
    expect(areValidCoordinates({ x: 0, y: 0, w: 50, h: 50 })).toBe(true);
    expect(areValidCoordinates({ x: 80, y: 80, w: 30, h: 30 })).toBe(false);
  });

  it("validates media path allowlist", () => {
    expect(isAllowedMediaPath("/media/file.jpg")).toBe(true);
    expect(isAllowedMediaPath("/secret/file.jpg")).toBe(false);
  });

  it("resolves allowed absolute and relative source URLs", () => {
    const allowedHosts = parseAllowedHosts("cdn.example.com", "localhost");

    const relative = resolveCropSourceUrl({
      src: "/media/test.jpg",
      origin: "http://localhost:3000",
      allowedHosts,
    });

    expect(relative?.toString()).toBe("http://localhost:3000/media/test.jpg");

    const absoluteAllowed = resolveCropSourceUrl({
      src: "https://cdn.example.com/media/test.jpg",
      origin: "http://localhost:3000",
      allowedHosts,
    });

    expect(absoluteAllowed?.toString()).toBe("https://cdn.example.com/media/test.jpg");

    const blocked = resolveCropSourceUrl({
      src: "https://evil.example.com/media/test.jpg",
      origin: "http://localhost:3000",
      allowedHosts,
    });

    expect(blocked).toBeNull();
  });
});
