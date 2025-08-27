import {
	pgTable,
	text,
	timestamp,
	real,
	integer,
	uuid,
	index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const memories = pgTable(
	'memories',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id').notNull(),
		confidence: text('confidence').notNull(),
		type: text('type').notNull(), // core_identity, patterns, preferences, episodic, contextual
		priority: real('priority').notNull().default(1.0),
		key: text('key'),
		value: text('value').notNull(),
		embedding: text('embedding'), // Store as JSON string for now, will convert to vector in raw SQL
		chatId: text('chat_id'),
		relevanceScore: real('relevance_score').notNull().default(1.0),
		accessCount: integer('access_count').notNull().default(0),
		lastAccessed: timestamp('last_accessed').defaultNow(),
		expiresAt: timestamp('expires_at'),
		created: timestamp('created').notNull().defaultNow(),
		updated: timestamp('updated').notNull().defaultNow()
	},
	(table) => ({
		userTypeIdx: index('user_type_idx').on(table.userId, table.type),
		userRelevanceIdx: index('user_relevance_idx').on(table.userId, table.relevanceScore),
		expiryIdx: index('expiry_idx').on(table.expiresAt)
	})
);

export type Memory = typeof memories.$inferSelect;
export type NewMemory = typeof memories.$inferInsert;