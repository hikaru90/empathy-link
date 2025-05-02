import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { shouldAnalyzeFeelingsTool, analyzeAndSaveFeelings, saveTrace, queueMemoryExtraction, shouldSaveObservationTool, defineCurrentStep, saveObservation } from '$lib/server/tools';
import type { GenerateContentResponse } from '@google/genai';

export interface State {
	currentStep: string;
	observation: string;
	feelings: string[];
	needs: string[];
	request: string;
}

const sanitizeText = (text: string) => {
	console.log('text', text);
	// Replace multiple newlines with single newline
	let sanitized = text.replace(/\n{2,}/g, '\n');
	// Replace multiple tabs with single tab
	sanitized = sanitized.replace(/\t{2,}/g, '\t');
	// Trim whitespace from start and end

	return sanitized.trim();
};

const initialState: State = {
	currentStep: 'observation',
	observation: '',
	feelings: [],
	needs: [],
	request: ''
}


export const POST: RequestHandler = async ({ request }) => {
	try {
		const { chatId, message, userId, systemInstruction } = await request.json();

		if (!chatId || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const chatInMemory = bullshiftChats.get(chatId);
		if (!chatInMemory) {
			return json({ error: 'Chat session not found' }, { status: 404 });
		}
		const chatInDb = await pb.collection('chats').getOne(chatId)
		let state = chatInDb?.state || initialState

		await queueMemoryExtraction(userId, 'pending')

		console.log('initial state', state);
		state = await defineCurrentStep(message, chatId, userId, state)
		console.log('state', state);

		// switch (state.currentStep) {
		// 	case 'observation':
		// 		const {state: newState, userResponse} = await saveObservation(message, await chatInMemory.getHistory(), chatId, userId, state);
		// 		state = newState
		// 		console.log('userResponse',userResponse);
		// 		break;
		// 	case 'feelings':
		// 		await analyzeAndSaveFeelings(message, chatId, userId);
		// 		break;
		// 	case 'needs':
		// 		// await analyzeAndSaveNeeds(message, chatId, userId);
		// 		break;
		// 	case 'request':
		// 		// await analyzeAndSaveRequest(message, chatId, userId);
		// 		break;
		// }

		// const shouldSaveObservation = await shouldSaveObservationTool(message, chatId, userId, state);
		// // if (shouldSaveObservation) {
		// // 	await saveObservation(message, chatId, userId);
		// // }

		// const shouldAnalyzeFeelings = await shouldAnalyzeFeelingsTool(message, chatId, userId);
		// if (shouldAnalyzeFeelings) {
		// 	await analyzeAndSaveFeelings(message, chatId, userId);
		// }

		// Send message and get response
		const result: GenerateContentResponse = await chatInMemory.sendMessage({ message });
		if (!result.text) throw new Error('No text in response');
		const text = sanitizeText(result.text);
		await pb.collection('chats').update(chatId, { history: await chatInMemory.getHistory() });

		console.log('systemInstruction', systemInstruction);
		saveTrace('sendMessage', message, 'bullshift', chatId, userId, text, result, systemInstruction);

		return json({
			response: text,
			timestamp: Date.now()
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
