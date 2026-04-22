import type { CollectionConfig } from "payload";

import { isLoggedIn, mediaUpdateDeleteAccess } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: isLoggedIn,
    update: mediaUpdateDeleteAccess,
    delete: mediaUpdateDeleteAccess,
  },
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 150, height: 150, position: "centre" },
      { name: "card", width: 400, height: 300, position: "centre" },
      { name: "medium", width: 720, height: undefined, position: "centre" },
      { name: "large", width: 1200, height: undefined, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text (বিকল্প টেক্সট)",
    },
    {
      name: "caption",
      type: "text",
      label: "Caption (ক্যাপশন)",
    },
  ],
};
