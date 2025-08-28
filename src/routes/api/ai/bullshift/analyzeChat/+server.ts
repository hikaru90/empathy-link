import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initChat } from '$lib/server/gemini';
import type { Content } from '@google/genai';
import { analyzeChat, extractMemories } from '$lib/server/tools';
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
// Removed: saveChatInMemory - using database as single source of truth
const initChatInDb = async (user: any, chat: any, pb: any) => {
	let chatData: Partial<DbChatSession> = {
		user: user.id,
		module: 'bullshift',
		history: chat.history || [], // This will now include timestamps
	};

	const record = await pb.collection('chats').create(chatData);
	console.log('Created new chat record:', record);
	return record;
};
const getChatFromDb = async (chatId: string, pb: any) => {
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
// Removed: chatExistsInMemory - using database as single source of truth

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		console.log('analyzeChat server');
		const { locale, chatId } = await request.json();
		const user = locals.user;

		console.log('analyzeChat DEBUG:', {
			hasUser: !!user,
			userId: user?.id,
			chatId,
			locale,
			authStoreValid: locals.pb?.authStore?.isValid
		});

		const analysis = await analyzeChat(chatId, user.id, locale, locals.pb);
		console.log('analysis', analysis);

		// Always use German schema for session insight format
		const clarityValues = ['Unspezifisch', 'Vage', 'Spezifisch & Umsetzbar'] as const;
		const defaultClarity = clarityValues[0];
		
		const analysisSchema = z.object({
			emotionalShift: z.string().catch(''),
			iStatementMuscle: z.number().catch(0),
			clarityOfAsk: z.enum(clarityValues).catch(defaultClarity),
			empathyAttempt: z.boolean().catch(false),
			feelingVocabulary: z.number().catch(0),
			dailyWin: z.string().catch(''),
			title: z.string().catch(''),
			observation: z.string().catch(''),
			feelings: z.array(z.string()).catch([]),
			needs: z.array(z.string()).catch([]),
			request: z.string().catch('')
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
				emotionalShift: typeof analysis.emotionalShift === 'string' ? analysis.emotionalShift : '',
				iStatementMuscle: typeof analysis.iStatementMuscle === 'number' ? analysis.iStatementMuscle : 0,
				clarityOfAsk: clarityValues.includes(analysis.clarityOfAsk) ? analysis.clarityOfAsk : defaultClarity,
				empathyAttempt: typeof analysis.empathyAttempt === 'boolean' ? analysis.empathyAttempt : false,
				feelingVocabulary: typeof analysis.feelingVocabulary === 'number' ? analysis.feelingVocabulary : 0,
				dailyWin: typeof analysis.dailyWin === 'string' ? analysis.dailyWin : '',
				title: typeof analysis.title === 'string' ? analysis.title : '',
				observation: typeof analysis.observation === 'string' ? analysis.observation : '',
				feelings: Array.isArray(analysis.feelings) ? analysis.feelings : [],
				needs: Array.isArray(analysis.needs) ? analysis.needs : [],
				request: typeof analysis.request === 'string' ? analysis.request : ''
			};
		}

		validatedAnalysis.user = user.id;
		validatedAnalysis.chat = chatId;

		const analysisRecord = await locals.pb.collection('analyses').create(validatedAnalysis);
		const initiatedChat = await initChat(user, locale);

		console.log('🧠 Triggering memory extraction after chat analysis...');
		console.log('📋 Chat ID being analyzed:', chatId);
		try {
			await extractMemories(user.id, locale, chatId);
			console.log('✅ Memory extraction completed');
		} catch (error) {
			console.error('❌ Memory extraction failed:', error);
		}

		const res = {initiatedChat: initiatedChat, analysis: analysisRecord};
		console.log('res from analyzeChat',res);

		return json(res);
	} catch (error) {
		console.error('Failed to initialize chat:', error);
		return json({ error: 'Failed to initialize chat' }, { status: 500 });
	}
};
