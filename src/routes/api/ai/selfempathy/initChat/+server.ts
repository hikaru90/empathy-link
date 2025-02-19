import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ClientResponseError } from 'pocketbase';
import { genAI, selfempathyChats } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai';
import { pb } from '$scripts/pocketbase';

interface DbMessage {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
	// content: string | { step: number; text: string };
	timestamp: number;
}

interface GeminiMessage {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
}

export interface ChatRecord {
	id: string;
	user: string;
	module: string;
	history: Array<DbMessage>;
	preferences: Record<string, any>;
	created: string;
	updated: string;
}

const schema = {
	description: 'Structured response of a step by step process',
	type: SchemaType.OBJECT,
	properties: {
		step: {
			type: SchemaType.INTEGER,
			description: 'Current step in this process'
		},
		text: {
			type: SchemaType.STRING,
			description: 'Content of the step'
		}
	},
	required: ['step', 'text']
};

const initHistory = (user: object, history?: Array<DbMessage>) => {
	if (history) {
		return formatHistoryForGemini(history);
	}
	return [
	];
};

const initModel = async (user?: object, systemInstruction?: string, history?: Array<DbMessage>) => {
	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
		systemInstruction: systemInstruction
	});
	const chat = model.startChat({
		history: initHistory(user!, history),
		generationConfig: {
			temperature: 0,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 8192,
			responseMimeType: 'application/json',
			responseSchema: schema
		},
		safetySettings: [
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_NONE
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_NONE
			}
		]
	});

	const result = await chat.sendMessage(
		`Please greet the user and ask for the current state of mind.`
	);
	const response = await result.response;
	const responseText = await response.text();
	const responseJson = JSON.parse(responseText);
	console.log('responseJson', responseJson);

	// Create initial history with timestamps
	const initialHistory = [
		{
			role: 'model',
			parts: [{ text: responseJson.text }],
      step: responseJson.step,
			timestamp: Date.now()
		}
	];

	chat._history = initialHistory;  // Store the history with timestamp
	return chat;
};
const saveChatInMemory = (chatId: string, chat: any) => {
	selfempathyChats.set(chatId, chat);
};
const initChatInDb = async (user: any, chat: any) => {
	let chatData: Partial<ChatRecord> = {
		user: user.id,
		module: 'selfempathy',
		history: chat._history || [], // This will now include timestamps
		preferences: {}
	};

	const record = await pb.collection('chats').create(chatData);
	console.log('Created new chat record:', record);
	return record;
};
const getChatFromDb = async (chatId: string) => {
	console.log('getChatFromDb chatId', chatId);
	const record = await pb.collection('chats').getOne(chatId);
	return record;
};

const formatHistoryForGemini = (history?: DbMessage[]): GeminiMessage[] => {
	if (!history) return [];

	return history.map((msg) => {
		console.log('msg', msg);
		return {
			role: msg.role === 'model' ? 'model' : 'user',
			// Remove JSON formatting characters without regex

			parts: [
				{
					text:
						typeof msg.parts[0].text === 'object'
							? JSON.stringify(msg.parts[0].text)
									.split('{')
									.join('')
									.split('}')
									.join('')
									.split('[')
									.join('')
									.split(']')
									.join('')
									.split('"')
									.join('')
									.split(';')
									.join('')
									.split(',')
									.join(' ')
							: msg.parts[0].text
				}
			]
			// parts: [{
			//   text: msg.role === 'model'
			//     ? JSON.stringify(msg.content)
			//     : typeof msg.content === 'string'
			//       ? msg.content
			//       : msg.content.text
			// }]
		};
	});
};

const chatExistsInMemory = (chatId: string) => {
	return selfempathyChats.has(chatId);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user, history, systemInstruction } = await request.json();

	if (!user?.id) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	try {
		let chatInDb;

		try {
			chatInDb = await pb
				.collection('chats')
				.getFirstListItem(`user="${user.id}" && module="selfempathy"`);
		} catch (err) {
			if (!(err instanceof ClientResponseError && err.status === 404)) {
				throw err;
			}
		}

		if (!chatInDb) {
			const chat = await initModel(user, systemInstruction);
			const chatInDb = await initChatInDb(user, chat);
			saveChatInMemory(chatInDb.id, chat);

			return json({ record: chatInDb });
		} else {
      console.log('chatInDb.history',chatInDb.history);
			const chat = await initModel(user, systemInstruction, chatInDb.history);
			saveChatInMemory(chatInDb.id, chat);
      console.log('selfempathyChats',selfempathyChats);

			return json({ record: chatInDb });
		}
	} catch (error) {
		return json({ error: 'Failed to initialize chat' }, { status: 500 });
	}
};
