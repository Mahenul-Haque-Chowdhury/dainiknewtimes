import type { CollectionConfig } from "payload";

import { canCreateArticle, canUpdateDeleteArticle } from "@/lib/access";
import { logInfo } from "@/lib/logger";
import { slugify } from "@/lib/slug";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishDate"],
  },
  access: {
    read: () => true,
    create: canCreateArticle,
    update: canUpdateDeleteArticle,
    delete: canUpdateDeleteArticle,
  },
  fields: [
    {
      name: "legacyBanglaPasteHelper",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/admin/LegacyBanglaPasteHelper",
        },
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title (শিরোনাম)",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug (URL)",
      admin: {
        description: "Auto-generated from title. URL-friendly identifier.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Excerpt (সারসংক্ষেপ)",
      admin: {
        description: "Short summary shown in cards and SEO descriptions",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Content (বিষয়বস্তু)",
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Featured Image (প্রধান ছবি)",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      label: "Category (ক্যাটাগরি)",
    },
    {
      name: "reporter",
      type: "relationship",
      relationTo: "users",
      label: "Reporter (প্রতিবেদক)",
    },
    {
      name: "publishDate",
      type: "date",
      required: true,
      label: "Publish Date (প্রকাশের তারিখ)",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft (খসড়া)", value: "draft" },
        { label: "Published (প্রকাশিত)", value: "published" },
      ],
      label: "Status (অবস্থা)",
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      label: "Featured (প্রধান সংবাদ)",
      admin: {
        description: "Show in homepage hero section",
      },
    },
    {
      name: "isBreaking",
      type: "checkbox",
      defaultValue: false,
      label: "Breaking News (শিরোনাম)",
      admin: {
        description: "Show in breaking news ticker",
      },
    },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      label: "View Count",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "tags",
      type: "array",
      label: "Tags (ট্যাগ)",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        if (typeof data.slug === "string" && data.slug.trim().length > 0) {
          data.slug = slugify(data.slug);
        } else if (typeof data.title === "string") {
          data.slug = slugify(data.title);
        }

        return data;
      },
    ],
    beforeChange: [
      ({ req, operation, data }) => {
        if (!data) return data;

        logInfo("Article mutation", {
          operation,
          userId: req.user?.id,
          articleSlug: data.slug,
        });

        return data;
      },
    ],
  },
};
