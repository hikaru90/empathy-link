import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ClientResponseError } from 'pocketbase';
import { genAI, selfempathyChats } from '$lib/server/gemini';
import { HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai';

export interface ChatRecord {
  id: string;
  user: string;
  module: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: {
      step: number;
      text: string;
    }
    timestamp: number;
  }>;
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

const initModel = (systemInstruction: string) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
  });
}
const initChat = (history: any[], systemInstruction: string) => {
  const model = initModel(systemInstruction);
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
const chatExistsInMemory = (chatId: string) => {
  return selfempathyChats.has(chatId);
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { user, history, systemInstruction } = await request.json();
  const pb = locals.pb;

  console.log('RequestHandler initChat');
  if (!user?.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }



  console.log('initialize selfempathy userSession');
  try {
    let existingChat;

    try {
      existingChat = await pb.collection('chats').getFirstListItem(`user="${user.id}" && module="selfempathy"`);
    } catch (err) {
      if (!(err instanceof ClientResponseError && err.status === 404)) {
        throw err;
      }
    }

    //if chatExistsInMemory, return the chat
    //else get the chat from db
    //create chat

    if (!existingChat) {
      console.log('Creating new chat for user:', user.id);

      const chat = initChat(history, systemInstruction);

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

      selfempathyChats.set(record.id, chat);

      return json({ record: record });
    } else {
      // Chat already exists
      const chat = initChat(history, systemInstruction);

      const chatHistory = await chat.getHistory();
      console.log('chatHistory', chatHistory);

      console.log('Chat already exists for user:', user.id);
      //todo: change back to returning the chat with values of existingChat

      return json({ record: existingChat });
    }

  } catch (error) {
    console.error('Failed to initialize chat:', error);
    return json(
      { error: 'Failed to initialize chat' },
      { status: 500 }
    );
  }
};