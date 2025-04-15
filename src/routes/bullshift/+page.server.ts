import type { PageServerLoad } from './$types';
import { genAI, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    
    if (!user?.id) {
        return {
            error: 'User not authenticated'
        };
    }

    try {
        let chatRecord = await pb
            .collection('chats')
            .getFirstListItem(`user="${user.id}" && module="bullshift"`);

        // Initialize Gemini chat if not in memory
        if (!bullshiftChats.has(chatRecord.id)) {
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash'
            });
            
            const chat = model.startChat({
                history: chatRecord.history || []
            });
            
            bullshiftChats.set(chatRecord.id, chat);
        }

        return {
            chatId: chatRecord.id,
            history: chatRecord.history || []
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 