import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

    if (!user?.id) {
        return {
            error: 'User not authenticated'
        };
    }

    try {
        console.log('initChat from pageServerLoad');
        let chatRecord = undefined;
        try {
            console.log('getting chat record');
            chatRecord = await pb.collection('chats').getFirstListItem(`user="${user.id}" && module="bullshift"`, {
                sort: '-created',
            });
        } catch (error) {
            console.log('No chat record found, creating a new one');
            const initResponse = await initChat(user, locale);
            chatRecord = await pb.collection('chats').getOne(initResponse.chatId);
        }

        // Initialize Gemini chat if not in memory
        if (!bullshiftChats.has(chatRecord?.id)) {
            const model = await getModel(user, locale);
            const chat = ai.chats.create(model);

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