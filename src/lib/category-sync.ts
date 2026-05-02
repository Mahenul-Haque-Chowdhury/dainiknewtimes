import type { Payload } from "payload";

import { ORDERED_CATEGORY_CONFIG } from "@/lib/category-config";

export async function syncConfiguredCategories(payload: Payload) {
  for (const category of ORDERED_CATEGORY_CONFIG) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: category.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "categories",
        id: existing.docs[0].id,
        data: category,
      });
      continue;
    }

    await payload.create({
      collection: "categories",
      data: category,
    });
  }
}