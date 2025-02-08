import * as dotenv from "dotenv";

import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, ".env") });

import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;