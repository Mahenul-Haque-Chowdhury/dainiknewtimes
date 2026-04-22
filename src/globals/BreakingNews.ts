import type { GlobalConfig } from "payload";

export const BreakingNews: GlobalConfig = {
  slug: "breaking-news",
  label: "Breaking News (শিরোনাম)",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "headlines",
      type: "array",
      label: "Headlines (শিরোনাম সমূহ)",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
          label: "Headline Text (শিরোনাম)",
        },
        {
          name: "link",
          type: "text",
          label: "Link (লিংক)",
          admin: {
            description: "Optional: link to the full article",
          },
        },
        {
          name: "isActive",
          type: "checkbox",
          defaultValue: true,
          label: "Active (সক্রিয়)",
        },
      ],
    },
  ],
};
