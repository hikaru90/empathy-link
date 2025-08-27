import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { memories } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

// Get all memories for a user
export const GET: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const userMemories = await db
			.select()
			.from(memories)
			.where(eq(memories.userId, user.id))
			.orderBy(desc(memories.created));

		return json({ memories: userMemories });
	} catch (error) {
		console.error('Error fetching memories:', error);
		return json({ error: 'Failed to fetch memories' }, { status: 500 });
	}
};

// Create a new memory
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { summary, type, chatId } = await request.json();

		if (!summary) {
			return json({ error: 'Summary is required' }, { status: 400 });
		}

		const { createMemory } = await import('$lib/server/memory.js');
		const memory = await createMemory(user.id, summary, chatId, 'medium');

		return json({ memory }, { status: 201 });
	} catch (error) {
		console.error('Error creating memory:', error);
		return json({ error: 'Failed to create memory' }, { status: 500 });
	}
};