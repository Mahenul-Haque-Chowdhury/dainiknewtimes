import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Articles } from "./collections/Articles";
import { EPapers } from "./collections/EPapers";
import { SiteSettings } from "./globals/SiteSettings";
import { BreakingNews } from "./globals/BreakingNews";
import { serverEnv } from "./lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Articles, EPapers],
  globals: [SiteSettings, BreakingNews],
  editor: lexicalEditor(),
  secret: serverEnv.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: serverEnv.DATABASE_URI,
    },
  }),
  sharp,
});
