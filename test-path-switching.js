/**
 * Test script for path switching functionality
 * Run with: node test-path-switching.js
 */

const BASE_URL = 'http://localhost:5173';

// Mock user for testing
const mockUser = {
	id: 'test-user-123',
	firstName: 'TestUser',
	email: 'test@example.com'
};

async function testPathSwitching() {
	console.log('🧪 Testing Path Switching System...\n');

	try {
		// 1. Initialize chat with self_empathy path
		console.log('1. Initializing chat with self_empathy path...');
		const initResponse = await fetch(`${BASE_URL}/api/ai/bullshift/initChat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user: mockUser,
				locale: 'en',
				initialPath: 'self_empathy'
			})
		});
		
		const initResult = await initResponse.json();
		console.log('✅ Chat initialized:', {
			chatId: initResult.chatId,
			activePath: initResult.activePath,
			systemInstruction: initResult.systemInstruction?.substring(0, 100) + '...'
		});
		console.log('');

		const chatId = initResult.chatId;

		// 2. Send a message indicating self-understanding
		console.log('2. Sending message indicating self-understanding...');
		const messageResponse = await fetch(`${BASE_URL}/api/ai/bullshift/send`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chatId,
				message: "I understand now - I was feeling hurt because I need to feel heard and valued. Thank you, this really helps me feel clearer about my situation.",
				locale: 'en'
			})
		});

		const messageResult = await messageResponse.json();
		console.log('✅ Message sent. Path completion check:', {
			shouldEnd: messageResult.pathCompletion?.shouldEnd,
			confidence: messageResult.pathCompletion?.confidence,
			reason: messageResult.pathCompletion?.reason,
			suggestedPaths: messageResult.pathCompletion?.suggestedPaths
		});
		console.log('');

		// 3. Get available paths
		console.log('3. Getting available paths...');
		const pathsResponse = await fetch(`${BASE_URL}/api/ai/bullshift/getPaths?chatId=${chatId}`);
		const pathsResult = await pathsResponse.json();
		console.log('✅ Available paths:', pathsResult.availablePaths.map(p => ({ id: p.id, name: p.name })));
		console.log('');

		// 4. Switch to other_empathy path
		console.log('4. Switching to other_empathy path...');
		const switchResponse = await fetch(`${BASE_URL}/api/ai/bullshift/switchPath`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chatId,
				newPathId: 'other_empathy',
				locale: 'en'
			})
		});

		const switchResult = await switchResponse.json();
		console.log('✅ Path switched:', {
			success: switchResult.success,
			activePath: switchResult.activePath,
			pathMarkers: switchResult.pathMarkers?.length,
			newSystemInstruction: switchResult.systemInstruction?.substring(0, 100) + '...'
		});
		console.log('');

		// 5. Send message in new path context
		console.log('5. Sending message in other_empathy context...');
		const message2Response = await fetch(`${BASE_URL}/api/ai/bullshift/send`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chatId,
				message: "Now I'd like to understand what the other person might be feeling in this situation.",
				locale: 'en'
			})
		});

		const message2Result = await message2Response.json();
		console.log('✅ Second message sent. Current path:', message2Result.currentPath);
		console.log('AI Response:', message2Result.response?.substring(0, 150) + '...');
		console.log('');

		console.log('🎉 Path switching test completed successfully!');

	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test
testPathSwitching();