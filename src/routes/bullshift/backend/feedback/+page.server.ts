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
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        };

        // Fetch chat feedback data
        const chatFeedback = await retryRequest(() => pb.collection('chatFeedback').getList(1, 1000, {
            sort: '-created',
            expand: 'chatId,userId'
        }));

        // Calculate feedback statistics
        const totalFeedback = chatFeedback.totalItems;
        const feedbackItems = chatFeedback.items;

        // Calculate averages
        const avgHelpfulness = feedbackItems.length > 0 
            ? feedbackItems.reduce((sum, feedback) => sum + (feedback.helpfulness || 0), 0) / feedbackItems.length 
            : 0;

        const avgConversationQuality = feedbackItems.length > 0
            ? feedbackItems.reduce((sum, feedback) => sum + (feedback.conversationQuality || 0), 0) / feedbackItems.length
            : 0;

        const avgNvcCompliance = feedbackItems.length > 0
            ? feedbackItems.reduce((sum, feedback) => sum + (feedback.nvcCompliance || 0), 0) / feedbackItems.length
            : 0;

        const avgOrchestratorEffectiveness = feedbackItems.length > 0
            ? feedbackItems.reduce((sum, feedback) => sum + (feedback.orchestratorEffectiveness || 0), 0) / feedbackItems.length
            : 0;

        // Calculate boolean field percentages
        const understandingPercentage = feedbackItems.length > 0
            ? (feedbackItems.filter(f => f.understanding).length / feedbackItems.length) * 100
            : 0;

        const newInsightsPercentage = feedbackItems.length > 0
            ? (feedbackItems.filter(f => f.newInsights).length / feedbackItems.length) * 100
            : 0;

        const wouldRecommendPercentage = feedbackItems.length > 0
            ? (feedbackItems.filter(f => f.wouldRecommend).length / feedbackItems.length) * 100
            : 0;

        // Analyze automatic analysis data
        const automaticAnalysisInsights = feedbackItems
            .filter(feedback => feedback.automaticAnalysis)
            .map(feedback => {
                try {
                    const analysis = typeof feedback.automaticAnalysis === 'string' 
                        ? JSON.parse(feedback.automaticAnalysis)
                        : feedback.automaticAnalysis;
                    
                    return {
                        id: feedback.id,
                        chatId: feedback.chatId,
                        userId: feedback.userId,
                        created: feedback.created,
                        analysis,
                        userFeedback: {
                            helpfulness: feedback.helpfulness,
                            understanding: feedback.understanding,
                            newInsights: feedback.newInsights,
                            wouldRecommend: feedback.wouldRecommend,
                            bestAspects: feedback.bestAspects,
                            improvements: feedback.improvements,
                            additionalComments: feedback.additionalComments
                        }
                    };
                } catch (error) {
                    console.error('Error parsing automatic analysis:', error);
                    return null;
                }
            })
            .filter(Boolean);

        // Calculate average automatic analysis metrics
        const avgFlowRating = automaticAnalysisInsights.length > 0
            ? automaticAnalysisInsights.reduce((sum, insight) => sum + (insight.analysis?.conversationFlow?.flowRating || 0), 0) / automaticAnalysisInsights.length
            : 0;

        const avgNvcOverall = automaticAnalysisInsights.length > 0
            ? automaticAnalysisInsights.reduce((sum, insight) => sum + (insight.analysis?.nvcCompliance?.overallCompliance || 0), 0) / automaticAnalysisInsights.length
            : 0;

        const avgOrchestratorOverall = automaticAnalysisInsights.length > 0
            ? automaticAnalysisInsights.reduce((sum, insight) => sum + (insight.analysis?.orchestratorEffectiveness?.overallEffectiveness || 0), 0) / automaticAnalysisInsights.length
            : 0;

        const avgGoalAchievement = automaticAnalysisInsights.length > 0
            ? automaticAnalysisInsights.reduce((sum, insight) => sum + (insight.analysis?.overallAssessment?.goalAchievement || 0), 0) / automaticAnalysisInsights.length
            : 0;

        // Recent feedback (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentFeedback = feedbackItems.filter(feedback => new Date(feedback.created) > thirtyDaysAgo).length;

        return {
            stats: {
                totalFeedback,
                avgHelpfulness: Math.round(avgHelpfulness * 100) / 100,
                avgConversationQuality: Math.round(avgConversationQuality * 100) / 100,
                avgNvcCompliance: Math.round(avgNvcCompliance * 100) / 100,
                avgOrchestratorEffectiveness: Math.round(avgOrchestratorEffectiveness * 100) / 100,
                understandingPercentage: Math.round(understandingPercentage * 100) / 100,
                newInsightsPercentage: Math.round(newInsightsPercentage * 100) / 100,
                wouldRecommendPercentage: Math.round(wouldRecommendPercentage * 100) / 100,
                automaticAnalysisStats: {
                    totalAnalyzed: automaticAnalysisInsights.length,
                    avgFlowRating: Math.round(avgFlowRating * 100) / 100,
                    avgNvcOverall: Math.round(avgNvcOverall * 100) / 100,
                    avgOrchestratorOverall: Math.round(avgOrchestratorOverall * 100) / 100,
                    avgGoalAchievement: Math.round(avgGoalAchievement * 100) / 100
                },
                recentActivity: {
                    feedback: recentFeedback
                }
            },
            feedbackItems: automaticAnalysisInsights.slice(0, 50) // Limit to 50 most recent for display
        };
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        return {
            error: 'Error fetching feedback data'
        };
    }
};