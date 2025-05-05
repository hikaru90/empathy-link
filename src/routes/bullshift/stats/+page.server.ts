import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const locale = locals.locale;
    const id = params.id;

    if (!user?.id) {
        return {
            error: 'User not authenticated'
        };
    }
    if(user.role !== 'admin'){
        return {
            error: 'User not authorized'
        };
    }

    try {

        const memories = await pb.collection('memories').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created'
        });

        const analyses = await pb.collection('analyses').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created'
        });

        return {
            analyses,
            memories
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 