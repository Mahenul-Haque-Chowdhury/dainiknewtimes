import type { GlobalConfig } from "payload";

export const BreakingNews: GlobalConfig = {
  slug: "breaking-news",
  label: "Breaking News (ব্রেকিং নিউজ)",
  admin: {
    group: "News Desk",
    description: "Urgent ticker items shown in the fixed bottom breaking news bar.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Breaking Items",
      labels: {
        singular: "Breaking item",
        plural: "Breaking items",
      },
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
          label: "Breaking Text (টিকার টেক্সট)",
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
          name: "durationMinutes",
          type: "select",
          required: true,
          defaultValue: "60",
          label: "Timer",
          options: [
            { label: "30 Minutes", value: "30" },
            { label: "1 Hour", value: "60" },
            { label: "1.5 Hours", value: "90" },
            { label: "2 Hours", value: "120" },
            { label: "3 Hours", value: "180" },
            { label: "6 Hours", value: "360" },
          ],
          admin: {
            description: "Select how long this breaking item should stay active after saving.",
          },
        },
        {
          name: "expiresAt",
          type: "date",
          label: "Expires At",
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: "dayAndTime",
            },
            description: "Automatically generated from the timer when you save.",
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
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data || !Array.isArray(data.items)) {
          return data;
        }

        data.items = data.items.map((item: Record<string, unknown>) => {
          if (item?.isActive === false) {
            return {
              ...item,
              expiresAt: null,
            };
          }

          const duration = Number(item?.durationMinutes || 0);

          if (!Number.isFinite(duration) || duration <= 0) {
            return {
              ...item,
              expiresAt: null,
            };
          }

          return {
            ...item,
            expiresAt: new Date(Date.now() + duration * 60 * 1000).toISOString(),
          };
        });

        return data;
      },
    ],
  },
};
