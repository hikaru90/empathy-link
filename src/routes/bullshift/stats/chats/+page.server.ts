import type { PageServerLoad } from './$types';
import { decryptChatHistory } from '$lib/utils/chatEncryption.js';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;

    try {
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
        };
    } catch (error) {
        console.error('Error getting chat stats:', error);
        return {
            error: 'Failed to get chat stats'
        };
    }
}; 