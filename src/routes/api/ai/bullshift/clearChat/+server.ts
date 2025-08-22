import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initChat } from '$lib/server/gemini';

export const POST: RequestHandler = async ({request}) => {
    try {
        const { user, locale } = await request.json();
        const result = await initChat(user, locale);
        
        return json({
            success: true,
            newChatId: result.chatId
        });
    } catch (error) {
        console.error('Failed to create new chat:', error);
        return json({ error: 'Failed to create new chat' }, { status: 500 });
    }
}; 