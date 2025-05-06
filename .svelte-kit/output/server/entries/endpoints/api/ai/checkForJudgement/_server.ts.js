import { P as PRIVATE_GEMINI_API_KEY } from "../../../../../chunks/private.js";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });
const POST = async ({ request }) => {
  const { text, lang } = await request.json();
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ];
  console.log("text", text);
  console.log("lang", lang);
  try {
    const chatSession = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
        safetySettings
      },
      history: []
    });
    const result = await chatSession.sendMessage(text2);
    console.log("result", result);
    console.log("typeof result", typeof result);
    const text2 = result.text;
    console.log(text2);
    return new Response(JSON.stringify({ result: text2 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error checking for judgment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check for judgment.", result: lang === "en" ? "Your observation might contain a judgement. Please make sure to keep to the facts and be as neutral as possible." : "DeinBeobachtung enthält wahrscheinlich ein Urteil. Sei bitte so objektiv wie möglich bei der Beschreibung der Situation." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
export {
  POST
};
