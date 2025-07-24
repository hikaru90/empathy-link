import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ai } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { sentence, instruction } = await request.json();

    if (!sentence) {
      return json({ error: 'Missing sentence' }, { status: 400 });
    }

    // Get all needs from PocketBase for reference
    const needsRecords = await pb.collection('needs').getFullList({
      sort: 'category,sort'
    });

    const needsList = needsRecords.map(need => need.nameDE).join(', ');

    const systemPrompt = `Du bist ein Experte für Gewaltfreie Kommunikation und hilfst dabei, die zugrundeliegenden Bedürfnisse in schwierigen Aussagen zu identifizieren.

Deine Aufgabe:
1. Analysiere den gegebenen Satz und erkenne die dahinterliegenden emotionalen Bedürfnisse
2. Transformiere diese in 3-5 konkrete Bedürfnisse aus der folgenden Liste
3. Wähle nur Bedürfnisse aus, die wirklich zu dem Satz passen
4. Antworte NUR mit den Bedürfnisnamen, getrennt durch Kommas

Verfügbare Bedürfnisse: ${needsList}

Beispiel:
Satz: "Du hörst mir nie zu!"
Antwort: Aufmerksamkeit, Verständnis, Respekt

Antworte IMMER auf Deutsch und verwende nur Bedürfnisse aus der bereitgestellten Liste.`;

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        maxOutputTokens: 512,
      }
    });

    const prompt = `${instruction || 'Identifiziere die Bedürfnisse in diesem Satz'}: "${sentence}"`;
    
    const result = await chat.sendMessage({ message: prompt });
    const response = result.text;

    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the response to extract needs
    const needs = response
      .split(',')
      .map(need => need.trim())
      .filter(need => need.length > 0)
      .slice(0, 5); // Limit to 5 needs max

    return json({ needs });
  } catch (error) {
    console.error('Error in needs rubiks cube endpoint:', error);
    return json({ error: 'Failed to transform sentence into needs' }, { status: 500 });
  }
};