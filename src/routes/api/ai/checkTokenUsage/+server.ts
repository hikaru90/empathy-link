import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canUserSendMessage, estimateTokenCount } from '$lib/server/tokenUtils';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		console.log('=== TOKEN USAGE CHECK API CALLED ===');
		console.log('User ID:', user.id);
		console.log('User role:', user.role);

		const { estimatedTokens = 0, message } = await request.json();
		console.log('Request data:', { estimatedTokens, message });

		// If message is provided, estimate tokens from it
		const finalEstimatedTokens = message ? estimateTokenCount(message) : estimatedTokens;
		console.log('Final estimated tokens:', finalEstimatedTokens);

		// Check if user can send message
		const { canSend, tokenUsage } = await canUserSendMessage(user.id, finalEstimatedTokens);
		console.log('Token check result:', { canSend, tokenUsage });

		return json({
			canSendMessage: canSend,
			tokenUsage,
			estimatedTokens: finalEstimatedTokens
		});

	} catch (error) {
		console.error('Error checking token usage:', error);
		return json({ error: 'Failed to check token usage' }, { status: 500 });
	}
};
