import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	
	if (!user) {
		throw redirect(302, '/app/auth/login');
	}

	try {
		console.log('Loading user preferences for user:', user.id);
		
		// Get user with current preferences using authenticated PocketBase instance
		const userData = await pb.collection('users').getOne(user.id);
		console.log('User data loaded successfully:', { id: userData.id, hasPreferences: !!(userData.aiAnswerLength || userData.toneOfVoice || userData.nvcKnowledge) });
		
		return {
			user: userData,
			preferences: {
				aiAnswerLength: userData.aiAnswerLength || 'short',
				toneOfVoice: userData.toneOfVoice || 'heartfelt', 
				nvcKnowledge: userData.nvcKnowledge || 'beginner'
			}
		};
	} catch (error) {
		console.error('Error loading user preferences:', error);
		console.error('User ID that failed:', user.id);
		return {
			user,
			preferences: {
				aiAnswerLength: 'short',
				toneOfVoice: 'heartfelt',
				nvcKnowledge: 'beginner'
			}
		};
	}
};

export const actions: Actions = {
	updatePreferences: async ({ request, locals }) => {
		const user = locals.user;
		const pb = locals.pb;
		
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			const formData = await request.formData();
			const aiAnswerLength = formData.get('aiAnswerLength') as string;
			const toneOfVoice = formData.get('toneOfVoice') as string;
			const nvcKnowledge = formData.get('nvcKnowledge') as string;

			console.log('Updating preferences for user:', user.id);
			console.log('New preferences:', { aiAnswerLength, toneOfVoice, nvcKnowledge });

			// Validate values
			const validAnswerLengths = ['short', 'medium', 'long'];
			const validTones = ['analytical', 'heartfelt'];
			const validKnowledge = ['beginner', 'intermediate', 'advanced'];

			if (!validAnswerLengths.includes(aiAnswerLength) || 
				!validTones.includes(toneOfVoice) ||
				!validKnowledge.includes(nvcKnowledge)) {
				console.error('Invalid preference values received:', { aiAnswerLength, toneOfVoice, nvcKnowledge });
				return fail(400, { error: 'Invalid preference values' });
			}

			// Update user preferences using authenticated PocketBase instance
			await pb.collection('users').update(user.id, {
				aiAnswerLength,
				toneOfVoice,
				nvcKnowledge
			});

			return {
				success: true,
				message: 'Einstellungen erfolgreich gespeichert!'
			};
		} catch (error) {
			console.error('Error updating preferences:', error);
			return fail(500, { error: 'Failed to update preferences' });
		}
	}
};