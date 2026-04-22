import type { CollectionConfig } from "payload";

import { isAdminOrEditor } from "@/lib/access";
import { logInfo } from "@/lib/logger";

export const EPapers: CollectionConfig = {
  slug: "epapers",
  admin: {
    useAsTitle: "issueDate",
    defaultColumns: ["issueDate", "pageCount", "status"],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "zoneEditorLink",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/ZoneEditorLink",
        },
      },
    },
    {
      name: "issueDate",
      type: "date",
      required: true,
      unique: true,
      label: "Issue Date (প্রকাশের তারিখ)",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "headerZonePageNumber",
      type: "number",
      label: "Header Zone Page Number",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "headerZoneX",
      type: "number",
      label: "Header Zone X %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "headerZoneY",
      type: "number",
      label: "Header Zone Y %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "headerZoneW",
      type: "number",
      label: "Header Zone W %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "headerZoneH",
      type: "number",
      label: "Header Zone H %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "footerZonePageNumber",
      type: "number",
      label: "Footer Zone Page Number",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "footerZoneX",
      type: "number",
      label: "Footer Zone X %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "footerZoneY",
      type: "number",
      label: "Footer Zone Y %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "footerZoneW",
      type: "number",
      label: "Footer Zone W %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "footerZoneH",
      type: "number",
      label: "Footer Zone H %",
      admin: {
        condition: () => false,
      },
    },
    {
      name: "pages",
      type: "array",
      required: true,
      label: "Pages (পাতা)",
      minRows: 1,
      fields: [
        {
          name: "pageImage",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Page Image (পাতার ছবি)",
        },
        {
          name: "pageNumber",
          type: "number",
          required: true,
          label: "Page Number (পাতা নম্বর)",
        },
        {
          name: "articleClips",
          type: "array",
          label: "Article Clips (সংবাদের কাটিং)",
          admin: {
            description:
              "জোন এডিটর দিয়ে অঞ্চল নির্বাচন করুন অথবা প্রতিটি সংবাদের কাটা ছবিগুলো আপলোড করুন।",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Article Title (সংবাদের শিরোনাম)",
            },
            {
              name: "clipImages",
              type: "array",
              label: "Clip Images (কাটিং ছবি)",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "Image (ছবি)",
                },
                {
                  name: "caption",
                  type: "text",
                  label: "Caption (ক্যাপশন)",
                },
              ],
            },
            {
              name: "zoneX",
              type: "number",
              label: "Legacy Zone X %",
              admin: {
                condition: () => false,
              },
            },
            {
              name: "zoneY",
              type: "number",
              label: "Legacy Zone Y %",
              admin: {
                condition: () => false,
              },
            },
            {
              name: "zoneW",
              type: "number",
              label: "Legacy Zone W %",
              admin: {
                condition: () => false,
              },
            },
            {
              name: "zoneH",
              type: "number",
              label: "Legacy Zone H %",
              admin: {
                condition: () => false,
              },
            },
            {
              name: "continuedFrom",
              type: "text",
              label: "Legacy Article Group",
              admin: {
                condition: () => false,
              },
            },
            {
              name: "linkedArticleSlug",
              type: "text",
              label: "Online Article Slug (অনলাইন আর্টিকেল)",
            },
          ],
        },
      ],
    },
    {
      name: "pageCount",
      type: "number",
      label: "Total Pages (মোট পাতা)",
      admin: {
        readOnly: true,
        description: "Auto-calculated from pages array",
      },
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
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (!data) return data;

        if (data?.pages) {
          data.pageCount = data.pages.length;
        }

        logInfo("EPaper mutation", {
          operation,
          userId: req.user?.id,
          issueDate: data.issueDate,
        });

        return data;
      },
    ],
  },
};
