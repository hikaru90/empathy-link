/**
 * Test script to create a chat with path tracking
 * Run with: node test-create-path-chat.js
 */

const BASE_URL = 'http://localhost:5173';

// Mock user for testing
const mockUser = {
	id: 'test-user-456',
	firstName: 'PathTest',
	email: 'pathtest@example.com'
};

async function testCreatePathChat() {
	console.log('🧪 Testing Path-Enabled Chat Creation...\n');

	try {
		// Call the initChat API endpoint
		console.log('1. Creating new chat with path system...');
		const initResponse = await fetch(`${BASE_URL}/api/ai/bullshift/initChat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user: mockUser,
				locale: 'en',
				initialPath: 'self_empathy' // Explicitly set initial path
			})
		});
		
		if (!initResponse.ok) {
			throw new Error(`HTTP ${initResponse.status}: ${await initResponse.text()}`);
		}

		const initResult = await initResponse.json();
		console.log('✅ Chat created:', {
			chatId: initResult.chatId,
			activePath: initResult.activePath,
			hasPathState: !!initResult.pathState,
			systemInstruction: initResult.systemInstruction?.substring(0, 100) + '...'
		});

		// Now let's check the actual chat data from PocketBase
		console.log('\n2. Checking chat data structure...');
		
		// We can't directly access PocketBase from here, but we can check via the insights endpoint
		// First, let's send a message to populate the chat
		console.log('\n3. Sending test message...');
		const messageResponse = await fetch(`${BASE_URL}/api/ai/bullshift/send`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chatId: initResult.chatId,
				message: "I feel frustrated about my work situation",
				locale: 'en'
			})
		});

		if (!messageResponse.ok) {
			console.error('❌ Message failed:', await messageResponse.text());
			return;
		}

		const messageResult = await messageResponse.json();
		console.log('✅ Message sent. Response includes path info:', {
			currentPath: messageResult.currentPath,
			hasPathCompletion: !!messageResult.pathCompletion,
			hasPathState: !!messageResult.pathState
		});

		console.log('\n🎉 Path-enabled chat creation test completed!');
		console.log(`Visit: ${BASE_URL}/bullshift/insights/${initResult.chatId} to see path analysis`);

	} catch (error) {
		console.error('❌ Test failed:', error.message);
		if (error.cause) {
			console.error('Cause:', error.cause);
		}
	}
}

// Run the test
testCreatePathChat();