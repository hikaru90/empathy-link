// @ts-nocheck
import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const user = locals.user;
    const locale = locals.locale;

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
        const records = await pb.collection('chats').getFullList({
            filter: 'module="bullshift"',
            sort: '-created',
        });
        
        

        return {
            records
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 