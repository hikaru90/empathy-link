import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const { id } = params;
    console.log('id', id);
    try {
        const analysis = await pb.collection('analyses').getFirstListItem(`chat = "${id}"`, {
            expand: 'chat'
        });

        console.log('analysis', analysis);

        return {
            analysis,
        };
    } catch (error) {
        console.error('Error getting analysis of chat:', error);
        return {
            error: 'Failed to get analysis of chat'
        };
    }
}; 