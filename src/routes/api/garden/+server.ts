import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Get user's garden
        const garden = await pb.collection('gardens').getFirstListItem(
            `user="${user.id}"`
        );

        // Get user's seeds
        const userSeeds = await pb.collection('user_seeds').getFirstListItem(
            `user="${user.id}"`
        );

        return json({
            garden,
            userSeeds
        });

    } catch (error) {
        console.error('Error getting garden:', error);
        return new Response('Garden not found', { status: 404 });
    }
};