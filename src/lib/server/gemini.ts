import { pb } from '$scripts/pocketbase';
import {
	GoogleGenAI,
	Type,
} from '@google/genai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import type { Chat, CreateChatParameters } from '@google/genai';

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
		const response = await result.response;
		const responseText = response.text();
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

const saveObservationFunctionDeclaration = {
	name: 'save_message',
	description: 'Save the every message to the database.',
	parameters: {
		type: Type.OBJECT,
		properties: {
			message: {
				type: Type.STRING,
				description: 'The message to save.'
			}
		},
		required: ['message']
	}
};

export const getSystemInstruction = (user: object, locale: string) => {
// 	return `You are a compassionate communication assistant, trained in Nonviolent Communication (NVC). You speak German and never switch language unless the user explicitly asks. With each user turn, follow this exact 4-part structure and keep it very concise (max. 2 newlines between paragraphs, max. 1 blank line):

// 1. **Observation**  
//    A brief, neutral description of what happened.  
// 2. **Feeling**  
//    Reflect how the user is likely feeling.  
// 3. **Need**  
//    Identify the underlying need behind that feeling.  
// 4. **Request**  
//    Offer exactly one simple, concrete action step or ask a clarifying question.

// Always lead with empathy and reflect the users message, then the single action step. Avoid therapy jargon and multi‑step lists. If your reply isn’t sufficient, ask for a brief clarification. Be honest, clear, and practical.
// `
	return `You are speaking with user ${user.firstName}, You are a compassionate communication assistant in a companion app trained in Nonviolent Communication (NVC). The user will describe a real-life situation, message, or conflict they want help with. It is your role to help them as best as you can. Assume that the user is not trained in NVC, so please explain NVC specific terms and concepts.

			- Respond in the language with the locale ${locale}. Only switch if the user asks for it. Make sure to correctly translate nvc terms and concepts to the specified locale.
			- You don't have to tell the user that you are using NVC.
			- Always start by giving the user empathy and making the user feel understood and heard.
			- If your answer is not helpful, try to ask the user to clarify their question.
			- Never give the user multiple steps to follow as one answer. Instead, give them one step at a time and guide them through the process.
			- Aim for clarity, honesty, and empathy.
			- Avoid therapy jargon or excessive fluff.
			- Be concise, warm, and practical.
			- Maximum 2 newlines between paragraphs
			- Never use more than 1 blank line
			- Trim trailing whitespace
			`;
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
