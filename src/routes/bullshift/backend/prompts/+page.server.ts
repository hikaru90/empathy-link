import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { DbPrompt } from '$lib/server/prompts';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	// For now, allow any authenticated user (you can adjust this later)
	if (!user) {
		return {
			error: 'Authentication required.'
		};
	}

	try {
		console.log('🔍 Fetching prompts from database...');
		console.log('👤 Current user:', user.id);
		console.log('🔐 Auth state:', {
			isValid: locals.pb.authStore.isValid,
			token: locals.pb.authStore.token ? 'present' : 'missing',
			model: locals.pb.authStore.model?.id
		});
		
		// Log the headers that will be sent
		console.log('🔑 PocketBase URL:', locals.pb.baseUrl);
		console.log('🔑 Auth token:', locals.pb.authStore.token ? 'Bearer ' + locals.pb.authStore.token.substring(0, 20) + '...' : 'none');
		
		// Fetch all prompts from database using the authenticated instance
		const prompts = await locals.pb.collection('prompts').getFullList({
			sort: 'category,slug'
		});

		console.log('✅ Fetched prompts:', prompts.length, 'items');
		
		// Map prompts to ensure they have the expected structure
		const mappedPrompts = prompts.map((prompt: any) => ({
			...prompt,
			path_config: prompt.path_config || null // Ensure path_config exists
		}));

		return {
			prompts: mappedPrompts
		};
	} catch (error) {
		console.error('❌ Error fetching prompts:', error);
		return {
			error: `Failed to fetch prompts: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return { error: 'Unauthorized' };
		}

		try {
			const data = await request.formData();
			const promptData: any = {
				slug: data.get('slug') as string,
				name: data.get('name') as string,
				content: data.get('content') as string,
				recurring: data.get('recurring') === 'on',
				category: data.get('category') as string,
				description: data.get('description') as string || '',
				active: data.get('active') === 'on'
			};

			// Only add path_config if your collection has this field
			const pathConfigStr = data.get('path_config') as string;
			if (pathConfigStr && pathConfigStr.trim()) {
				try {
					// Try to parse as JSON first
					promptData.path_config = JSON.parse(pathConfigStr);
				} catch (parseError) {
					// If JSON parsing fails, try to evaluate as JavaScript object
					try {
						// Remove any trailing commas and ensure it's a valid object
						const cleanedStr = pathConfigStr.replace(/,(\s*[}\]])/g, '$1');
						const evaluated = eval(`(${cleanedStr})`);
						if (typeof evaluated === 'object' && evaluated !== null) {
							promptData.path_config = evaluated;
						} else {
							console.warn('path_config is not a valid object, skipping');
						}
					} catch (evalError) {
						console.warn('Invalid path_config format, skipping:', evalError);
					}
				}
			}

			console.log('Creating prompt:', promptData);
			await locals.pb.collection('prompts').create(promptData);
			return { success: true, message: 'Prompt created successfully' };
		} catch (error) {
			console.error('Error creating prompt:', error);
			return { error: `Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}` };
		}
	},

	update: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return { error: 'Unauthorized' };
		}

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			const promptData: any = {
				slug: data.get('slug') as string,
				name: data.get('name') as string,
				content: data.get('content') as string,
				recurring: data.get('recurring') === 'on',
				category: data.get('category') as string,
				description: data.get('description') as string || '',
				active: data.get('active') === 'on'
			};

			// Only add path_config if your collection has this field
			const pathConfigStr = data.get('path_config') as string;
			if (pathConfigStr && pathConfigStr.trim()) {
				try {
					// Try to parse as JSON first
					promptData.path_config = JSON.parse(pathConfigStr);
				} catch (parseError) {
					// If JSON parsing fails, try to evaluate as JavaScript object
					try {
						// Remove any trailing commas and ensure it's a valid object
						const cleanedStr = pathConfigStr.replace(/,(\s*[}\]])/g, '$1');
						const evaluated = eval(`(${cleanedStr})`);
						if (typeof evaluated === 'object' && evaluated !== null) {
							promptData.path_config = evaluated;
						} else {
							console.warn('path_config is not a valid object, skipping');
						}
					} catch (evalError) {
						console.warn('Invalid path_config format, skipping:', evalError);
					}
				}
			}

			console.log('Updating prompt:', id, promptData);
			await locals.pb.collection('prompts').update(id, promptData);
			return { success: true, message: 'Prompt updated successfully' };
		} catch (error) {
			console.error('Error updating prompt:', error);
			return { error: `Failed to update prompt: ${error instanceof Error ? error.message : 'Unknown error'}` };
		}
	},

	delete: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return { error: 'Unauthorized' };
		}

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			console.log('Deleting prompt:', id);
			await locals.pb.collection('prompts').delete(id);
			return { success: true, message: 'Prompt deleted successfully' };
		} catch (error) {
			console.error('Error deleting prompt:', error);
			return { error: `Failed to delete prompt: ${error instanceof Error ? error.message : 'Unknown error'}` };
		}
	}
};