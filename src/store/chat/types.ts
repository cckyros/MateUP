export interface ChatMessage {
  id: string
  type: 'chat' | 'system'
  from: string
  to: string
  content: string
  timestamp: number
  isSelf: boolean
}
