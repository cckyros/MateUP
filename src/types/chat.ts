// ========== 聊天相关类型 ==========

export interface ChatMessage {
  id: string
  type: 'chat' | 'system' | 'image' | 'voice'
  from: string
  to: string
  content: string
  timestamp: number
  isSelf: boolean
}

export interface Conversation {
  partnerId: string
  partnerName: string
  partnerAvatar: string
  lastMessage: string
  lastTime: number
  unreadCount: number
}

export interface SendMessageParams {
  to: string
  content: string
  type?: 'text' | 'image' | 'voice'
}
