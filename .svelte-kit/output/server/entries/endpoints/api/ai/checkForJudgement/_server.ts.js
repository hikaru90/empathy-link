import { P as PRIVATE_GEMINI_API_KEY } from "../../../../../chunks/private.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(PRIVATE_GEMINI_API_KEY);
const POST = async ({ request }) => {
  const { text, lang } = await request.json();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "you are an expert that is trained to identify if an observation contains a judgement based on nonviolent communication principles. You receive texts and answer if the observation contains a jugement or not. if it does, make a suggestion that doesn't. please make sure that the text really has to contain a judgment for you to point it out. If the prompt is in german, please answer in german."
  });
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
  const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain"
  };
  console.log("text", text);
  console.log("lang", lang);
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: []
    });
    const result = await chatSession.sendMessage(text);
    console.log("result", result);
    console.log("typeof result", typeof result);
    const response = result.response;
    const resText = response.text();
    console.log(text);
    return new Response(JSON.stringify({ result: resText }), {
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
