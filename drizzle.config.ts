import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log(process.env.DB_HOST!);

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_HOST!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
  },
});