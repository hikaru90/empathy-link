import { pb } from '$scripts/pocketbase';
import { HarmBlockThreshold, HarmCategory, GoogleGenAI, Type } from '@google/genai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import type { ChatSession } from '@google/genai';
import { shouldAnalyzeFeelings } from './tools';

// Initialize Gemini once
export const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });

export const selfempathyChats = new Map<string, ChatSession>();
export const bullshiftChats = new Map<string, ChatSession>();

export const getIds = (map: Map<string, ChatSession>) => {
	return Array.from(map.keys());
};

console.log('bullshiftChats', getIds(bullshiftChats));

export const sendMessage = async (chatId: string, chat: ChatSession, message: string, history: HistoryEntry[]) => {
	try {
		console.log('message', message);
		// Send the message directly without modifying chat history
		const result = await chat.sendMessage(message);
		const response = await result.response;
		const responseText = response.text();
		const responseJson = JSON.parse(responseText);
		console.log('responseJson from sendMessage', responseJson);

		// Store in DB with full metadata (this format is only for our database)
		await pb.collection('chats').update(chatId, {
			history: await chat.getHistory(),
			updated: new Date().toISOString()
		});

		return responseJson
	} catch (error) {
		console.error('error in sendMessage', error);
		return { error: 'Failed to send message' };
	}
}

export const getModel = async (user: object, locale: string) => {
	const feelings = await pb.collection('feelings').getFullList({
		sort: 'category,sort'
	});
	const needs = await pb.collection('needs').getFullList({
		sort: 'category,sort'
	});

	return {
		model: "gemini-1.5-flash",
		temperature: 0.3,
		config: {
			systemInstruction: `You are speaking with user ${user.firstName}, You are a compassionate communication assistant trained in Nonviolent Communication (NVC). The user will describe a real-life situation, message, or conflict they want help with.

			Your task is to:
			1. Identify any judgments, assumptions, or blame in the input.
			2. Translate the core message into NVC language using the four steps:
				- Observation (what happened, without judgment),
				- Feeling (how the person feels),
				- Need (the unmet need behind the feeling),
				- Request (a clear, doable request).
			3. Explain your reasoning in simple terms (if helpful for the user).
			4. Optionally, suggest an empathic or connection-building response the user could send, if the situation involves another person.

			You have access to the following tools:
			- get_feelings: Search the feelings database for matching entries

			If a user asks for the available feelings, use the search_feelings tool to get the data instead of coming up with your own. When using the tool, apply the following rules:
			1. NEVER mention feelings not in the database
			2. When asked about feelings:
					a. First use the search_feelings tool
					b. Base your response ONLY on the returned data
			

			When the user provides information, identify and extract:
			1. Observations (what happened, without judgment)
			2. Feelings (how the person feels)
			3. Needs (the unmet need behind the feeling)
			4. Requests (a clear, doable request)
			Format your response to include these elements in a structured way that can be easily parsed without including it in your text response.

			- Respond in the language with the locale ${locale}. Only switch if the user asks for it.
			- Always start by making the user feel understood and heard.
			- Aim for clarity, honesty, and empathy.
			- Avoid therapy jargon or excessive fluff.
			- Be concise, warm, and practical.
			- You always respond in your specified JSON schema. Also, you only answer in the response field. The other ones are not visible to the user.
			- Don't combine multiple steps in one answer. Instead, guide the user through the steps one by one.
			- Maximum 2 newlines between paragraphs
			- Never use more than 1 blank line
			- Trim trailing whitespace
			`,
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					insight: {
						type: Type.OBJECT,
						properties: {
							observation: {
								type: Type.STRING,
								description: 'This is an internal Field. The observation the user made used for saving to a db',
							},
							feelings: {
								type: Type.ARRAY,
								items: {
									type: Type.STRING,
								},
								description: 'This is an internal Field. The feelings the user is experiencing used for saving to a db',
							},
							needs: {
								type: Type.ARRAY,
								items: {
									type: Type.STRING,
								},
								description: 'This is an internal Field. The needs the user is experiencing used for saving to a db',
							},
							request: {
								type: Type.STRING,
								description: 'This is an internal Field. The request the user is making used for saving to a db',
							}
						}
					},
					response: {
						type: Type.STRING,
						description: 'The response text to show to the user'
					}
				},
				required: ['response']
			},
		},
	}
}

export const initChat = async (user: object, locale: string) => {
	const dbChat = await pb.collection('chats').create({
		history: [],
		user: pb.authStore.model?.id,
		module: 'bullshift',
	});

	// Initialize the chat in memory with the correct model
	const model = await getModel(user, locale);
	const chat = ai.chats.create(model);
	bullshiftChats.set(dbChat.id, chat);

	return {
		chatId: dbChat.id,
		chat: chat
	};
}