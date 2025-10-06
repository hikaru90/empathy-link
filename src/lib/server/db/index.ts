import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema.js';

// Create connection
const connectionString = env.DATABASE_URL || 'postgresql://username:password@localhost:5432/empathy_link';

// For query purposes
const queryClient = postgres(connectionString);

// For migration purposes
export const migrationClient = postgres(connectionString, { max: 1 });

export const db = drizzle(queryClient, { schema });

// Type exports
export type { User, NewUser, Memory, NewMemory } from './schema.js';