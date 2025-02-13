import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ClientResponseError } from 'pocketbase';
import { genAI, selfempathyChats } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai';
import { pb } from '$scripts/pocketbase'

interface DbMessage {
  role: 'user' | 'assistant';
  content: string | { step: number; text: string };
  timestamp: number;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatRecord {
  id: string;
  user: string;
  module: string;
  history: Array<DbMessage>;
  preferences: Record<string, any>;
  created: string;
  updated: string;
}

const schema = {
  description: "Structured response of a step by step process",
  type: SchemaType.OBJECT,
  properties: {
    step: {
      type: SchemaType.INTEGER,
      description: "Current step in this process",
    },
    text: {
      type: SchemaType.STRING,
      description: "Content of the step",
    },
  },
  required: ["step", "text"],
};

const initModel = (history?: any[], systemInstruction?: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
  });
  const chat = model.startChat({
    history: history,
    generationConfig: {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  })
  return chat
}
const saveChatInMemory = (chatId: string, chat: any) => {
  selfempathyChats.set(chatId, chat);
}
const initChatInDb = async (user: any) => {
  // Create initial chat record
  const chatData: Partial<ChatRecord> = {
    user: user.id,
    module: 'selfempathy',
    history: [
      {
        role: 'user',
        content: `Hi, I'm ${user.firstName || user.id} and I'm here for NVC coaching.`,
        timestamp: Date.now()
      },
      {
        role: 'assistant',
        content: {
          step: 1,
          text: `Hello! I understand you're here for NVC coaching. I'll help you explore your feelings and needs using nonviolent communication principles. Feel free to share what's on your mind.`,
        } ,
        timestamp: Date.now()
      }
    ],
    preferences: {}
  };

  const record = await pb.collection('chats').create(chatData);
  console.log('Created new chat record:', record);
  return record
}
const getChatFromDb = async (chatId: string) => {
  console.log('getChatFromDb chatId',chatId);
  const record = await pb.collection('chats').getOne(chatId);
  return record
}

const formatHistoryForGemini = (history?: DbMessage[]): GeminiMessage[] => {
  if (!history) return [];
  
  return history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{
      text: msg.role === 'assistant'
        ? JSON.stringify(msg.content)
        : typeof msg.content === 'string'
          ? msg.content
          : msg.content.text
    }]
  }));
}

const chatExistsInMemory = (chatId: string) => {
  return selfempathyChats.has(chatId);
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { user, history, systemInstruction } = await request.json();

  console.log('RequestHandler initChatInMemory');
  if (!user?.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }



  console.log('initialize selfempathy userSession');
  try {
    let chatInDb;

    try {
      chatInDb = await pb.collection('chats').getFirstListItem(`user="${user.id}" && module="selfempathy"`);
    } catch (err) {
      if (!(err instanceof ClientResponseError && err.status === 404)) {
        throw err;
      }
    }

    //if chatExistsInMemory, return the chat
    //else get the chat from db
    //create chat

    if (!chatInDb) {

      const chat = initModel();
      const chatInDb = await initChatInDb(user);
      saveChatInMemory(chatInDb.id, chat);

      return json({ record: chatInDb });
    } else {
      // Chat already exists in db
      const chat = initModel(formatHistoryForGemini(chatInDb.history), systemInstruction);
      console.log('chat',JSON.stringify(chat._history));
      saveChatInMemory(chatInDb.id, chat);

      console.log('selfempathyChats',selfempathyChats);
      // const chatHistory = await chat.getHistory();


      return json({ record: chatInDb });
    }

  } catch (error) {
    console.error('Failed to initialize chat:', error);
    return json(
      { error: 'Failed to initialize chat' },
      { status: 500 }
    );
  }
};