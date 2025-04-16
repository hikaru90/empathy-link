import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initChat } from '../initChat/+server';
import { ai, bullshiftChats } from '$lib/server/gemini';

export const POST: RequestHandler = async () => {
    try {
        const result = await initChat();
        
        return json({
            success: true,
            newChatId: result.chatId
        });
    } catch (error) {
        console.error('Failed to create new chat:', error);
        return json({ error: 'Failed to create new chat' }, { status: 500 });
    }
}; 