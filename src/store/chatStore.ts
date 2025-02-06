import { browser } from '$app/environment';
import { PUBLIC_MESSAGE_LIMIT } from '$env/static/public';
import { writable, get, type Writable } from 'svelte/store';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

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

function createMessagesStore() {
  const { subscribe, set, update } = writable<ChatMessage[]>(loadMessages());

  return {
    subscribe,
    set,
    addMessage: (role: 'user' | 'assistant', content: string) => {
      update(msgs => {
        const newMessage: ChatMessage = {
          role,
          content,
          timestamp: Date.now()
        };
        const updatedMsgs = [...msgs, newMessage];
        return updatedMsgs.slice(-MESSAGE_LIMIT);
      });
    },
    clear: () => set([])
  };
}

export const messages = createMessagesStore();
export const userMemory = writable({});
export const userId = writable(loadUserId());

// Save messages to localStorage whenever they change
messages.subscribe(msgs => {
  if (browser && msgs) {
    localStorage.setItem('chat_messages', JSON.stringify(msgs));
    console.log('messages saved to localStorage', msgs);
  }
});

// Save userId to localStorage whenever it changes
userId.subscribe(id => {
  if (browser && id) {
    localStorage.setItem('chat_user_id', id);
    console.log('userId saved to localStorage', id);
  }
});

export const saveMessagesToLocalStorage = (msgs: ChatMessage[]) => {
  if (browser && msgs) {
      // Only store the last PUBLIC_MESSAGE_LIMIT messages
      const limitedMsgs = msgs.slice(-PUBLIC_MESSAGE_LIMIT);
      localStorage.setItem('chat_messages', JSON.stringify(limitedMsgs));
      console.log('messages saved to localStorage', limitedMsgs);
  }
};

export const addMessage = (messages: Writable<ChatMessage[]>, role: 'user' | 'assistant', content: string) => {
  const newMessage: ChatMessage = {
      role,
      content,
      timestamp: Date.now()
  };
  
  messages.update(msgs => {
      const updatedMsgs = [...msgs, newMessage];
      return updatedMsgs.slice(-PUBLIC_MESSAGE_LIMIT);
  });
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const clearChatHistory = (messages: Writable<ChatMessage[]>, userId: Writable<string | null>) => {
  if (browser) {
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('chat_user_id');
      messages.set([]);
      userId.set(null);
  }
};

export const saveUserIdToLocalStorage = (userId: string | null) => {
  if (browser && userId) {
      localStorage.setItem('chat_user_id', userId);
      console.log('userId saved to localStorage', userId);
  }
};