import { request } from './index'
import type { ChatMessage, Conversation } from '@/types'

export const sendMessage = (data: { to: string; content: string; type?: string }) =>
  request.post<ChatMessage>('/api/chat', data)

export const getChatHistory = (params: {
  partnerId: string
  limit?: number
  before?: number
}) =>
  request.get<{
    messages: ChatMessage[]
    hasMore: boolean
  }>(`/api/chat/history/${params.partnerId}`, { params })

export const getConversationList = (limit?: number) =>
  request.get<{
    conversations: Conversation[]
  }>('/api/chat/conversations', { params: { limit } })
