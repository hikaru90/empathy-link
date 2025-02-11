import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { genAI, chats } from '$lib/server/gemini';

const sendMessage = async (message: string, history: Array<{ role: string; content: string }>, user: App.User) => {
  // Convert the history to Gemini's expected format
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Ensure the first message is from user if history exists
  if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
    formattedHistory.shift(); // Remove the first message if it's not from user
  }

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  console.log('userSessions',JSON.stringify(userSessions.get(user.id).params.history));
  return response.text();
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { message, history } = await request.json();
  const user = locals.user;
  console.log('user',user);

  if (!user.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  try {
    const response = await sendMessage(message, history, user);
    return json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
};