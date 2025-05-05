import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats, getConfig, ai } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import {
	shouldAnalyzeFeelingsTool,
	analyzeAndSaveFeelings,
	saveTrace,
	queueMemoryExtraction,
	shouldSaveObservationTool,
	defineCurrentStep,
	saveObservation
} from '$lib/server/tools';
import type { GenerateContentResponse, FunctionCallingConfigMode } from '@google/genai';
import { user } from '$store/auth';

export interface State {
	currentStep: string;
	observation: string;
	feelings: string[];
	needs: string[];
	request: string;
}

const sanitizeText = (text: string) => {
	console.log('text', text);
	if(text.includes('```json')) {
		text = text.replace('```json', '').replace('```', '');
	}
	if(text.includes('```')) {
		text = text.replace('```', '');
	}
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
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { chatId, message, userId, systemInstruction, locale } = await request.json();

		if (!chatId || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const chatInMemory = bullshiftChats.get(chatId);
		if (!chatInMemory) {
			return json({ error: 'Chat session not found' }, { status: 404 });
		}
		const chatInDb = await pb.collection('chats').getOne(chatId);
		let state = chatInDb?.state || initialState;

		await queueMemoryExtraction(userId, 'pending');

		// Send message and get response
		const response: GenerateContentResponse = await chatInMemory.sendMessage({ message });
		if(!response.text) throw new Error('No text in response');
		// const text = sanitizeText(response.text);

		// if (response.functionCalls && response.functionCalls.length > 0) {
		// 	//there was a function call
		// 	for (const functionCall of response.functionCalls) {
		// 		console.log('function called', functionCall);
		// 		switch (functionCall.name) {
		// 			case 'save_observation':
		// 				const result = await saveObservation(
		// 					functionCall!.args!.message as string,
		// 					chatId,
		// 					userId,
		// 					state
		// 				);
		// 				if (!result) throw 'Error saving Observation';

		// 				const toolOutputs = [
		// 					{ role: 'model', parts: [{ functionCall }] },
		// 					{
		// 						role: 'user',
		// 						parts: [
		// 							{
		// 								functionResponse: {
		// 									name: functionCall.name,
		// 									response: { result }
		// 								}
		// 							}
		// 						]
		// 					}
		// 				];

		// 				await chatInMemory.sendMessage({
		// 					message: {
		// 						functionCall
		// 					}
		// 				});
		// 				const finalResponse: GenerateContentResponse = await chatInMemory.sendMessage({
		// 					message: {
		// 						functionResponse: {
		// 							name: functionCall.name,
		// 							response: { result }
		// 						}
		// 					}
		// 				});
		// 				console.log('finalResponse',JSON.stringify(finalResponse));
		// 				if(!finalResponse.text) throw new Error('No text in response');
		// 				text = sanitizeText(finalResponse.text);
		// 				console.log('finalResponse in saveObservation', finalResponse);

		// 				break;
		// 			default:
		// 				text = ''
		// 				break;
		// 		}
		// 	}
		// } else {
		// 	//no function call
		// 	console.log('No function call found in the response.');
		// 	if(!response.text) throw new Error('No text in response');
		// 	text = sanitizeText(response.text);
		// }

		await pb.collection('chats').update(chatId, { history: await chatInMemory.getHistory() });

		saveTrace(
			'sendMessage',
			message,
			'bullshift',
			chatId,
			userId,
			response.text,
			response,
			systemInstruction
		);

		return json({
			response: response.text,
			timestamp: Date.now()
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
