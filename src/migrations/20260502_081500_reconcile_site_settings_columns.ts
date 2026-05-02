import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL
    );

    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "site_name" varchar DEFAULT 'নিউ টাইমস',
      ADD COLUMN IF NOT EXISTS "tagline" varchar DEFAULT 'সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি',
      ADD COLUMN IF NOT EXISTS "logo_id" integer,
      ADD COLUMN IF NOT EXISTS "social_links_facebook" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_youtube" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_twitter" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_instagram" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_linkedin" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_phone" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_email" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_address" varchar,
      ADD COLUMN IF NOT EXISTS "editor_info_chief_editor" varchar,
      ADD COLUMN IF NOT EXISTS "editor_info_editor" varchar,
      ADD COLUMN IF NOT EXISTS "editor_info_publisher_info" varchar,
      ADD COLUMN IF NOT EXISTS "footer_text" varchar DEFAULT 'স্বত্ব © ২০২৬ দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।',
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now();

    INSERT INTO "site_settings" ("id")
    SELECT 1
    WHERE NOT EXISTS (SELECT 1 FROM "site_settings");

    UPDATE "site_settings"
    SET
      "site_name" = COALESCE("site_name", 'নিউ টাইমস'),
      "updated_at" = COALESCE("updated_at", now()),
      "created_at" = COALESCE("created_at", now())
    WHERE "id" = 1;

    ALTER TABLE "site_settings"
      ALTER COLUMN "site_name" SET DEFAULT 'নিউ টাইমস',
      ALTER COLUMN "site_name" SET NOT NULL,
      ALTER COLUMN "updated_at" SET DEFAULT now(),
      ALTER COLUMN "created_at" SET DEFAULT now();

    DO $$
    BEGIN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}