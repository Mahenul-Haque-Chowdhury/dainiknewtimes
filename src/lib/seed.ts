import { getPayload } from "payload";
import { ORDERED_CATEGORY_CONFIG } from "@/lib/category-config";
import config from "../payload.config";

async function seed() {
  const payload = await getPayload({ config });
  const bootstrapAdminPassword = process.env.SEED_ADMIN_PASSWORD;

  console.log("🌱 Seeding categories...");

  for (const cat of ORDERED_CATEGORY_CONFIG) {
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
      await payload.update({
        collection: "categories",
        id: existing.docs[0].id,
        data: cat,
      });
      console.log(`  ↺ Synced: ${cat.name} (${cat.slug})`);
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

  await payload.updateGlobal({
    slug: "headlines",
    data: {
      items: [
        { text: "সর্বশেষ সংবাদ: প্রধান শিরোনাম এখানে প্রদর্শিত হবে", link: "/", isActive: true },
        { text: "আজকের গুরুত্বপূর্ণ খবর: দ্বিতীয় শিরোনাম", link: "/", isActive: true },
        { text: "আরও আপডেট: সংবাদ প্রবাহ অব্যাহত", link: "/", isActive: true },
      ],
    },
  });
  console.log("  ✓ Set headline strip items");

  // Set up breaking news
  await payload.updateGlobal({
    slug: "breaking-news",
    data: {
      items: [
        { text: "ব্রেকিং: গুরুত্বপূর্ণ আপডেট নিচের টিকারে দেখানো হবে", link: "/", isActive: true, durationMinutes: "60" },
        { text: "ফলো-আপ: পরবর্তী ব্রেকিং আপডেট", link: "/", isActive: true, durationMinutes: "90" },
        { text: "নিউজরুম অ্যালার্ট: জরুরি সর্বশেষ সংবাদ", link: "/", isActive: true, durationMinutes: "120" },
      ],
    },
  });
  console.log("  ✓ Set breaking news ticker items");

  console.log("\n✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
