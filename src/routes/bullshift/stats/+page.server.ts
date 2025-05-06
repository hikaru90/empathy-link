import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;

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