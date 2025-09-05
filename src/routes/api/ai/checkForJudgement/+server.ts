import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { HarmBlockThreshold, HarmCategory, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY});

export const POST = async ({ request }) => {
  const { text, lang } = await request.json();

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  console.log('text', text);
  console.log('lang', lang);


  try {
    const chatSession = ai.chats.create({
      		model: "gemini-2.5-flash",
      config: {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
        safetySettings,
      },
      history: [
      ],
    });

    const result = await chatSession.sendMessage(text);

    // const result = await model.generateContent(lang === 'en' ? enPromt : dePromt);
    console.log('result', result);
    console.log('typeof result', typeof result);
    const text = result.text;
    console.log(text);

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error checking for judgment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check for judgment.', result: lang === 'en' ? 'Your observation might contain a judgement. Please make sure to keep to the facts and be as neutral as possible.' : 'DeinBeobachtung enthält wahrscheinlich ein Urteil. Sei bitte so objektiv wie möglich bei der Beschreibung der Situation.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};