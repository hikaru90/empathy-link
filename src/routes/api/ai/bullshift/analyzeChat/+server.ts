import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats, initChat } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import type { Content } from '@google/genai';
import { analyzeChat } from '$lib/server/tools';
import { z } from 'zod';

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
}


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
		console.log('analyzeChat server');
		const { user, locale, chatId } = await request.json();

		const analysis = await analyzeChat(chatId, user.id, locale);
		console.log('analysis', analysis);

		const analysisSchema = z.object({
			title: z.string(),
			observation: z.string(),
			feelings: z.array(z.string()),
			needs: z.array(z.string()),
			request: z.string(),
			sentimentPolarity: z.number(),
			intensityRatio: z.number(),
			emotionalBalance: z.number(),
			triggerCount: z.number(),
			resolutionCount: z.number(),
			escalationRate: z.number(),
			empathyRate: z.number(),
			messageLength: z.number(),
			readabilityScore: z.number()
		});

		interface Analysis extends z.infer<typeof analysisSchema> {
			user?: string;
			chat?: string;
		}

		const validatedAnalysis:Analysis = analysisSchema.parse(analysis);
		if (!validatedAnalysis) {
			throw new Error('Invalid analysis');
		}

		validatedAnalysis.user = user.id;
		validatedAnalysis.chat = chatId;

		const record = await pb.collection('analyses').create(validatedAnalysis);

		const result = await initChat(user, locale);
		return json(result);
	} catch (error) {
		console.error('Failed to initialize chat:', error);
		return json({ error: 'Failed to initialize chat' }, { status: 500 });
	}
};
