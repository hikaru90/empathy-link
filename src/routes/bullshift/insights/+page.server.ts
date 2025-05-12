import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

    try {
        const records = await pb.collection('chats').getFullList({
            filter: 'module="bullshift"',
            sort: '-created',
        });
        
        

        return {
            records
        };
    } catch (error) {
        console.error('Error getting full list of chats:', error);
        return {
            error: 'Error getting full list of chats'
        };
    }
}; 