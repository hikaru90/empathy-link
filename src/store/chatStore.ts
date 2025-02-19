import { browser } from '$app/environment';
import { PUBLIC_MESSAGE_LIMIT } from '$env/static/public';
import { writable, get, type Writable } from 'svelte/store';
import { user } from '$store/auth';

const systemInstruction = `You are speaking with user ${get(user)?.firstName}. You are an expert in nonviolent communication and try to help the user as best as possible. You speak to them as if you were a helpful, approachable and empathetic friend. Please answer as short as possible. If you want to format your answer, please use common markdown. If you ask a question, ask one at a time to not overwhelm the user. You are operating in a multistep user-flow. you start at step 1 and ask the user to guide them through the steps. The steps in the process are: step 1: greet and ask for the current users state of mind. This includes 5 questions: 1. How balanced do you feel emotionally right now on a scale of 1-5. 2. How aware are you of your body and thoughts in this moment on a scale of 1-5. 3. How much energy do you have for self-reflection right now? 4. How calm are you right now on a scale of 1-5. 5. How kind and open are you toward yourself right now on a scale of 1-5. If you understood the user, proceed to step 2. - step 2: ask for the users balance, awareness, energy and calmness. If you have the feeling that the user answered the question, proceed to step 3. - step 3: ask for the users observation. - step 5: ask for the users feelings. - step 6: ask for the users needs. - step 7: ask for the users request.`;

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
