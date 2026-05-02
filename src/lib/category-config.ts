export const ORDERED_CATEGORY_CONFIG = [
  { name: "জাতীয়", slug: "national", displayOrder: 1, color: "#01284E" },
  { name: "বিদেশ", slug: "international", displayOrder: 2, color: "#01284E" },
  { name: "ময়মনসিংহ", slug: "mymensingh", displayOrder: 3, color: "#01284E" },
  { name: "আইন-আদালত", slug: "law-court", displayOrder: 4, color: "#7c2d12" },
  { name: "স্বাস্থ-শিক্ষা", slug: "health-education", displayOrder: 5, color: "#0f766e" },
  { name: "খেলা", slug: "sports", displayOrder: 6, color: "#0d6efd" },
  { name: "সংস্কৃতি", slug: "culture", displayOrder: 7, color: "#9333ea" },
  { name: "গবেষনা-উন্নয়ন", slug: "research-development", displayOrder: 8, color: "#1d4ed8" },
  { name: "মতামত", slug: "opinion", displayOrder: 9, color: "#d92028" },
] as const;

export const ORDERED_CATEGORY_SLUGS = ORDERED_CATEGORY_CONFIG.map((category) => category.slug);
export const ORDERED_CATEGORY_NAMES = ORDERED_CATEGORY_CONFIG.map((category) => category.name);

type ConfiguredCategory = (typeof ORDERED_CATEGORY_CONFIG)[number];

const CONFIGURED_CATEGORY_BY_SLUG = new Map<string, ConfiguredCategory>(
  ORDERED_CATEGORY_CONFIG.map((category) => [category.slug, category]),
);

const CONFIGURED_CATEGORY_BY_NAME = new Map<string, ConfiguredCategory>(
  ORDERED_CATEGORY_CONFIG.map((category) => [category.name, category]),
);

export function getConfiguredCategoryBySlug(slug: string) {
  return CONFIGURED_CATEGORY_BY_SLUG.get(slug);
}

export function getConfiguredCategoryByName(name: string) {
  return CONFIGURED_CATEGORY_BY_NAME.get(name);
}

export function sortConfiguredCategories<T extends { slug: string }>(categories: T[]) {
  const orderMap = new Map<string, number>(ORDERED_CATEGORY_SLUGS.map((slug, index) => [slug, index]));

  return [...categories].sort((left, right) => {
    const leftOrder = orderMap.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = orderMap.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder;
  });
}