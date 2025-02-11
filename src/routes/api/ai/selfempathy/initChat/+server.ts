import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { genAI, chats } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const initModel = (systemInstruction: string) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
  });
}
  

export const POST: RequestHandler = async ({ request, locals }) => {
  const { user, history, systemInstruction } = await request.json();

  if (!user.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  console.log('initialize selfempathy userSession');
  if (!chats.has(user.id)) {
    console.log('Creating new session for user:', user.id);

    const model = initModel(systemInstruction);
    const chat =chats.set(user.id, model.startChat({
      history: history,
      generationConfig: {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    }));
    return json({chat: chat});
  } else {
    console.log('Chat already exists for user:', user.id);
  }
  console.log('chats',JSON.stringify(chats.get(user.id).params.history));
  return json(
    { status: 204 });
};