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

export const getSystemInstruction = (user: any, locale: string) => {
	console.log('user object in getSystemInstruction:', user);
	
	// Handle different possible user object structures
	const firstName = user?.firstName || user?.first_name || user?.name || 'there';
	// Capitalize first letter
	const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
	
	// Call the translation function directly with the variables
	return m.ai_system_selfempathy({
		firstName: capitalizedFirstName,
		locale: locale
	});
};

export const getConfig = (user: object, locale: string) => {
	return {
		// temperature: 0.3,
		systemInstruction: getSystemInstruction(user, locale)
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

	const systemInstruction = getSystemInstruction(user, locale);

	const model: CreateChatParameters = {
		model: 'gemini-2.0-flash',
		config: getConfig(user, locale)
	};

	if (history) {
		model.history = history;
	}

	return { model, systemInstruction };
};

export const initChat = async (user: object, locale: string) => {
	const dbChat = await pb.collection('chats').create({
		history: [],
		user: pb.authStore.model?.id,
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
