// WebSocket 管理器 - 处理聊天实时通信
// 实现：连接管理、心跳检测、消息重发、ACK 确认机制

type MessageHandler = (data: ChatMessage) => void
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

interface ChatMessage {
  id: string
  type: 'chat' | 'system' | 'image' | 'voice'
  from: string
  to: string
  content: string
  timestamp: number
  isSelf: boolean
}

interface WSMessage {
  type: string
  data: any
  ackId?: string // 用于消息确认
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string = ''
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectDelay: number = 3000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private messageHandlers: Set<MessageHandler> = new Set()
  private statusHandlers: Set<StatusHandler> = new Set()
  private pendingMessages: Map<string, (success: boolean) => void> = new Map()
  private messageIdCounter: number = 0

  connect(url: string) {
    this.url = url
    this.createConnection()
  }

  private createConnection() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.notifyStatus('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      this.ws.onclose = () => {
        this.stopHeartbeat()
        this.notifyStatus('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = () => {
        this.notifyStatus('error')
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.attemptReconnect()
    }
  }

  private handleMessage(message: WSMessage) {
    switch (message.type) {
      case 'chat':
        // 收到聊天消息
        this.messageHandlers.forEach((handler) =>
          handler(message.data as ChatMessage)
        )
        break

      case 'ack':
        // 消息确认（发送方收到确认）
        const ackId = message.data?.ackId
        if (ackId && this.pendingMessages.has(ackId)) {
          const resolver = this.pendingMessages.get(ackId)!
          resolver(true)
          this.pendingMessages.delete(ackId)
        }
        break

      case 'pong':
        // 心跳响应
        break

      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  // 发送消息（带确认机制）
  send(type: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        resolve(false)
        return
      }

      const messageId = `msg_${++this.messageIdCounter}_${Date.now()}`
      const message: WSMessage = {
        type,
        data,
        ackId: messageId,
      }

      // 存入待确认队列
      this.pendingMessages.set(messageId, resolve)

      // 超时处理
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId)
          resolve(false)
        }
      }, 10000)

      this.ws.send(JSON.stringify(message))
    })
  }

  // 发送聊天消息
  sendChatMessage(to: string, content: string): Promise<boolean> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'chat',
      from: '', // 由服务端填充
      to,
      content,
      timestamp: Date.now(),
      isSelf: true,
    }
    return this.send('chat', message)
  }

  // 订阅消息
  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  // 订阅连接状态
  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status))
  }

  // 心跳检测
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // 断线重连
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.createConnection()
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  // 主动断开
  disconnect() {
    this.stopHeartbeat()
    this.pendingMessages.clear()
    this.ws?.close()
    this.ws = null
  }

  // 获取连接状态
  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// 单例导出
export const wsManager = new WebSocketManager()

// ========== 简化版 Hook 封装 ==========
import { useEffect, useRef, useCallback, useState } from 'react'

export function useWebSocketChat(userId: string) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    if (!userId) return

    // 连接 WebSocket
    wsManager.connect(`wss://api.banyou.com/ws?userId=${userId}`)

    // 监听状态变化
    const unsubStatus = wsManager.onStatusChange((status) => {
      setConnected(status === 'connected')
    })

    // 监听新消息
    const unsubMessage = wsManager.onMessage((message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      unsubStatus()
      unsubMessage()
    }
  }, [userId])

  const sendMessage = useCallback((to: string, content: string) => {
    return wsManager.sendChatMessage(to, content)
  }, [])

  return { connected, messages, sendMessage }
}
