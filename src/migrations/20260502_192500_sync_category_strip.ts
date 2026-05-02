import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "categories" ("name", "slug", "color", "display_order", "updated_at", "created_at")
    VALUES
      ('জাতীয়', 'national', '#01284E', 1, now(), now()),
      ('বিদেশ', 'international', '#01284E', 2, now(), now()),
      ('ময়মনসিংহ', 'mymensingh', '#01284E', 3, now(), now()),
      ('আইন-আদালত', 'law-court', '#7c2d12', 4, now(), now()),
      ('স্বাস্থ-শিক্ষা', 'health-education', '#0f766e', 5, now(), now()),
      ('খেলা', 'sports', '#0d6efd', 6, now(), now()),
      ('সংস্কৃতি', 'culture', '#9333ea', 7, now(), now()),
      ('গবেষনা-উন্নয়ন', 'research-development', '#1d4ed8', 8, now(), now()),
      ('মতামত', 'opinion', '#d92028', 9, now(), now())
    ON CONFLICT ("slug") DO UPDATE
    SET
      "name" = excluded."name",
      "color" = excluded."color",
      "display_order" = excluded."display_order",
      "updated_at" = now();
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}