import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;

    // Check if user is authenticated before accessing user.id
    if (!user?.id) {
        console.error('User not authenticated in chat stats page load');
        return {
            error: 'User not authenticated',
            analyses: []
        };
    }

    try {
        const analyses = await pb.collection('analyses').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created',
            expand: 'chat'
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