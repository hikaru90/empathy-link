import { browser } from '$app/environment';
import { PUBLIC_MESSAGE_LIMIT } from '$env/static/public';
import { writable, get, type Writable } from 'svelte/store';
import { user } from '$store/auth';

const systemInstruction = `You are an expert in nonviolent communication and try to help the user as best as possible. You speak to them as if you were a helpful, approachable and empathetic friend. You are speaking with user ${get(user)?.firstName}.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  parts: { text: string }[];
  timestamp: number;
}

interface AIInstance {
  id?: string;  // PocketBase record ID
  history: ChatMessage[];
  preferences: Record<string, any>;
}

interface AIInstances {
  modules: {
    selfempathy: AIInstance;
    fight: AIInstance;
  };
}

const loadInstances = (): AIInstances => {
  if (browser) {
    const stored = localStorage.getItem('aiInstances');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return {
    modules: {
      selfempathy: {
        history: [],
        preferences: {}
      },
      fight: {
        history: [],
        preferences: {}
      }
    }
  };
};

function createAIInstancesStore() {
  const { subscribe, set, update } = writable<AIInstances>({
    modules: {
      selfempathy: {
        history: [],
        preferences: {}
      },
      fight: {
        history: [],
        preferences: {}
      }
    }
  });

  return {
    subscribe,
    set,
    setChat: (module: 'selfempathy' | 'fight', chatRecord: any) => {
      update(instances => ({
        ...instances,
        modules: {
          ...instances.modules,
          [module]: {
            id: chatRecord.id,
            history: chatRecord.history,
            preferences: chatRecord.preferences
          }
        }
      }));
    },
    addMessage: (module: 'selfempathy' | 'fight', role: 'user' | 'assistant', content: string) => {
      update(instances => {
        const newMessage: ChatMessage = {
          role,
          parts: [{ text: content }],
          timestamp: Date.now()
        };
        
        const updatedHistory = [...instances.modules[module].history, newMessage];
        
        return {
          ...instances,
          modules: {
            ...instances.modules,
            [module]: {
              ...instances.modules[module],
              history: updatedHistory.slice(-PUBLIC_MESSAGE_LIMIT)
            }
          }
        };
      });
    },
    clearHistory: (module: 'selfempathy' | 'fight') => {
      update(instances => ({
        ...instances,
        modules: {
          ...instances.modules,
          [module]: {
            ...instances.modules[module],
            history: []
          }
        }
      }));
    }
  };
}

export const aiInstances = createAIInstancesStore();
export const userMemory = writable({});

export const initChat = async () => {
  try{
    const response = await fetch('/api/ai/selfempathy/initChat', {
      method: 'POST',
      body: JSON.stringify({ user: get(user), systemInstruction, history: [] })
    });
    const chatRecord = await response.json();
    console.log('chatRecord',chatRecord);
    return chatRecord.record;  // Return the chatId from the response
  }catch(error){
    console.error('Failed to initialize chat:', error);
    return null;
  }
}
