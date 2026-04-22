import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings (সাইট সেটিংস)",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "নিউ টাইমস",
      label: "Site Name (সাইটের নাম)",
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি",
      label: "Tagline (ট্যাগলাইন)",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Logo (লোগো)",
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Social Links (সোশ্যাল মিডিয়া)",
      fields: [
        { name: "facebook", type: "text", label: "Facebook URL" },
        { name: "youtube", type: "text", label: "YouTube URL" },
        { name: "twitter", type: "text", label: "X / Twitter URL" },
        { name: "instagram", type: "text", label: "Instagram URL" },
      ],
    },
    {
      name: "contactInfo",
      type: "group",
      label: "Contact Info (যোগাযোগ)",
      fields: [
        { name: "phone", type: "text", label: "Phone (ফোন)" },
        { name: "email", type: "text", label: "Email (ইমেইল)" },
        { name: "address", type: "textarea", label: "Address (ঠিকানা)" },
      ],
    },
    {
      name: "editorInfo",
      type: "group",
      label: "Editor Info (সম্পাদক তথ্য)",
      fields: [
        { name: "chiefEditor", type: "text", label: "Chief Editor (প্রধান সম্পাদক)" },
        { name: "editor", type: "text", label: "Editor (সম্পাদক)" },
        { name: "publisherInfo", type: "textarea", label: "Publisher Info (প্রকাশক তথ্য)" },
      ],
    },
    {
      name: "footerText",
      type: "textarea",
      label: "Footer Copyright Text",
      defaultValue: "স্বত্ব © ২০২৬ দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।",
    },
  ],
};
