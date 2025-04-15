import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { pb } from '$scripts/pocketbase';
import { genAI, selfempathyChats } from '$lib/server/gemini';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import { sendMessage } from '$lib/server/gemini';

const removeTimestamp = (chat: any) => {
  let editedChat = chat
	console.log('editedChat',editedChat);
  const newHistory = chat.params.history.map((msg: any) => {
    delete msg.timestamp
    return msg
  })
  editedChat.params.history = newHistory

  return editedChat
}
export const POST: RequestHandler = async ({ request, locals }) => {
	const { message, history, chatId } = await request.json();
	const user = locals.user;

	if (!user?.id) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	try {
		let chat = selfempathyChats.get(chatId);
    chat = removeTimestamp(chat)
		if (!chat) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}

    const responseJson = await sendMessage(chatId,chat, message, history)

		return json({ response: responseJson });
	} catch (error) {
		console.error('Chat error:', error);
		return json({ message: 'Failed to process message', error }, { status: 500 });
	}
};
