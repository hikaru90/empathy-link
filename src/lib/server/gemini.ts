import { pb } from '$scripts/pocketbase';
import {
	GoogleGenAI,
	Type,
} from '@google/genai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import type { Chat, CreateChatParameters } from '@google/genai';
import { m } from '$lib/translations';

// Initialize Gemini once
export const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });

export const selfempathyChats = new Map<string, Chat>();
export const bullshiftChats = new Map<string, Chat>();

export const getIds = (map: Map<string, Chat>) => {
	return Array.from(map.keys());
};

export const sendMessage = async (
	chatId: string,
	chat: Chat,
	message: string,
	history: HistoryEntry[]
) => {
	try {
		console.log('message', message);
		// Send the message directly without modifying chat history
		const result = await chat.sendMessage({message});
		const responseText = result.text || '';
		const responseJson = JSON.parse(responseText);
		console.log('responseJson from sendMessage', responseJson);

		// Store in DB with full metadata (this format is only for our database)
		await pb.collection('chats').update(chatId, {
			history: await chat.getHistory(),
			updated: new Date().toISOString()
		});

		return responseJson;
	} catch (error) {
		console.error('error in sendMessage', error);
		return { error: 'Failed to send message' };
	}
};

// Add this helper function to fetch and format user memories
const getUserMemories = async (userId: string): Promise<string> => {
	try {
		const memories = await pb.collection('memories').getFullList({
			filter: `user = "${userId}"`,
			sort: '-created'
		});

		if (memories.length === 0) {
			return '';
		}

		const memoryContext = memories.map(memory => {
			const confidenceLevel = memory.confidence === 'certain' ? '(high confidence)' : 
									memory.confidence === 'likely' ? '(medium confidence)' : 
									'(low confidence)';
			return `- ${memory.key}: ${memory.value} ${confidenceLevel}`;
		}).join('\n');

		return `\n\nPrevious information about this user from past conversations:\n${memoryContext}\n\nPlease use this context to personalize your responses while being natural about it.`;
	} catch (error) {
		console.error('Error fetching user memories:', error);
		return '';
	}
};

export const getSystemInstruction = async (user: any, locale: string) => {
	console.log('user object in getSystemInstruction:', user);
	
	// Handle different possible user object structures
	const firstName = user?.firstName || user?.first_name || user?.name || 'there';
	// Capitalize first letter
	const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
	
	// Get user memories
	const memoriesContext = user?.id ? await getUserMemories(user.id) : '';
	
	// Call the translation function directly with the variables
	const baseInstruction = m.ai_system_selfempathy({
		firstName: capitalizedFirstName,
		locale: locale
	});

	return baseInstruction + memoriesContext;
};

export const getConfig = async (user: object, locale: string) => {
	return {
		// temperature: 0.3,
		systemInstruction: await getSystemInstruction(user, locale)
		// tools: [
		// 	{
		// 		functionDeclarations: [saveObservationFunctionDeclaration]
		// 	}
		// ],
		// toolConfig: {
		// 	functionCallingConfig: {
		// 		mode: FunctionCallingConfigMode.AUTO,
		// 		// allowedFunctionNames: ['save_message']
		// 	},
		// }
	};
};

export const getModel = async (user: object, locale: string, history?: HistoryEntry[]) => {
	const feelings = await pb.collection('feelings').getFullList({
		sort: 'category,sort'
	});
	const needs = await pb.collection('needs').getFullList({
		sort: 'category,sort'
	});

	const systemInstruction = await getSystemInstruction(user, locale);

	const model: CreateChatParameters = {
		model: 'gemini-2.0-flash',
		config: await getConfig(user, locale)
	};

	if (history) {
		model.history = history;
	}

	return { model, systemInstruction };
};

export const initChat = async (user: any, locale: string) => {
	const dbChat = await pb.collection('chats').create({
		history: [],
		user: user.id,
		module: 'bullshift'
	});

	// Initialize the chat in memory with the correct model
	const { model, systemInstruction } = await getModel(user, locale);
	const chat = ai.chats.create(model);
	bullshiftChats.set(dbChat.id, chat);

	return {
		chatId: dbChat.id,
		chat: chat,
		systemInstruction
	};
};
