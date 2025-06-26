import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals, params, url }) => {
    const user = locals.user;
    const locale = locals.locale;
    const slug = params.slug;

    try {
        const categories = await pb.collection('topicCategory').getFullList({
            sort: '-created'
        });
        const record = await pb.collection('topics').getFirstListItem(`slug = "${slug}"`,{
            expand: 'currentVersion'
        });

        console.log('record', record);

        return {
            record,
            categories,
            currentPage: parseInt(url.searchParams.get('page') || '0'),
            topicId: id
        };
    } catch (error) {
        console.error('Error getting topic:', error);
        return {
            error: 'Error getting topic'
        };
    }
}; 