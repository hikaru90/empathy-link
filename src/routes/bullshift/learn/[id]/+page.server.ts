import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const locale = locals.locale;
    const id = params.id;

    try {
        const categories = await pb.collection('topicCategory').getFullList({
            sort: '-created'
        });
        const record = await pb.collection('topics').getOne(id,{
        });

        return {
            record,
            categories
        };
    } catch (error) {
        console.error('Error getting topic:', error);
        return {
            error: 'Error getting topic'
        };
    }
}; 