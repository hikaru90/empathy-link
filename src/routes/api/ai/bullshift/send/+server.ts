import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import {
	saveTrace,
	queueMemoryExtraction,
} from '$lib/server/tools';
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
		
		console.log('Send request received:', { chatId, message, userId, locale });
		console.log('Available chats in memory:', Array.from(bullshiftChats.keys()));

		if (!chatId || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const chatInMemory = bullshiftChats.get(chatId);
		if (!chatInMemory) {
			console.log('Chat not found in memory for chatId:', chatId);
			return json({ error: 'Chat session not found' }, { status: 404 });
		}
		const chatInDb = await pb.collection('chats').getOne(chatId);
		let state = chatInDb?.state || initialState;

		await queueMemoryExtraction(userId, 'pending');

		// Send message and get response
		const response: GenerateContentResponse = await chatInMemory.sendMessage({ message });
		if(!response.text) throw new Error('No text in response');


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
