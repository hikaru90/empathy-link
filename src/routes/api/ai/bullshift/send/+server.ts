import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';


export const POST: RequestHandler = async ({ request }) => {
    try {
        const { chatId, message } = await request.json();
        
        if (!chatId || !message) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const chat = bullshiftChats.get(chatId);
        if (!chat) {
            return json({ error: 'Chat session not found' }, { status: 404 });
        }

        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Update chat history in database if needed
        await pb.collection('chats').update(chatId, { history: await chat.getHistory() });

        return json({ 
            response: text,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return json({ error: 'Failed to send message' }, { status: 500 });
    }
}; 