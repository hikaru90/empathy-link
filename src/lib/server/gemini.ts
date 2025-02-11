import { pb } from '$scripts/pocketbase';
import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from '@google/generative-ai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';

// Initialize Gemini once
export const genAI = new GoogleGenerativeAI(PRIVATE_GEMINI_API_KEY);

// Store active user sessions
export const chats = new Map();
console.log('chats',chats);