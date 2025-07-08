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

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		console.log('analyzeChat server');
		const { locale, chatId } = await request.json();
		const user = locals.user;

		if (!user?.id) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		const analysis = await analyzeChat(chatId, user.id, locale);
		console.log('analysis', analysis);

		// Define schema with optional fields and defaults for numeric values
		const analysisSchema = z.object({
			title: z.string().catch(''),
			observation: z.string().catch(''),
			feelings: z.array(z.string()).catch([]),
			needs: z.array(z.string()).catch([]),
			request: z.string().catch(''),
			sentimentPolarity: z.number().catch(0),
			intensityRatio: z.number().catch(0),
			emotionalBalance: z.number().catch(0),
			triggerCount: z.number().catch(0),
			resolutionCount: z.number().catch(0),
			escalationRate: z.number().catch(0),
			empathyRate: z.number().catch(0),
			messageLength: z.number().catch(0),
			readabilityScore: z.number().catch(0)
		});

		interface Analysis extends z.infer<typeof analysisSchema> {
			user?: string;
			chat?: string;
		}

		// Use safeParse to avoid throwing errors
		const parseResult = analysisSchema.safeParse(analysis);
		
		let validatedAnalysis: Analysis;
		if (parseResult.success) {
			validatedAnalysis = parseResult.data;
		} else {
			console.warn('Analysis validation failed, using fallback values:', parseResult.error);
			// Create a fallback analysis with default values
			validatedAnalysis = {
				title: typeof analysis.title === 'string' ? analysis.title : '',
				observation: typeof analysis.observation === 'string' ? analysis.observation : '',
				feelings: Array.isArray(analysis.feelings) ? analysis.feelings : [],
				needs: Array.isArray(analysis.needs) ? analysis.needs : [],
				request: typeof analysis.request === 'string' ? analysis.request : '',
				sentimentPolarity: typeof analysis.sentimentPolarity === 'number' ? analysis.sentimentPolarity : 0,
				intensityRatio: typeof analysis.intensityRatio === 'number' ? analysis.intensityRatio : 0,
				emotionalBalance: typeof analysis.emotionalBalance === 'number' ? analysis.emotionalBalance : 0,
				triggerCount: typeof analysis.triggerCount === 'number' ? analysis.triggerCount : 0,
				resolutionCount: typeof analysis.resolutionCount === 'number' ? analysis.resolutionCount : 0,
				escalationRate: typeof analysis.escalationRate === 'number' ? analysis.escalationRate : 0,
				empathyRate: typeof analysis.empathyRate === 'number' ? analysis.empathyRate : 0,
				messageLength: typeof analysis.messageLength === 'number' ? analysis.messageLength : 0,
				readabilityScore: typeof analysis.readabilityScore === 'number' ? analysis.readabilityScore : 0
			};
		}

		validatedAnalysis.user = user.id;
		validatedAnalysis.chat = chatId;

		const analysisRecord = await pb.collection('analyses').create(validatedAnalysis);
		const initiatedChat = await initChat(user, locale);

		const res = {initiatedChat: initiatedChat, analysis: analysisRecord};
		console.log('res from analyzeChat',res);

		return json(res);
	} catch (error) {
		console.error('Failed to initialize chat:', error);
		return json({ error: 'Failed to initialize chat' }, { status: 500 });
	}
};
