import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { memories } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

// Update a memory
export const PUT: RequestHandler = async ({ request, params, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = params;
		const { value } = await request.json();

		if (!value) {
			return json({ error: 'Value is required' }, { status: 400 });
		}

		const updatedMemory = await db
			.update(memories)
			.set({ 
				value,
				updated: new Date()
			})
			.where(and(
				eq(memories.id, id),
				eq(memories.userId, user.id)
			))
			.returning();

		if (updatedMemory.length === 0) {
			return json({ error: 'Memory not found or unauthorized' }, { status: 404 });
		}

		return json({ memory: updatedMemory[0] });
	} catch (error) {
		console.error('Error updating memory:', error);
		return json({ error: 'Failed to update memory' }, { status: 500 });
	}
};

// Delete a memory
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = params;

		const deletedMemory = await db
			.delete(memories)
			.where(and(
				eq(memories.id, id),
				eq(memories.userId, user.id)
			))
			.returning();

		if (deletedMemory.length === 0) {
			return json({ error: 'Memory not found or unauthorized' }, { status: 404 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting memory:', error);
		return json({ error: 'Failed to delete memory' }, { status: 500 });
	}
};