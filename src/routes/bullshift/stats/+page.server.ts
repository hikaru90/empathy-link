import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;


    try {
        const memories = await pb.collection('memories').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created'
        });

        const analyses = await pb.collection('analyses').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created',
            expand: 'chat'
        });

        return {
            analyses,
            memories
        };
    } catch (error) {
        console.error('Error geeting memories and analyses:', error);
        return {
            error: 'Error geeting memories and analyses'
        };
    }
}; 