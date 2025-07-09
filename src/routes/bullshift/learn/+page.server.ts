import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    const locale = locals.locale;

    try {
        const categories = await pb.collection('topicCategory').getFullList({
            sort: 'order'
        });
        const topics = await pb.collection('topics').getFullList({
            filter: '',
            sort: 'order',
            expand: 'currentVersion, currentVersion.category'
        });

        // Fetch completion status for each topic if user is logged in
        let completionStatus: Record<string, boolean> = {};
        if (user?.id) {
            try {
                // Get all completed learning sessions for this user
                const completedSessions = await pb.collection('learnSessions').getFullList({
                    filter: `user = "${user.id}" && completed = true`,
                    fields: 'topic,topicVersion'
                });
                
                // Create a map of completed topic IDs
                completionStatus = completedSessions.reduce((acc: Record<string, boolean>, session: any) => {
                    acc[session.topic] = true;
                    return acc;
                }, {});
            } catch (sessionError) {
                console.error('Error fetching learning session completion status:', sessionError);
                // Continue without completion status if there's an error
            }
        }

        return {
            topics,
            categories,
            completionStatus
        };
    } catch (error) {
        console.error('Error getting full list of topics:', error);
        return {
            error: 'Error getting full list of topics'
        };
    }
}; 