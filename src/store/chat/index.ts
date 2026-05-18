import { create } from 'zustand'
import { ChatMessage } from './types'
import { STORAGE_KEYS } from '@/constants'

const loadChatFromStorage = (): Record<string, ChatMessage[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saveChatToStorage = (messages: Record<string, ChatMessage[]>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages))
  } catch (e) {
    console.warn('[ChatStore] failed to save:', e)
  }
}

interface ChatState {
  messages: Record<string, ChatMessage[]>
  currentConversation: string | null
  setMessages: (conversationId: string, messages: ChatMessage[]) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  setCurrentConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: loadChatFromStorage(),
  currentConversation: null,

  setMessages: (conversationId, messages) =>
    set((state) => {
      const updated = { ...state.messages, [conversationId]: messages }
      saveChatToStorage(updated)
      return { messages: updated }
    }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || []
      const updated = { ...state.messages, [conversationId]: [...existing, message] }
      saveChatToStorage(updated)
      return { messages: updated }
    }),

  setCurrentConversation: (conversationId) => set({ currentConversation: conversationId }),
}))

export { wsManager } from '@/services/websocket'
