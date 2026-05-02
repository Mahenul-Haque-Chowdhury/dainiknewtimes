import type { CollectionConfig } from "payload";

import { isAdminOrEditor } from "@/lib/access";
import { logInfo } from "@/lib/logger";
import { slugify } from "@/lib/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    group: "Publishing",
  },
  access: {
    read: () => true,
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

        if (typeof data.slug === "string" && data.slug.trim().length > 0) {
          data.slug = slugify(data.slug);
        } else if (typeof data.name === "string") {
          data.slug = slugify(data.name);
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
