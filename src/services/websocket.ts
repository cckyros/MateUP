import type { ChatMessage } from '@/types'

type MessageHandler = (data: ChatMessage) => void
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

interface WSMessage {
  type: string
  data: unknown
  ackId?: string
}

const HEARTBEAT_INTERVAL = 30000
const ACK_TIMEOUT = 10000
const MAX_RECONNECT_ATTEMPTS = 5
const BASE_RECONNECT_DELAY = 3000

class WebSocketManager {
  private ws: WebSocket | null = null
  private url = ''
  private reconnectAttempts = 0
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private messageHandlers: Set<MessageHandler> = new Set()
  private statusHandlers: Set<StatusHandler> = new Set()
  private pendingMessages: Map<string, (success: boolean) => void> = new Map()
  private messageIdCounter = 0

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
          console.error('[WS] parse error:', e)
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
      console.error('[WS] connection error:', error)
      this.attemptReconnect()
    }
  }

  private handleMessage(message: WSMessage) {
    switch (message.type) {
      case 'chat':
        this.messageHandlers.forEach((handler) => handler(message.data as ChatMessage))
        break
      case 'ack': {
        const ackData = message.data as { ackId?: string }
        if (ackData?.ackId && this.pendingMessages.has(ackData.ackId)) {
          this.pendingMessages.get(ackData.ackId)!(true)
          this.pendingMessages.delete(ackData.ackId)
        }
        break
      }
      case 'pong':
        break
      default:
        console.warn('[WS] unknown message type:', message.type)
    }
  }

  send(type: string, data: unknown): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        resolve(false)
        return
      }

      const messageId = `msg_${++this.messageIdCounter}_${Date.now()}`
      const msg: WSMessage = { type, data, ackId: messageId }

      this.pendingMessages.set(messageId, resolve)

      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId)
          resolve(false)
        }
      }, ACK_TIMEOUT)

      this.ws.send(JSON.stringify(msg))
    })
  }

  sendChatMessage(to: string, content: string): Promise<boolean> {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'chat',
      from: '',
      to,
      content,
      timestamp: Date.now(),
      isSelf: true,
    }
    return this.send('chat', msg)
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => { this.messageHandlers.delete(handler) }
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler)
    return () => { this.statusHandlers.delete(handler) }
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status))
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, HEARTBEAT_INTERVAL)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WS] max reconnection attempts reached')
      return
    }
    this.reconnectAttempts++
    setTimeout(() => this.createConnection(), BASE_RECONNECT_DELAY * this.reconnectAttempts)
  }

  disconnect() {
    this.stopHeartbeat()
    this.pendingMessages.clear()
    this.ws?.close()
    this.ws = null
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsManager = new WebSocketManager()
