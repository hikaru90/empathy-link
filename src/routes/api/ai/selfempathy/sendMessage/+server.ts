import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { pb } from '$scripts/pocketbase'
import { genAI, selfempathyChats } from '$lib/server/gemini';


export const POST: RequestHandler = async ({ request, locals }) => {
  const { message, history, chatId } = await request.json();
  const user = locals.user;

  if (!user?.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Convert the history to Gemini's expected format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    console.log('selfempathyChats',selfempathyChats);

    const chat = selfempathyChats.get(chatId);
    console.log('chat',chat);

    const result = await chat.sendMessage(message);
    const response = await result.response;
    console.log('response',response);
    const responseText = response.text();
    const responseJson = JSON.parse(responseText);
    console.log('responseJson',responseJson);

    // Update chat history in PocketBase
    const updatedHistory = [...history, 
      { role: 'user', content: message, timestamp: Date.now() },
      { role: 'assistant', content: responseJson, timestamp: Date.now() }
    ];

    await pb.collection('chats').update(chatId, {
      history: updatedHistory,
      updated: new Date().toISOString()
    });

    return json({ response: responseJson });
  } catch (error) {
    console.error('Chat error:', error);
    return json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
};