import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ai } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { step, situation, thoughts, needs } = body;

    console.log('NeedsDetective API request:', { step, situation: !!situation, thoughts: !!thoughts, needs: Array.isArray(needs) ? needs.length : needs });

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
      Deine Aufgabe ist es, die geschilderte Situation und die verwendete Bewältigungsstrategie neutral und verständnisvoll wiederzugeben, ohne Urteile zu fällen oder Ratschläge zu geben.
      Konzentriere dich darauf, sowohl die Situation als auch die Strategie objektiv zu spiegeln und zu validieren, was die Person erlebt und wie sie reagiert hat.
      Verwende eine warme, verständnisvolle Sprache und bleibe bei den Fakten der geschilderten Situation und Strategie.`;

      const thoughtsText = thoughts ? `\n\nStrategie: ${thoughts}` : '';
      prompt = `Situation: ${situation}${thoughtsText}

Bitte spiegele diese Situation und die verwendete Strategie neutral und verständnisvoll wider, ohne Bewertungen oder Ratschläge.`;

    } else if (step === 'summary') {
      if (!situation || !thoughts || needs === undefined || needs === null) {
        const errorDetails = { 
          situation: !!situation, 
          thoughts: !!thoughts, 
          needs: needs,
          situationType: typeof situation,
          thoughtsType: typeof thoughts,
          needsType: typeof needs
        };
        console.log('Validation failed:', errorDetails);
        return json({ error: 'Missing required fields for summary step', details: errorDetails }, { status: 400 });
      }

      systemPrompt = `Du bist ein Experte für gewaltfreie Kommunikation. Du existierst in einem Lernmodul "Bedürfnisse erkennen und verstehen". Du erstellst eine Zusammenfassung für einen Schritt einer Lern-Session die "Bedürfnisdetektiv" heißt. Es geht darum, dem Nutzer zu erklären, dass es sinnvoll ist, sich mit seinen Bedürfnissen auseinanderzusetzen. Er musste dafür eine Situation beschreiben, die Strategie beschreiben die er oder sie verwendet hat und danach sollte er sich mit seinen Bedürfnissen auseinandersetzen und aus einer Liste Bedürfnisse auswählen, die in dieser Situation relevant waren. Deine Aufgabe ist es, eine Zusammenfassung zu erstellen, die dem Nutzer hilft, den Sinn und Mehrwert der Auseinandersetzung mit seinen Bedürfnissen zu verstehen. Gehe vor allem auf den Unterschied zwischen Bedürfnis und Strategie ein. Du redest direkt mit dem Nutzer. Antworte nur mit unformattiertem Text. Ohne Begrüßung oder Abschluss. Du bist der letzte Schritt in einem mehrstufigen Prozess. Du kannst Gefühle erwähnen, aber fokussiere dich in der Antwort auf die Bedürfnisse. Bitte gib dem Nutzer keine Aufgaben, mit deiner Antwort ist das Lernmodul abgeschlossen.`;

      const needsText = typeof needs === 'string' && needs.trim()
        ? needs.trim()
        : Array.isArray(needs) && needs.length > 0 
          ? needs.join(', ') 
          : 'Keine spezifischen Bedürfnisse angegeben';

      prompt = `Situation: ${situation}

Gedanken und Urteile: ${thoughts}

Bedürfnisse: ${needsText}

Erstelle eine einfühlsame Zusammenfassung dieser Selbstreflexion, die der Person hilft, ihre unerfüllten Bedürfnisse mit Mitgefühl zu verstehen und den Wert dieser Erkenntnis zu schätzen.`;

    } else {
      return json({ error: 'Invalid step parameter' }, { status: 400 });
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 4000,
      }
    });
    
    const result = await chat.sendMessage({ message: prompt });
    const response = result.text;

    if (!response) {
      throw new Error('No response from AI');
    }

    return json({ response });
  } catch (error) {  
    console.error('Error in NeedsDetective endpoint:', error);
    return json({ error: 'Failed to process request' }, { status: 500 });
  }
};