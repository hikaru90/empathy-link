import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ClientResponseError } from 'pocketbase';
import { ai, selfempathyChats, sendMessage } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory, Type } from '@google/genai';
import { pb } from '$scripts/pocketbase';
import type { Content, Chat } from '@google/genai';


export interface HistoryEntry {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: number;
}

export interface HistoryEntryWithFirstUser {
  [0]: Extract<HistoryEntry, { role: 'user' }>;
  [index: number]: HistoryEntry;
  length: number;
}

export interface DbChatSession {
  user: string; // User ID
  module: string; // Module identifier
  history: HistoryEntry[];
  // Add any other properties you need from Chat here, if necessary
}


const schema = {
	description: 'Structured response of a step by step process',
	type: Type.OBJECT,
	properties: {
		step: {
			type: Type.INTEGER,
			description: 'Current step in this process'
		},
		text: {
			type: Type.STRING,
			description: 'Content of the step'
		}
	},
	required: ['step', 'text']
};

const initHistory = (user: object, history?: HistoryEntry[]) => {
	if (history) {
		return formatHistoryForGemini(history);
	}
	return [
	];
};

const initModel = async (user?: object, systemInstruction?: string, history?: HistoryEntry[]) => {
	try {
		const testHistory = initHistory(user!, history);
		console.log('testHistory', testHistory);
		const chat = ai.chats.create({
			model: 'gemini-1.5-flash',
			config: {
				systemInstruction: systemInstruction,
				temperature: 0,
				topP: 0.95,
				topK: 64,
				maxOutputTokens: 8192,
				responseMimeType: 'application/json',
				responseSchema: schema,
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
			},
			history: initHistory(user!, history),
		});

		

		return chat;
	} catch (err) {
		console.error('error in initModel', err)
	}
};
const saveChatInMemory = (chatId: string, chat: any) => {
	selfempathyChats.set(chatId, chat);
};
const initChatInDb = async (user: any, chat: any) => {
	let chatData: Partial<DbChatSession> = {
		user: user.id,
		module: 'selfempathy',
		history: chat.history || [], // This will now include timestamps
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

const formatHistoryForGemini = (history?: HistoryEntry[]): Content[] => {
	if (!history) return [];
	if (history.length > 0 && history[0].role === 'model') {
		history = history.slice(1);
	}

	return history.map((msg) => {
		return {
			role: msg.role,
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
	try {
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
				if(!chat) throw new Error('Failed to initialize chat');
				const chatInDb = await initChatInDb(user, chat);
				saveChatInMemory(chatInDb.id, chat);

				sendMessage(chatInDb.id, chat, `Please greet the user and ask for the current state of mind.`, []);

				return json({ record: chatInDb });
			} else {
				console.log('chatInDb.history', chatInDb.history);
				const chat = await initModel(user, systemInstruction, chatInDb.history);
				console.log('chat from db', chat);
				saveChatInMemory(chatInDb.id, chat);
				console.log('selfempathyChats', selfempathyChats);

				return json({ record: chatInDb });
			}
		} catch (error) {
			return json({ message: 'Failed to initialize chat', error }, { status: 500 });
		}
	} catch (error) {
		console.error('error in initChat', error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
};
