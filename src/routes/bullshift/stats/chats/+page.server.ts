import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;

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