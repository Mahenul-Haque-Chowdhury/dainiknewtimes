import type { CollectionConfig } from "payload";

import {
  getConfiguredCategoryByName,
  getConfiguredCategoryBySlug,
  ORDERED_CATEGORY_SLUGS,
} from "@/lib/category-config";
import { isAdminOrEditor } from "@/lib/access";
import { logInfo } from "@/lib/logger";
import { slugify } from "@/lib/slug";

const configuredCategoryReadAccess = () => ({
  slug: {
    in: [...ORDERED_CATEGORY_SLUGS],
  },
});

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    group: "Publishing",
    defaultColumns: ["displayOrder", "name", "slug", "color"],
  },
  access: {
    read: configuredCategoryReadAccess,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Category Name (ক্যাটাগরি নাম)",
      validate: (value: unknown) => {
        if (typeof value !== "string") {
          return "Category name is required.";
        }

        return getConfiguredCategoryByName(value.trim())
          ? true
          : "Use one of the approved category names from the navigation strip.";
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug (URL)",
      admin: {
        description: "URL-friendly name (e.g., national, international)",
      },
      validate: (value: unknown) => {
        if (typeof value !== "string") {
          return "Slug is required.";
        }

        return getConfiguredCategoryBySlug(slugify(value))
          ? true
          : "Use one of the approved category slugs from the navigation strip.";
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description (বিবরণ)",
    },
    {
      name: "color",
      type: "text",
      label: "Color (রং)",
      defaultValue: "#01284E",
      admin: {
        description: "Hex color for category header (e.g., #01284E)",
      },
    },
    {
      name: "displayOrder",
      type: "number",
      label: "Display Order (প্রদর্শন ক্রম)",
      defaultValue: 0,
      admin: {
        description: "Lower number = appears first in navigation",
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        const normalizedSlug =
          typeof data.slug === "string" && data.slug.trim().length > 0
            ? slugify(data.slug)
            : typeof data.name === "string"
              ? slugify(data.name)
              : "";

        const normalizedName = typeof data.name === "string" ? data.name.trim() : "";
        const configuredCategory =
          getConfiguredCategoryBySlug(normalizedSlug) || getConfiguredCategoryByName(normalizedName);

        if (configuredCategory) {
          data.name = configuredCategory.name;
          data.slug = configuredCategory.slug;
          data.color = configuredCategory.color;
          data.displayOrder = configuredCategory.displayOrder;
        } else if (normalizedSlug) {
          data.slug = normalizedSlug;
        }

        return data;
      },
    ],
    beforeChange: [
      ({ req, operation, data }) => {
        if (!data) return data;

        logInfo("Category mutation", {
          operation,
          userId: req.user?.id,
          categorySlug: data.slug,
        });

        return data;
      },
    ],
  },
};
