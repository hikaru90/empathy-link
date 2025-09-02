import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';

export const GET: RequestHandler = async ({ url }) => {
	try {
		console.log('🔍 Testing prompts collection access...');
		
		// Test basic collection access
		const prompts = await pb.collection('prompts').getFullList({
			sort: 'created'
		});
		
		console.log('✅ Successfully fetched', prompts.length, 'prompts');
		console.log('📋 First prompt:', prompts[0]);
		
		return json({
			success: true,
			count: prompts.length,
			prompts: prompts,
			message: 'Prompts collection accessible'
		});
		
	} catch (error) {
		console.error('❌ Error accessing prompts:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			details: error
		}, { status: 500 });
	}
};