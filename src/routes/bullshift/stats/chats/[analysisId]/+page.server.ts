import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const { analysisId } = params;
    try {
        const analysis = await pb.collection('analyses').getOne(analysisId, {
            expand: 'chat'
        });
        // const analysis = await pb.collection('analyses').getFirstListItem(`chat = "${id}"`, {
        //     expand: 'chat'
        // });

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