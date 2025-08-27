import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/empathy_link'
	},
	verbose: true,
	strict: true
});