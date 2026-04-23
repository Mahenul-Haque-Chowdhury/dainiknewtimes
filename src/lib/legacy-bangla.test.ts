import { describe, expect, it } from "vitest";

import {
  clipboardUsesLegacyBanglaFont,
  convertLegacyBanglaToUnicode,
  looksLikeLegacyBanglaText,
  shouldConvertLegacyBanglaPaste,
} from "@/lib/legacy-bangla";

describe("legacy Bangla helpers", () => {
  it("detects Sutonny or Jugantor font metadata in pasted HTML", () => {
    expect(clipboardUsesLegacyBanglaFont('<span style="font-family:SutonnyMJ">Avgvi</span>')).toBe(true);
    expect(clipboardUsesLegacyBanglaFont('<span style="font-family:JugantorMJ">Avgvi</span>')).toBe(true);
    expect(clipboardUsesLegacyBanglaFont('<span style="font-family:Noto Sans Bengali">আমার</span>')).toBe(false);
  });

  it("detects legacy-only symbol text and ignores Unicode Bangla", () => {
    expect(looksLikeLegacyBanglaText("†mvbvi")).toBe(true);
    expect(looksLikeLegacyBanglaText("আমার সোনার বাংলা")).toBe(false);
  });

  it("converts Bijoy text to Unicode", () => {
    expect(convertLegacyBanglaToUnicode("Avgvi †mvbvi evsjv")).toBe("আমার সোনার বাংলা");
  });

  it("only converts paste when a legacy signal exists", () => {
    expect(
      shouldConvertLegacyBanglaPaste({
        html: '<span style="font-family:SutonnyMJ">Avgvi</span>',
        text: "Avgvi",
      }),
    ).toBe(true);

    expect(
      shouldConvertLegacyBanglaPaste({
        html: null,
        text: "Plain English text",
      }),
    ).toBe(false);
  });
});