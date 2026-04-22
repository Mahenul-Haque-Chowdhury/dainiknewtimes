import { getPayload } from "payload";
import config from "../payload.config";

const categories = [
  { name: "জাতীয়", slug: "national", displayOrder: 1, color: "#01284E" },
  { name: "দেশজুড়ে", slug: "country", displayOrder: 2, color: "#01284E" },
  { name: "আন্তর্জাতিক", slug: "international", displayOrder: 3, color: "#01284E" },
  { name: "শিক্ষাঙ্গন", slug: "education", displayOrder: 4, color: "#01284E" },
  { name: "রাজনীতি", slug: "politics", displayOrder: 5, color: "#d92028" },
  { name: "অর্থ-বাণিজ্য", slug: "finance", displayOrder: 6, color: "#01284E" },
  { name: "তথ্য-প্রযুক্তি", slug: "technology", displayOrder: 7, color: "#01284E" },
  { name: "খেলা", slug: "sports", displayOrder: 8, color: "#0d6efd" },
  { name: "বিনোদন", slug: "entertainment", displayOrder: 9, color: "#01284E" },
  { name: "প্রবাস", slug: "diaspora", displayOrder: 10, color: "#01284E" },
  { name: "লাইফস্টাইল", slug: "lifestyle", displayOrder: 11, color: "#01284E" },
  { name: "সম্পাদকীয়", slug: "editorial", displayOrder: 12, color: "#01284E" },
  { name: "ধর্ম", slug: "religion", displayOrder: 13, color: "#01284E" },
];

async function seed() {
  const payload = await getPayload({ config });
  const bootstrapAdminPassword = process.env.SEED_ADMIN_PASSWORD;

  console.log("🌱 Seeding categories...");

  for (const cat of categories) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "categories",
        data: cat,
      });
      console.log(`  ✓ Created: ${cat.name} (${cat.slug})`);
    } else {
      console.log(`  — Skipped: ${cat.name} (already exists)`);
    }
  }

  // Create admin user if none exists
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.docs.length === 0) {
    if (!bootstrapAdminPassword) {
      throw new Error("SEED_ADMIN_PASSWORD is required when creating the initial admin user.");
    }

    await payload.create({
      collection: "users",
      data: {
        name: "Admin",
        email: "admin@dainiknewtimes.com",
        password: bootstrapAdminPassword,
        role: "admin",
      },
    });
    console.log("  ✓ Created admin user: admin@dainiknewtimes.com");
  }

  // Set up breaking news
  await payload.updateGlobal({
    slug: "breaking-news",
    data: {
      headlines: [
        { text: "সর্বশেষ সংবাদ: প্রধান শিরোনাম এখানে প্রদর্শিত হবে", link: "/", isActive: true },
        { text: "আজকের গুরুত্বপূর্ণ খবর: দ্বিতীয় শিরোনাম", link: "/", isActive: true },
        { text: "তৃতীয় শিরোনাম: ব্রেকিং নিউজ আপডেট", link: "/", isActive: true },
      ],
    },
  });
  console.log("  ✓ Set breaking news headlines");

  console.log("\n✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
