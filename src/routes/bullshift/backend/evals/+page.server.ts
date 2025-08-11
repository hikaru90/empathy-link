import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/app/auth/login');
	}

	try {
		// Get all chats for the current user
		const chats = await pb.collection('chats').getFullList({
			filter: `user="${user.id}"`,
			sort: '-created',
			fields: 'id,module,history,created,updated'
		});

		// Try to get evaluated chats, but handle missing collection gracefully
		let evaluatedChats: any[] = [];
		let evaluations: any[] = [];
		try {
			evaluatedChats = await pb.collection('chatEvals').getFullList({
				fields: 'chatId'
			});
			console.log('evaluatedChats', evaluatedChats);
			
			evaluations = await pb.collection('chatEvals').getFullList({
				sort: '-created',
				expand: 'chatId'
			});
		} catch (collectionError: any) {
			console.log('chatEvals collection not found, starting fresh:', collectionError.message);
			// Collection doesn't exist yet, which is fine for new installations
		}

		const evaluatedChatIds = new Set(evaluatedChats.map(e => e.chatId));

		// Filter out already evaluated chats and chats without history
		const unevaluatedChats = chats.filter(chat => 
			!evaluatedChatIds.has(chat.id) && 
			chat.history && 
			Array.isArray(chat.history) && 
			chat.history.length > 0
		);

		return {
			chats: chats,
			unevaluatedChats: unevaluatedChats,
			evaluations: evaluations,
			stats: {
				total: chats.length,
				evaluated: evaluatedChats.length,
				unevaluated: unevaluatedChats.length
			},
			collectionExists: evaluatedChats.length > 0 || evaluations.length > 0
		};
	} catch (error) {
		console.error('Error loading evaluation data:', error);
		return {
			chats: [],
			unevaluatedChats: [],
			evaluations: [],
			stats: {
				total: 0,
				evaluated: 0,
				unevaluated: 0
			},
			error: 'Failed to load evaluation data',
			collectionExists: false
		};
	}
};
