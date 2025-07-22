import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ai } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { step, situation, thoughts, feelings } = body;

    console.log('FeelingsDetective API request:', { step, situation: !!situation, thoughts: !!thoughts, feelings: Array.isArray(feelings) ? feelings.length : feelings });

    if (!step) {
      return json({ error: 'Missing step parameter' }, { status: 400 });
    }

    let systemPrompt = '';
    let prompt = '';

    if (step === 'reflection') {
      if (!situation) {
        return json({ error: 'Missing situation for reflection step' }, { status: 400 });
      }

      systemPrompt = `Du bist ein einfühlsamer Begleiter, der Menschen hilft, ihre Situationen ohne Bewertung zu reflektieren. 
      Deine Aufgabe ist es, die geschilderte Situation neutral und verständnisvoll wiederzugeben, ohne Urteile zu fällen oder Ratschläge zu geben.
      Konzentriere dich darauf, die Situation objektiv zu spiegeln und zu validieren, was die Person erlebt hat.
      Verwende eine warme, verständnisvolle Sprache und bleibe bei den Fakten der geschilderten Situation.`;

      prompt = `Situation: ${situation}

Bitte spiegele diese Situation neutral und verständnisvoll wider, ohne Bewertungen oder Ratschläge.`;

    } else if (step === 'summary') {
      if (!situation || !thoughts || feelings === undefined || feelings === null) {
        const errorDetails = { 
          situation: !!situation, 
          thoughts: !!thoughts, 
          feelings: feelings,
          situationType: typeof situation,
          thoughtsType: typeof thoughts,
          feelingsType: typeof feelings
        };
        console.log('Validation failed:', errorDetails);
        return json({ error: 'Missing required fields for summary step', details: errorDetails }, { status: 400 });
      }

      systemPrompt = `Du bist ein einfühlsamer Coach, der Menschen dabei hilft, ihre emotionalen Erkenntnisse zu verstehen.
      Erstelle eine mitfühlende Zusammenfassung der Person's Selbstreflexion, die ihre Situation, Gedanken und Gefühle würdigt.
      Biete sanfte Erkenntnisse und ermutigende Worte, ohne zu urteilen oder zu bewerten.
      Fokussiere dich auf Selbstmitgefühl und das Verstehen der eigenen emotionalen Reaktionen.`;

      const feelingsText = Array.isArray(feelings) && feelings.length > 0 
        ? feelings.join(', ') 
        : Array.isArray(feelings) && feelings.length === 0
          ? 'Keine spezifischen Gefühle ausgewählt'
          : String(feelings || 'Nicht angegeben');

      prompt = `Situation: ${situation}

Gedanken und Urteile: ${thoughts}

Gefühle: ${feelingsText}

Erstelle eine einfühlsame Zusammenfassung dieser Selbstreflexion, die der Person hilft, ihre Erfahrung mit Mitgefühl zu verstehen.`;

    } else {
      return json({ error: 'Invalid step parameter' }, { status: 400 });
    }

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });
    
    const result = await chat.sendMessage({ message: prompt });
    const response = result.text;

    if (!response) {
      throw new Error('No response from AI');
    }

    return json({ response });
  } catch (error) {
    console.error('Error in FeelingsDetective endpoint:', error);
    return json({ error: 'Failed to process request' }, { status: 500 });
  }
};