import type { CollectionConfig } from "payload";

import { isAdmin, selfOrAdminAccess } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    group: "Administration",
  },
  access: {
    read: selfOrAdminAccess,
    create: isAdmin,
    update: selfOrAdminAccess,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name (পুরো নাম)",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "reporter",
      options: [
        { label: "Admin (অ্যাডমিন)", value: "admin" },
        { label: "Editor (সম্পাদক)", value: "editor" },
        { label: "Reporter (প্রতিবেদক)", value: "reporter" },
      ],
      label: "Role (ভূমিকা)",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Profile Photo (ছবি)",
    },
    {
      name: "bio",
      type: "textarea",
      label: "Bio (জীবনবৃত্তান্ত)",
    },
  ],
};
