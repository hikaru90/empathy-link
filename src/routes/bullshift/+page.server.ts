import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat, chatPaths, getCurrentPath } from '$lib/server/gemini';
import { getSystemPromptForPath } from '$lib/server/paths';
import { redirect } from '@sveltejs/kit';
import { decryptChatHistory } from '$lib/utils/chatEncryption.js';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

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

        // Restore path state in memory if it exists
        if (chatRecord.pathState?.activePath) {
            console.log('Loading existing chat with path:', chatRecord.pathState.activePath);
            systemPrompt = await getSystemPromptForPath(chatRecord.pathState.activePath, user);
            // Restore path state in memory
            chatPaths.set(chatRecord.id, chatRecord.pathState);
        } else {
            // Fallback to old system for existing chats without path data
            const decryptedHistory = decryptChatHistory(chatRecord?.history || []);
            const {model, systemInstruction: oldSystemInstruction} = await getModel(user, locale, decryptedHistory);
            systemPrompt = oldSystemInstruction;
        }

        return {
            chatId: chatRecord.id,
            history: decryptChatHistory(chatRecord.history || []),
            systemPrompt
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 