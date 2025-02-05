import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MESSAGE_LIMIT = 20;

// Load initial messages from localStorage if they exist
const loadMessages = (): ChatMessage[] => {
  if (browser) {
    const stored = localStorage.getItem('chat_messages');
    if (stored) {
      const messages = JSON.parse(stored);
      // Return only the last MESSAGE_LIMIT messages
      return messages.slice(-MESSAGE_LIMIT);
    }
  }
  return [];
};

const loadUserId = () => {
  if (browser) {
    return localStorage.getItem('chat_user_id');
  }
  return null;
};

export const messages = writable<ChatMessage[]>(loadMessages());
export const userMemory = writable({});
export const userId = writable(loadUserId());

// Save messages to localStorage whenever they change
messages.subscribe(msgs => {
  if (browser && msgs) {
    // Only store the last MESSAGE_LIMIT messages
    const limitedMsgs = msgs.slice(-MESSAGE_LIMIT);
    localStorage.setItem('chat_messages', JSON.stringify(limitedMsgs));
    console.log('messages saved to localStorage', limitedMsgs);
  }
});

// Save userId to localStorage whenever it changes
userId.subscribe(id => {
  if (browser && id) {
    localStorage.setItem('chat_user_id', id);
    console.log('userId saved to localStorage', id);
  }
});

// Initialize user session with initial messages
export function initializeUserSession(user: any) {
  const currentUserId = get(userId);
  const currentMessages = get(messages);
  
  if (!currentUserId || currentUserId !== user.id || currentMessages.length === 0) {
    const initialMessages: ChatMessage[] = [
      {
        role: 'user',
        content: `Hi, I'm ${user.firstName || user.id} and I'm here for NVC coaching.`,
        timestamp: Date.now()
      },
      {
        role: 'assistant',
        content: `Hello! I understand you're here for NVC coaching. I'll help you explore your feelings and needs using nonviolent communication principles. Feel free to share what's on your mind.`,
        timestamp: Date.now()
      }
    ];
    
    messages.set(initialMessages);
    userId.set(user.id);
  }
}

// Add a new message to the chat
export function addMessage(role: 'user' | 'assistant', content: string) {
  const newMessage: ChatMessage = {
    role,
    content,
    timestamp: Date.now()
  };
  
  messages.update(msgs => {
    const updatedMsgs = [...msgs, newMessage];
    // Keep only the last MESSAGE_LIMIT messages
    return updatedMsgs.slice(-MESSAGE_LIMIT);
  });
}

// Format timestamp for display
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Clear chat history
export function clearChatHistory() {
  if (browser) {
    localStorage.removeItem('chat_messages');
    localStorage.removeItem('chat_user_id');
    messages.set([]);
    userId.set(null);
  }
}

messages.subscribe(msgs => {
  console.log('messages', msgs);
});
