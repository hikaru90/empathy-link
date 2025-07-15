import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ai } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { question, userAnswer, systemPrompt } = await request.json();

    if (!question || !userAnswer || !systemPrompt) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('systemPrompt', systemPrompt);

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const prompt = `Question: ${question}\n\nUser's Answer: ${userAnswer}`;
    
    const result = await chat.sendMessage({ message: prompt });
    const response = result.text;

    if (!response) {
      throw new Error('No response from AI');
    }

    return json({ response });
  } catch (error) {
    console.error('Error in AI question endpoint:', error);
    return json({ error: 'Failed to process question' }, { status: 500 });
  }
}; 