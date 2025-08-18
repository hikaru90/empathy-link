import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ai } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { saveTrace } from '$lib/server/tools';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, locale = 'en', lastMessages } = await request.json();

		if (!chatId || !lastMessages || !Array.isArray(lastMessages)) {
			return json({ error: 'Missing required fields: chatId and lastMessages array' }, { status: 400 });
		}

		const prompt = `Basierend auf der letzten KI-Nachricht und dem Gesprächskontext, schlage EINE bedeutungsvolle Nutzerantwort vor.

- Deine Antwort sollte eine einzelne, authentische Nutzernachricht sein (maximal 10 Wörter), die der Nutzer als seine Antwort senden könnte. 
- Sie sollte natürlich und persönlich klingen, wie etwas, das eine echte Person sagen würde. 
- Gib nur eine Antwort zurück wenn es für den Nutzer schwierig sein könnte, eine Antwort zu finden. Also alles was eine tiefere Reflexion erfordert. Also emotionales erfassen und damit umgehen etc.
- Wenn du denkst, es wäre laut den eben genannten kriterien sinnvoll, gib nur die vorgeschlagene Nutzerantwort zurück, sonst einen leeren string.
- Gib so wenig Wörter wie möglich zurück.
- Gibt die Antwort in Textform ohne Anführungszeichen zurück.

Der Gesprächskontext: ${lastMessages.slice(0, -1).join('\n')}
Die letzte KI-Nachricht: ${lastMessages.slice(-1)}`

		const model = ai.chats.create({
			model: 'gemini-2.0-flash',
			config: {
				temperature: 0.7,
				systemInstruction: prompt
			}
		});

		const response = await model.sendMessage({
			message: 'The user needs to respond directly to the AI\'s last message. Suggest an authentic, helpful user response that directly answers or engages with what the AI just asked or said, while demonstrating good NVC practice. The response should be relevant and appropriate to the specific question or statement from the AI.'
		});

		const suggestion = response.text?.trim() || 'Ich bin unsicher was ich schreiben soll, kannst du mir einen Vorschlag geben?';

		saveTrace(
			'chatSuggestion',
			JSON.stringify({ chatId, lastMessagesCount: lastMessages.length }),
			'bullshift',
			chatId,
			user.id,
			suggestion,
			response,
			prompt,
		);

		return json({
			suggestion,
			timestamp: Date.now()
		});

	} catch (error) {
		console.error('Error generating chat suggestion:', error);
		return json({
			error: 'Failed to generate suggestion',
			suggestion: 'What feelings are coming up for you right now?' // Fallback suggestion
		}, { status: 500 });
	}
};