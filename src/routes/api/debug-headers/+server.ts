import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';

// Custom fetch wrapper to log headers
const logFetch = async (url: string, options: RequestInit = {}) => {
	console.log('🔍 Making request to:', url);
	console.log('📋 Method:', options.method || 'GET');
	console.log('🔑 Headers:', options.headers);
	console.log('📦 Body:', options.body);
	
	const response = await fetch(url, options);
	
	console.log('📥 Response Status:', response.status);
	console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
	
	return response;
};

export const GET: RequestHandler = async ({ request }) => {
	try {
		console.log('🔍 Testing PocketBase headers...');
		
		// Check current auth state
		console.log('🔐 Current Auth State:', {
			isValid: pb.authStore.isValid,
			token: pb.authStore.token ? 'present' : 'missing',
			model: pb.authStore.model?.id || 'none',
			email: pb.authStore.model?.email || 'none'
		});
		
		// Get the PocketBase URL
		const pbUrl = pb.baseUrl;
		console.log('🌐 PocketBase URL:', pbUrl);
		
		// Create headers that PocketBase would send
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};
		
		// Add auth token if available
		if (pb.authStore.token) {
			headers['Authorization'] = `Bearer ${pb.authStore.token}`;
			console.log('🔑 Added Authorization header with token');
		}
		
		// Test with custom fetch to see headers
		const testUrl = `${pbUrl}/api/collections/prompts/records?page=1&perPage=1`;
		console.log('🧪 Testing URL:', testUrl);
		
		const response = await logFetch(testUrl, {
			method: 'GET',
			headers
		});
		
		const data = await response.json();
		
		return json({
			success: true,
			message: 'Headers test completed',
			authState: {
				isValid: pb.authStore.isValid,
				hasToken: !!pb.authStore.token,
				userId: pb.authStore.model?.id,
				email: pb.authStore.model?.email
			},
			requestDetails: {
				url: testUrl,
				headers: headers,
				responseStatus: response.status
			},
			testResult: data
		});
		
	} catch (error) {
		console.error('❌ Error testing headers:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			authState: {
				isValid: pb.authStore.isValid,
				hasToken: !!pb.authStore.token,
				userId: pb.authStore.model?.id
			}
		}, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();
		
		console.log('🔐 Attempting authentication with:', { email });
		
		// Authenticate with email/password
		const authData = await pb.collection('users').authWithPassword(email, password);
		
		console.log('✅ Authentication successful:', {
			userId: authData.record.id,
			email: authData.record.email,
			token: authData.token ? 'present' : 'missing'
		});
		
		// Now you can make authenticated requests
		const prompts = await pb.collection('prompts').getFullList();
		
		return json({
			success: true,
			message: 'Authentication successful',
			user: {
				id: authData.record.id,
				email: authData.record.email,
				name: authData.record.name
			},
			promptsCount: prompts.length
		});
		
	} catch (error) {
		console.error('❌ Authentication failed:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Authentication failed'
		}, { status: 401 });
	}
};
