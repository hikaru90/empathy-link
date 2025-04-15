import { pb } from '$scripts/pocketbase';
import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import type { HistoryEntry } from '$routes/api/ai/selfempathy/initChat/+server';
import type { GenerativeModel, ChatSession } from '@google/generative-ai';


// Initialize Gemini once
export const genAI = new GoogleGenerativeAI(PRIVATE_GEMINI_API_KEY);

export const selfempathyChats = new Map<string, ChatSession>();
export const bullshiftChats = new Map<string, ChatSession>();

export const getIds = (map: Map<string, ChatSession>) => {
  return Array.from(map.keys());
};

console.log('bullshiftChats',getIds(bullshiftChats));

export const sendMessage = async (chatId: string, chat: ChatSession, message: string, history: HistoryEntry[]) => {
  try{

    console.log('message',message);
		// Send the message directly without modifying chat history
		const result = await chat.sendMessage(message);
		const response = await result.response;
		const responseText = response.text();
		const responseJson = JSON.parse(responseText);
    console.log('responseJson from sendMessage',responseJson);
    
		// Store in DB with full metadata (this format is only for our database)
		const updatedHistory = [
      ...history,
			{ 
        role: 'user', 
				parts: [{ text: message }],
				timestamp: Date.now() 
			},
			{
        role: 'model',
				parts: [{ text: responseJson.text }],
				step: responseJson.step,
				timestamp: Date.now()
			}
		];
    
		await pb.collection('chats').update(chatId, {
			history: updatedHistory,
			updated: new Date().toISOString()
		});
    
    return responseJson
  } catch (error) {
    console.error('error in sendMessage', error);
    return { error: 'Failed to send message' };
  }
}