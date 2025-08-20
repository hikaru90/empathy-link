import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	bullshiftChats,
	analyzeGfkCompliance,
	flagViolations,
	type GfkAnalysis,
	type Sensitivity
} from '$lib/server/gemini';
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
	if (text.includes('```json')) {
		text = text.replace('```json', '').replace('```', '');
	}
	if (text.includes('```')) {
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

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, message, systemInstruction, locale } = await request.json();

		console.log('Send request received:', { chatId, message, userId: user.id, locale });
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

		await queueMemoryExtraction(user.id, 'pending');

		// Default sensitivity thresholds (can be made configurable)
		const defaultSensitivity: Sensitivity = {
			Beobachtung_vs_Bewertung: 6,
			Gefühle_vs_Gedanken: 6,
			Bedürfnisse_vs_Strategien: 6,
			Bitte_vs_Forderung: 6
		};

		let nvcAnalysis: GfkAnalysis | null = null;
		let nvcViolations: Record<string, { score: number; explanation: string }> = {};


		console.log('Performing GFK analysis on message:', message);
		nvcAnalysis = await analyzeGfkCompliance(message, locale || 'de', chatId, user.id);
		nvcViolations = flagViolations(nvcAnalysis, defaultSensitivity);
		console.log('GFK Analysis:', nvcAnalysis);
		console.log('GFK Violations:', nvcViolations);

		// If there are NVC violations, create a temporary chat with context for enhanced response
		let response: GenerateContentResponse;
		
		if (Object.keys(nvcViolations).length > 0) {
			console.log('NVC violations detected, creating temporary enhanced context');
			
			// Get current history without the new message
			const currentHistory = await chatInMemory.getHistory();
			
			// Create enhanced message with context for temporary processing
			const violationContext = locale === 'de' 
				? `[SYSTEM KONTEXT: Der Nutzer zeigt GFK-Verbesserungspotential: ${Object.entries(nvcViolations)
					.map(([key, violation]) => `${key.replace(/_/g, ' ')}: ${violation.explanation} (${violation.score}/10)`)
					.join('; ')}. Hilf empathisch bei der Verbesserung.]\n\n${message}`
				: `[SYSTEM CONTEXT: User shows NVC improvement potential: ${Object.entries(nvcViolations)
					.map(([key, violation]) => `${key.replace(/_/g, ' ')}: ${violation.explanation} (${violation.score}/10)`)
					.join('; ')}. Help empathetically with improvement.]\n\n${message}`;
			
			// Send enhanced message to get better response
			response = await chatInMemory.sendMessage({ message: violationContext });
			
			// Now manually fix the history to only show the original user message
			const newHistory = await chatInMemory.getHistory();
			if (newHistory.length >= 2) {
				// Replace the last user message (which has the context) with the original message
				newHistory[newHistory.length - 2] = {
					role: 'user',
					parts: [{ text: message }]
				};
			}
			
			// Update the chat with the cleaned history (this is a bit hacky but necessary)
			// Unfortunately, we can't directly modify Gemini chat history, so we'll clean it in DB
		} else {
			// No violations, send message normally
			response = await chatInMemory.sendMessage({ message });
		}
		if (!response.text) throw new Error('No text in response');

		// Clean the history before saving to DB
		let historyToSave = await chatInMemory.getHistory();
		
		// If we had NVC violations, clean the last user message to remove system context
		if (Object.keys(nvcViolations).length > 0 && historyToSave.length >= 2) {
			const lastUserMessageIndex = historyToSave.length - 2; // User message is second to last
			if (historyToSave[lastUserMessageIndex]?.role === 'user') {
				// Replace the contextual message with the original user message
				historyToSave[lastUserMessageIndex] = {
					...historyToSave[lastUserMessageIndex],
					parts: [{ text: message }]
				};
			}
		}
		
		await pb.collection('chats').update(chatId, { history: historyToSave });

		saveTrace(
			'sendMessage',
			message,
			'bullshift',
			chatId,
			user.id,
			response.text,
			response,
			systemInstruction
		);

		return json({
			response: response.text,
			timestamp: Date.now(),
			gfkAnalysis: nvcAnalysis,
			gfkViolations: Object.keys(nvcViolations).length > 0 ? nvcViolations : null
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
