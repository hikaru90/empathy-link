import { pb } from '$scripts/pocketbase';

import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  emailVisibility: boolean;
  verified: boolean;
  created: string;
  updated: string;
  collectionId: '_pb_users_auth_';
  collectionName: 'users';
}

// Initialize Gemini once
const genAI = new GoogleGenerativeAI(PRIVATE_GEMINI_API_KEY);

// Create a single model instance with default configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are an expert in nonviolent communication and try to help the user as best as possible.
    Remember to:
    - Always maintain a supportive and empathetic tone
    - Help identify feelings and needs
    - Guide towards nonviolent communication practices
    - Keep previous context in mind when responding
  `,
  generationConfig: {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
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
});

// Store active user sessions
export const userSessions = new Map();

export function initializeUserSession(user: User) {
  console.log('initializeUserSession');
  if (!userSessions.has(user.id)) {
    console.log('Creating new session for user:', user.id);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are an expert in nonviolent communication and try to help the user as best as possible. You speak to them as if you were a helpful, approachable and empathetic friend.
        You are speaking with user ${user.firstName}.
        Remember to:
        - Always maintain a supportive and empathetic tone
        - Help identify feelings and needs
        - Guide towards nonviolent communication practices
        - Keep previous context in mind when responding
      `,
    });

    userSessions.set(user.id, model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Hi, I'm user ${user.firstName} and I'm here for NVC coaching.` }]
        },
        {
          role: "model",
          parts: [{ text: `Hello! I understand you're here for NVC coaching. I'll help you explore your feelings and needs using nonviolent communication principles. Feel free to share what's on your mind.` }]
        }
      ],
      generationConfig: {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
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
    }));
  } else {
    console.log('Session already exists for user:', user.id);
  }
  return userSessions.get(user.id);
}

export function getUserSession(userId: string) {
  return userSessions.get(userId);
}

// todo: change user memory to be a list of objects
export const saveUserMemory = async (userId: string, memoryData: any) => {
  try {
      const existingRecord = await pb.collection('user_memory').getFirstListItem(`userId="${userId}"`);
      if (existingRecord) {
          await pb.collection('user_memory').update(existingRecord.id, memoryData);
      } else {
          await pb.collection('user_memory').create({ userId, ...memoryData });
      }
  } catch (error) {
      console.error('Error saving memory:', error);
  }
}

// todo: change user memory to be a list of objects
export const loadUserMemory = async (userId: string) => {
  try {
      const record = await pb.collection('user_memory').getFirstListItem(`userId="${userId}"`);
      return record || null;
  } catch (error) {
      console.error('No memory found:', error);
      return null;
  }
}

export async function sendMessage(message: string, history: Array<{ role: string; content: string }>) {
  // Convert the history to Gemini's expected format
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}