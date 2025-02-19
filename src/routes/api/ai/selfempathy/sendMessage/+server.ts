import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { pb } from '$scripts/pocketbase';
import { genAI, selfempathyChats } from '$lib/server/gemini';

const removeTimestamp = (chat: any) => {
  let editedChat = chat
  const newHistory = chat.params.history.map((msg: any) => {
    delete msg.timestamp
    return msg
  })
  editedChat.params.history = newHistory
  editedChat._history = newHistory

  return editedChat
}
export const POST: RequestHandler = async ({ request, locals }) => {
	const { message, history, chatId } = await request.json();
	const user = locals.user;

	if (!user?.id) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	try {
		// Convert the history to Gemini's expected format by removing ALL extra fields
		const formattedHistory = history.map((msg) => ({
			role: msg.role === 'model' ? 'model' : 'user',
			parts: msg.parts
		}));

		let chat = await selfempathyChats.get(chatId);
    chat = removeTimestamp(chat)
		if (!chat) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		// Send the message directly without modifying chat history
		const result = await chat.sendMessage(message);
		const response = await result.response;
		const responseText = response.text();
		const responseJson = JSON.parse(responseText);

		// Store in DB with full metadata (this format is only for our database)
		const updatedHistory = [
			...history,
			{ 
				role: 'user', 
				parts: [{ text: message }],
				timestamp: Date.now() 
			},
			{
				role: 'model',
				parts: [{ text: responseJson.text }],
				step: responseJson.step,
				timestamp: Date.now()
			}
		];

		await pb.collection('chats').update(chatId, {
			history: updatedHistory,
			updated: new Date().toISOString()
		});

		return json({ response: responseJson });
	} catch (error) {
		console.error('Chat error:', error);
		return json({ error: 'Failed to process message' }, { status: 500 });
	}
};
