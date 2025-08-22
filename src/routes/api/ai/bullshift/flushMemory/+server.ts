import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('flush memory request received');
		// Note: With database-driven architecture, memory flushing is no longer needed
		// Chats are stored in database, not in server memory

		return json({ success: true });
	} catch (error) {
		console.error('Error flushing bullshift memory', error);
		return json({ error: 'Failed to flush bullshift memory' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		console.log('flush memory GET request received');
		// Note: With database-driven architecture, memory flushing is no longer needed
		// Chats are stored in database, not in server memory
		
		return json({ success: true });
	} catch (error) {
		console.error('Error flushing bullshift memory', error);
		return json({ error: 'Failed to flush bullshift memory' }, { status: 500 });
	}
};
