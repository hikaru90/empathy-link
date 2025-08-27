import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Migrate user's PocketBase memories to PostgreSQL vector system
export const POST: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { migratePocketBaseMemories } = await import('$lib/server/hybridMemory.js');
		
		await migratePocketBaseMemories(user.id);
		
		return json({ 
			success: true,
			message: 'Memories migrated successfully'
		});
	} catch (error) {
		console.error('Error migrating memories:', error);
		return json({ 
			error: 'Failed to migrate memories',
			details: error.message 
		}, { status: 500 });
	}
};