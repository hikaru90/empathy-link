import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request }) => {
    try {
      const { chatId } = await request.json();
      
      if (!chatId) {
        return json({ error: 'No chat ID provided' }, { status: 400 });
      }
      
      console.log('cleaning up chat on the serverSide', chatId);
      // Remove chat from memory
      if (bullshiftChats.has(chatId)) {
            bullshiftChats.delete(chatId);
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error cleaning up chat:', error);
        return json({ error: 'Failed to cleanup chat' }, { status: 500 });
    }
}; 