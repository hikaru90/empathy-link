import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// const { chatId } = await request.json();

		// if (!chatId) {
		//   return json({ error: 'No chat ID provided' }, { status: 400 });
		// }

		console.log('flushing bullshiftChats on the serverSide');
		// Remove chat from memory
		bullshiftChats.clear();

		return json({ success: true });
	} catch (error) {
		console.error('Error flushing bullshift memory', error);
		return json({ error: 'Failed to flush bullshift memory' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		console.log('flushing bullshiftChats on the serverSide via GET');
		bullshiftChats.clear();
		return json({ success: true });
	} catch (error) {
		console.error('Error flushing bullshift memory', error);
		return json({ error: 'Failed to flush bullshift memory' }, { status: 500 });
	}
};
