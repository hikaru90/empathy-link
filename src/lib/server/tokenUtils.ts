import { pb } from '$scripts/pocketbase';

export interface TokenUsage {
	totalUsed: number;
	totalLimit: number;
	remaining: number;
	inputTokens: number;
	outputTokens: number;
}

export interface TokenLimits {
	DAILY_LIMIT: number;
	ADMIN_DAILY_LIMIT: number;
}

export const TOKEN_LIMITS: TokenLimits = {
	DAILY_LIMIT: 500000, // 500k tokens per day for regular users
	ADMIN_DAILY_LIMIT: 1000000 // 1M tokens per day for admin users (effectively unlimited)
};

/**
 * Calculate user's daily token usage from traces
 */
export const calculateUserTokenUsage = async (userId: string): Promise<TokenUsage> => {
	try {
		// Get start of current day in local time (like other components)
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayStr = today.toISOString().split('T')[0] + ' 00:00:00';

		// Get user's token usage from traces for today only
		console.log('Date filter:', todayStr);
		const traces = await pb.collection('traces').getList(1, 1000, {
			filter: `user = "${userId}" && created >= "${todayStr}"`,
			sort: '-created'
		});
		console.log('Traces found for today:', traces.items.length);

		// Calculate total token usage for today
		const totalInputTokens = traces.items.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
		const totalOutputTokens = traces.items.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);
		const totalTokensUsed = totalInputTokens + totalOutputTokens;

		// Get user to determine if they're admin
		const user = await pb.collection('users').getOne(userId);
		console.log('User role:', user.role, 'User ID:', userId);
		const isAdmin = user.role === 'admin' || user.role === 'ADMIN';
		const tokenLimit = isAdmin ? TOKEN_LIMITS.ADMIN_DAILY_LIMIT : TOKEN_LIMITS.DAILY_LIMIT;
		console.log('Is admin:', isAdmin, 'Token limit:', tokenLimit);

		return {
			totalUsed: totalTokensUsed,
			totalLimit: tokenLimit,
			remaining: Math.max(0, tokenLimit - totalTokensUsed),
			inputTokens: totalInputTokens,
			outputTokens: totalOutputTokens
		};
	} catch (error) {
		console.error('Error calculating user token usage:', error);
		// Return default values on error - but we need to know if user is admin
		try {
			const user = await pb.collection('users').getOne(userId);
			const isAdmin = user.role === 'admin' || user.role === 'ADMIN';
			const tokenLimit = isAdmin ? TOKEN_LIMITS.ADMIN_DAILY_LIMIT : TOKEN_LIMITS.DAILY_LIMIT;
			return {
				totalUsed: 0,
				totalLimit: tokenLimit,
				remaining: tokenLimit,
				inputTokens: 0,
				outputTokens: 0
			};
		} catch (userError) {
			console.error('Error getting user in fallback:', userError);
			return {
				totalUsed: 0,
				totalLimit: TOKEN_LIMITS.DAILY_LIMIT,
				remaining: TOKEN_LIMITS.DAILY_LIMIT,
				inputTokens: 0,
				outputTokens: 0
			};
		}
	}
};



/**
 * Check if user can send a message based on token usage
 */
export const canUserSendMessage = async (
	userId: string, 
	estimatedTokens: number = 0
): Promise<{ canSend: boolean; tokenUsage: TokenUsage }> => {
	const tokenUsage = await calculateUserTokenUsage(userId);
	const canSend = tokenUsage.remaining >= estimatedTokens;
	
	console.log('Token usage check:', {
		userId,
		estimatedTokens,
		totalUsed: tokenUsage.totalUsed,
		totalLimit: tokenUsage.totalLimit,
		remaining: tokenUsage.remaining,
		canSend
	});
	
	return {
		canSend,
		tokenUsage
	};
};

/**
 * Estimate token count from text (rough approximation)
 */
export const estimateTokenCount = (text: string): number => {
	// Rough estimate: 4 characters per token for most languages
	// This is a simple approximation - for more accuracy, you could use a tokenizer
	return Math.ceil(text.length / 4);
};
