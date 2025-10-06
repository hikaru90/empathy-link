import type { PageServerLoad } from './$types';
import { decryptChatHistory } from '$lib/utils/chatEncryption.js';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;


    try {
        const memories = await locals.pb.collection('memories').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created'
        });

        const analyses = await locals.pb.collection('analyses').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created',
            expand: 'chat'
        });

        // Decrypt chat history for all analyses
        analyses.forEach(analysis => {
            if (analysis.expand?.chat?.history) {
                analysis.expand.chat.history = decryptChatHistory(analysis.expand.chat.history);
            }
        });

        return {
            analyses,
            memories
        };
    } catch (error) {
        console.error('Error geeting memories and analyses:', error);
        return {
            error: 'Error geeting memories and analyses'
        };
    }
}; 