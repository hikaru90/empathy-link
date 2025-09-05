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

		const prompt = `Du hilfst Nutzern bei schwierigen emotionalen Fragen mit Beispielantworten.

AUFGABE: Analysiere die KI-Nachricht. Falls sie eine schwierige emotionale Frage stellt, gib eine authentische Nutzerantwort zurück. Falls nicht, gib einen leeren String zurück.

SCHWIERIGE EMOTIONALE FRAGEN sind:
- Fragen nach Gefühlen ("Wie fühlst du dich dabei?", "Was löst das in dir aus?")
- Fragen nach Bedürfnissen ("Was brauchst du?", "Was ist dir wichtig?") 
- Fragen nach schwierigen Erfahrungen oder Emotionen
- Fragen, die Selbstreflexion erfordern
- Fragen nach Werten oder persönlicher Bedeutung

KEINE schwierigen Fragen sind:
- Begrüßungen, Small Talk
- Informationsfragen, Faktenfragen
- Organisatorische Fragen

WENN es eine schwierige emotionale Frage ist:
- Gib eine kurze, authentische Nutzerantwort (maximal 15 Wörter)
- Verwende "Ich"-Aussagen
- Verwende NUR echte GFK-Gefühle (z.B. traurig, ängstlich, freudig, wütend, hoffnungsvoll)
- Verwende NUR echte GFK-Bedürfnisse (z.B. Sicherheit, Verbindung, Autonomie, Verständnis, Klarheit)
- NICHT: "Ich fühle mich verraten/ignoriert/abgelehnt" (das sind Interpretationen)
- SONDERN: "Ich fühle mich traurig" oder "Ich bin wütend"
- Verbinde Gefühle mit Bedürfnissen: "Ich fühle mich [Gefühl], weil mir [Bedürfnis] wichtig ist"

BEISPIELE für gute GFK-konforme Antworten:
- "Ich bin traurig, weil mir Verbindung wichtig ist"
- "Ich fühle mich ängstlich und brauche Sicherheit"
- "Ich bin wütend, weil mir Respekt wichtig ist"
- "Ich fühle mich unsicher und brauche Klarheit"
- "Ich bin hoffnungsvoll und wünsche mir Verständnis"

WENN es KEINE schwierige emotionale Frage ist:
- Gib nur zurück: ""

KI-Nachricht: "${lastMessages.slice(-1)[0]}"`

		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.3, // Lower temperature for more consistent decision-making
				systemInstruction: prompt
			}
		});

		const response = await model.sendMessage({
			message: 'Führe die Aufgabe aus: Gib entweder eine authentische Nutzerantwort oder "" zurück.'
		});

		const suggestion = response.text?.trim() || '';

		// If suggestion is empty, don't provide any suggestion (not a tough question)
		if (!suggestion || suggestion === '""' || suggestion === "''" || suggestion.length === 0) {
			return json({
				suggestion: null,
				reason: 'not_tough_question',
				timestamp: Date.now()
			});
		}

		// Save trace for monitoring with request key to avoid auto-cancellation
		const requestKey = `chatSuggestion_${chatId}_${Date.now()}`;
		saveTrace(
			'chatSuggestion',
			JSON.stringify({ chatId, lastMessagesCount: lastMessages.length }),
			'bullshift',
			chatId,
			user.id,
			suggestion,
			response,
			prompt
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