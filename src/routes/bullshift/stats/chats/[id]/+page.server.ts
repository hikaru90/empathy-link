import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';


export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const { id } = params;

    try {
        const analysis = await pb.collection('analyses').getOne(id, {
            expand: 'chat'
        });

        return {
            analysis,
        };
    } catch (error) {
        console.error('Error initializing chat:', error);
        return {
            error: 'Failed to initialize chat'
        };
    }
}; 