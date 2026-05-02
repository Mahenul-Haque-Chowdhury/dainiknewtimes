import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE "public"."enum_breaking_news_items_duration_minutes" AS ENUM ('30', '60', '90', '120', '180', '360');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'নিউ টাইমস' NOT NULL,
      "tagline" varchar DEFAULT 'সত্য ও নিরপেক্ষ সংবাদের প্রতিশ্রুতি',
      "logo_id" integer,
      "social_links_facebook" varchar,
      "social_links_youtube" varchar,
      "social_links_twitter" varchar,
      "social_links_instagram" varchar,
      "social_links_linkedin" varchar,
      "contact_info_phone" varchar,
      "contact_info_email" varchar,
      "contact_info_address" varchar,
      "editor_info_chief_editor" varchar,
      "editor_info_editor" varchar,
      "editor_info_publisher_info" varchar,
      "footer_text" varchar DEFAULT 'স্বত্ব © ২০২৬ দৈনিক নিউ টাইমস কর্তৃক সর্বসত্ব স্বত্বাধিকার সংরক্ষিত।',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    DO $$
    BEGIN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");

    CREATE TABLE IF NOT EXISTS "headlines" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "headlines_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL,
      "link" varchar,
      "is_active" boolean DEFAULT true
    );

    DO $$
    BEGIN
      ALTER TABLE "headlines_items"
        ADD CONSTRAINT "headlines_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."headlines"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "headlines_items_order_idx" ON "headlines_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "headlines_items_parent_id_idx" ON "headlines_items" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "breaking_news" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "breaking_news_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL,
      "link" varchar,
      "duration_minutes" "enum_breaking_news_items_duration_minutes" DEFAULT '60' NOT NULL,
      "expires_at" timestamp(3) with time zone,
      "is_active" boolean DEFAULT true
    );

    DO $$
    BEGIN
      ALTER TABLE "breaking_news_items"
        ADD CONSTRAINT "breaking_news_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."breaking_news"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "breaking_news_items_order_idx" ON "breaking_news_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "breaking_news_items_parent_id_idx" ON "breaking_news_items" USING btree ("_parent_id");

    INSERT INTO "site_settings" ("id")
    SELECT 1
    WHERE NOT EXISTS (SELECT 1 FROM "site_settings");

    INSERT INTO "headlines" ("id")
    SELECT 1
    WHERE NOT EXISTS (SELECT 1 FROM "headlines");

    INSERT INTO "breaking_news" ("id")
    SELECT 1
    WHERE NOT EXISTS (SELECT 1 FROM "breaking_news");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "breaking_news_items";
    DROP TABLE IF EXISTS "breaking_news";
    DROP TABLE IF EXISTS "headlines_items";
    DROP TABLE IF EXISTS "headlines";
    DROP TABLE IF EXISTS "site_settings";
    DROP TYPE IF EXISTS "public"."enum_breaking_news_items_duration_minutes";
  `)
}
