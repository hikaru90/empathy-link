import type { PageServerLoad } from './$types';
import { decryptChatHistory } from '$lib/utils/chatEncryption.js';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const { analysisId } = params;
    try {
        const analysis = await locals.pb.collection('analyses').getOne(analysisId, {
            expand: 'chat'
        });
        // const analysis = await pb.collection('analyses').getFirstListItem(`chat = "${id}"`, {
        //     expand: 'chat'
        // });

        // Decrypt chat history if it exists
        if (analysis.expand?.chat?.history) {
            analysis.expand.chat.history = decryptChatHistory(analysis.expand.chat.history);
        }

        return {
            analysis,
        };
    } catch (error) {
        console.error('Error getting analysis of chat:', error);
        return {
            error: 'Failed to get analysis of chat'
        };
    }
}; 