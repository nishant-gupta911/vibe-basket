import { create } from 'zustand';

export interface MemoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMemoryState {
  messages: MemoryMessage[];
  addMessage: (message: MemoryMessage) => void;
  clear: () => void;
}

export const useChatMemoryStore = create<ChatMemoryState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-5),
    })),
  clear: () => set({ messages: [] }),
}));
