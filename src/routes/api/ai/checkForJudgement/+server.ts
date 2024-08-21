import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(PRIVATE_GEMINI_API_KEY);

export const POST = async ({ request }) => {
  const { text, lang } = await request.json();

  console.log('text', text);
  console.log('lang', lang);

  const dePromt = `Enthält der folgende Text basierend auf der gewaltfreien Kommunikation nach Marshall Rosenberg ein Urteil? Wenn ja, antworte "Deine Beobachtung enthält ein Urteil." und benenne das Urteil so knapp wie möglich.\n\nText: "${text}"`
  const enPromt = `Does the following text contain any judgments according to Nonviolent Communication (NVC) principles? Please answer "Your observation contains a judgement." and point out the judgement as short as possible.\n\nText: "${text}"`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(lang === 'en' ? enPromt : dePromt);
    console.log('result',result);
    console.log('typeof result',typeof result);
    const response = result.response;
    const text = response.text();
    console.log(text);

    return new Response(JSON.stringify({result: text}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error checking for judgment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check for judgment.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};