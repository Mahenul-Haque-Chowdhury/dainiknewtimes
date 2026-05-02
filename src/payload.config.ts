import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  defaultColors,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  TextStateFeature,
} from "@payloadcms/richtext-lexical";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Articles } from "./collections/Articles";
import { EPapers } from "./collections/EPapers";
import { SiteSettings } from "./globals/SiteSettings";
import { BreakingNews } from "./globals/BreakingNews";
import { Headlines } from "./globals/Headlines";
import { syncConfiguredCategories } from "./lib/category-sync";
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
  globals: [SiteSettings, Headlines, BreakingNews],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== "toolbarInline"),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
            urgentRed: { label: "Urgent Red", css: { color: "#b91c1c" } },
            deepBlue: { label: "Deep Blue", css: { color: "#1d4ed8" } },
          },
          highlight: {
            yellow: { label: "Yellow Highlight", css: { background: "#fef08a", color: "#111827" } },
            sky: { label: "Sky Highlight", css: { background: "#dbeafe", color: "#111827" } },
          },
        },
      }),
    ],
  }),
  secret: serverEnv.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: serverEnv.DATABASE_URI,
    },
  }),
  onInit: async (payload) => {
    await syncConfiguredCategories(payload);
  },
  sharp,
});
