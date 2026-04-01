import request from './index'

// ========== 聊天相关 API ==========

export interface ChatMessage {
  id: string
  from: string
  to: string
  content: string
  type: 'text' | 'image' | 'voice'
  timestamp: number
  isSelf?: boolean
}

export interface SendMessageParams {
  to: string
  content: string
  type?: 'text' | 'image' | 'voice'
}

// 发送消息（通过 WebSocket，HTTP 接口仅预留）
export const sendMessage = (data: SendMessageParams) =>
  request.post<ChatMessage>('/api/chat', data)

// 获取聊天记录
export const getChatHistory = (params: {
  partnerId: string
  limit?: number
  before?: number
}) =>
  request.get<{
    messages: ChatMessage[]
    hasMore: boolean
  }>(`/api/chat/history/${params.partnerId}`, params)

// 获取会话列表
export const getConversationList = (limit?: number) =>
  request.get<{
    conversations: Array<{
      partnerId: string
      partnerName: string
      partnerAvatar: string
      lastMessage: string
      lastTime: number
      unreadCount: number
    }>
  }>('/api/chat/conversations', { limit })
