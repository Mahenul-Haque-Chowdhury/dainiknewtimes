import type { GlobalConfig } from "payload";

export const Headlines: GlobalConfig = {
  slug: "headlines",
  label: "Headlines (শিরোনাম)",
  admin: {
    group: "News Desk",
    description: "Top headline strip content for homepage and content surfaces.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Headline Items",
      labels: {
        singular: "Headline",
        plural: "Headlines",
      },
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
            description: "Optional link to the full article or landing page.",
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