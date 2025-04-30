// @ts-nocheck
import type { PageServerLoad } from './$types';
import { ai, bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { getModel, initChat } from '$lib/server/gemini';
import { redirect } from '@sveltejs/kit';
export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
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
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 