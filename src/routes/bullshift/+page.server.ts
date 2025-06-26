import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

    if (!user?.id) {

        throw redirect(303, '/app/auth/login');

        return {
            error: 'User not authenticated'
        };
    }

    try {
        console.log('initChat from pageServerLoad');
        let chatRecord = undefined;
        let systemPrompt = '';
        try {
            console.log('getting chat record');
            chatRecord = await pb.collection('chats').getFirstListItem(`user="${user.id}" && module="bullshift"`, {
                sort: '-created',
            });
        } catch (error) {
            console.log('No chat record found, creating a new one');
            const initResponse = await initChat(user, locale);
            console.log('initResponse:', initResponse);
            chatRecord = await pb.collection('chats').getOne(initResponse.chatId);
            systemPrompt = initResponse.systemInstruction;
        }

        // Initialize Gemini chat if not in memory
        if (!bullshiftChats.has(chatRecord?.id)) {
            const {model, systemInstruction} = await getModel(user, locale, chatRecord?.history);
            systemPrompt = systemInstruction;
            const chat = ai.chats.create(model);

            bullshiftChats.set(chatRecord.id, chat);
        } else {
            // Get system instruction for existing chat
            const {model, systemInstruction} = await getModel(user, locale, chatRecord?.history);
            systemPrompt = systemInstruction;
        }

        return {
            chatId: chatRecord.id,
            history: chatRecord.history || [],
            systemPrompt
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 