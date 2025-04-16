import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ClientResponseError } from 'pocketbase';
import { genAI, bullshiftChats, sendMessage } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai';
import { pb } from '$scripts/pocketbase';
import type { GenerativeModel, ChatSession, Content } from '@google/generative-ai';
import { initChat } from '$lib/server/gemini';


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

export interface DbChatSession extends ChatSession {
	user: string; // User ID
	module: string; // Module identifier
	history: HistoryEntry[];
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

const initHistory = (user: object, history?: HistoryEntry[]) => {
	if (history) {
		return formatHistoryForGemini(history);
	}
	return [
	];
};

const saveChatInMemory = (chatId: string, chat: any) => {
	bullshiftChats.set(chatId, chat);
};
const initChatInDb = async (user: any, chat: any) => {
	let chatData: Partial<DbChatSession> = {
		user: user.id,
		module: 'bullshift',
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
	return bullshiftChats.has(chatId);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { user, locale } = await request.json();
		const result = await initChat(user, locale);
		return json(result);
	} catch (error) {
		console.error('Failed to initialize chat:', error);
		return json({ error: 'Failed to initialize chat' }, { status: 500 });
	}
};
