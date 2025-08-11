import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return {
            error: 'Unauthorized access. Admin role required.'
        };
    }

    try {
        // Helper function for retrying requests
        const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 2) => {
            for (let i = 0; i <= maxRetries; i++) {
                try {
                    return await requestFn();
                } catch (error) {
                    console.log(`Request attempt ${i + 1} failed:`, error);
                    if (i === maxRetries) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
                }
            }
        };

        // Fetch data with pagination and limits to avoid auto-cancellation
        const [users, chats, analyses, errors, traces] = await Promise.all([
            retryRequest(() => pb.collection('users').getList(1, 500, {
                sort: '-created'
            })),
            retryRequest(() => pb.collection('chats').getList(1, 1000, {
                sort: '-created',
                fields: 'id,user,module,created,updated'
            })),
            retryRequest(() => pb.collection('analyses').getList(1, 1000, {
                sort: '-created',
                fields: 'id,user,sentimentPolarity,empathyRate,created'
            })),
            retryRequest(() => pb.collection('errors').getList(1, 500, {
                sort: '-created',
                fields: 'id,user,created'
            })),
            retryRequest(() => pb.collection('traces').getList(1, 1000, {
                sort: '-created',
                fields: 'id,user,chat,functionName,module,inputTokens,outputTokens,created'
            }))
        ]);

        // Calculate aggregated statistics
        const totalUsers = users.totalItems;
        const totalChats = chats.totalItems;
        const totalAnalyses = analyses.totalItems;
        const totalErrors = errors.totalItems;
        const totalTraces = traces.totalItems;

        // Module usage statistics
        const moduleStats = chats.items.reduce((acc, chat) => {
            const module = chat.module || 'unknown';
            acc[module] = (acc[module] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Token usage statistics
        const totalInputTokens = traces.items.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
        const totalOutputTokens = traces.items.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);
        const totalTokens = totalInputTokens + totalOutputTokens;

        // Function usage statistics
        const functionStats = traces.items.reduce((acc, trace) => {
            const functionName = trace.functionName || 'unknown';
            acc[functionName] = (acc[functionName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // User statistics with detailed metrics
        const userStats = users.items.map(user => {
            const userChats = chats.items.filter(chat => chat.user === user.id);
            const userAnalyses = analyses.items.filter(analysis => analysis.user === user.id);
            const userErrors = errors.items.filter(error => error.user === user.id);
            const userTraces = traces.items.filter(trace => trace.user === user.id);

            // Module breakdown for this user
            const userModuleStats = userChats.reduce((acc, chat) => {
                const module = chat.module || 'unknown';
                acc[module] = (acc[module] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // Average analysis metrics
            const avgSentimentPolarity = userAnalyses.length > 0 
                ? userAnalyses.reduce((sum, a) => sum + (a.sentimentPolarity || 0), 0) / userAnalyses.length 
                : 0;
            
            const avgEmpathyRate = userAnalyses.length > 0
                ? userAnalyses.reduce((sum, a) => sum + (a.empathyRate || 0), 0) / userAnalyses.length
                : 0;

            // Token usage for this user
            const userInputTokens = userTraces.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
            const userOutputTokens = userTraces.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);
            const userTotalTokens = userInputTokens + userOutputTokens;

            return {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                created: user.created,
                chatCount: userChats.length,
                analysisCount: userAnalyses.length,
                errorCount: userErrors.length,
                traceCount: userTraces.length,
                moduleStats: userModuleStats,
                avgSentimentPolarity: Math.round(avgSentimentPolarity * 100) / 100,
                avgEmpathyRate: Math.round(avgEmpathyRate * 100) / 100,
                inputTokens: userInputTokens,
                outputTokens: userOutputTokens,
                totalTokens: userTotalTokens,
                lastActivity: userChats.length > 0 ? userChats[0].created : user.created
            };
        });

        // Sort users by last activity
        userStats.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentChats = chats.items.filter(chat => new Date(chat.created) > thirtyDaysAgo).length;
        const recentAnalyses = analyses.items.filter(analysis => new Date(analysis.created) > thirtyDaysAgo).length;
        const recentErrors = errors.items.filter(error => new Date(error.created) > thirtyDaysAgo).length;
        const recentTraces = traces.items.filter(trace => new Date(trace.created) > thirtyDaysAgo).length;

        return {
            stats: {
                totalUsers,
                totalChats,
                totalAnalyses,
                totalErrors,
                totalTraces,
                moduleStats,
                functionStats,
                tokenUsage: {
                    totalInputTokens,
                    totalOutputTokens,
                    totalTokens
                },
                recentActivity: {
                    chats: recentChats,
                    analyses: recentAnalyses,
                    errors: recentErrors,
                    traces: recentTraces
                }
            },
            userStats
        };
    } catch (error) {
        console.error('Error fetching backend statistics:', error);
        return {
            error: 'Error fetching backend statistics'
        };
    }
};