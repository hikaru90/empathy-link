import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
      const { chatId } = await request.json();
      
      if (!chatId) {
        return json({ error: 'No chat ID provided' }, { status: 400 });
      }
      
      console.log('cleanup request for chatId:', chatId);
      // Note: With database-driven architecture, chat cleanup happens automatically
      // No in-memory cleanup needed since we removed bullshiftChats Map

        return json({ success: true });
    } catch (error) {
        console.error('Error cleaning up chat:', error);
        return json({ error: 'Failed to cleanup chat' }, { status: 500 });
    }
}; 