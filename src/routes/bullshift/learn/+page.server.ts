import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

    try {
        const categories = await pb.collection('topicCategory').getFullList({
            sort: '-created'
        });
        const topics = await pb.collection('topics').getFullList({
            filter: '',
            sort: 'order',
            expand: 'currentVersion, currentVersion.category'
        });

        return {
            topics,
            categories
        };
    } catch (error) {
        console.error('Error getting full list of topics:', error);
        return {
            error: 'Error getting full list of topics'
        };
    }
}; 