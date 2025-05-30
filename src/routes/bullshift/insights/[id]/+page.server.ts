import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const locale = locals.locale;
    const id = params.id;

    try {
        const traces = await pb.collection('traces').getFullList({
            filter: `chat = "${id}"`,
            sort: '-created'
        });
        const record = await pb.collection('chats').getOne(id,{
        });

        return {
            record,
            traces
        };
    } catch (error) {
        console.error('Error getting chat insights:', error);
        return {
            error: 'Error getting chat insights'
        };
    }
}; 