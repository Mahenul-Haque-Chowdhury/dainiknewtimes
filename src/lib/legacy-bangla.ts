import { bijoyToUnicode } from "@abdalgolabs/ansi-unicode-converter";

const LEGACY_FONT_PATTERN = /(sutonny|sutonnymj|sutonnyomj|jugantor|jugantormj)/i;
const LEGACY_SYMBOL_PATTERN = /[†‡•–—™œšžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿]/;
const BANGLA_UNICODE_PATTERN = /[\u0980-\u09FF]/;

export function clipboardUsesLegacyBanglaFont(html?: string | null) {
  if (!html) {
    return false;
  }

  return LEGACY_FONT_PATTERN.test(html);
}

export function looksLikeLegacyBanglaText(text?: string | null) {
  if (!text) {
    return false;
  }

  if (BANGLA_UNICODE_PATTERN.test(text)) {
    return false;
  }

  return LEGACY_SYMBOL_PATTERN.test(text);
}

export function shouldConvertLegacyBanglaPaste(args: { html?: string | null; text?: string | null }) {
  return clipboardUsesLegacyBanglaFont(args.html) || looksLikeLegacyBanglaText(args.text);
}

export function convertLegacyBanglaToUnicode(text: string) {
  if (!text) {
    return text;
  }

  return bijoyToUnicode(text);
}