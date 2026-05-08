import { ChatMessage } from './types'

type MessageHandler = (data: ChatMessage) => void
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

interface WSMessage {
  type: string
  data: unknown
  ackId?: string
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private url = ''
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private messageHandlers = new Set<MessageHandler>()
  private statusHandlers = new Set<StatusHandler>()
  private pendingMessages = new Map<string, (success: boolean) => void>()
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
      case 'ack':
        if (message.data && typeof message.data === 'object' && 'ackId' in message.data) {
          const ackId = (message.data as { ackId: string }).ackId
          if (this.pendingMessages.has(ackId)) {
            this.pendingMessages.get(ackId)!(true)
            this.pendingMessages.delete(ackId)
          }
        }
        break
      case 'pong':
        break
    }
  }

  send(type: string, data: unknown): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws?.readyState !== WebSocket.OPEN) { resolve(false); return }
      const messageId = `msg_${++this.messageIdCounter}_${Date.now()}`
      const msg: WSMessage = { type, data, ackId: messageId }
      this.pendingMessages.set(messageId, resolve)
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId)
          resolve(false)
        }
      }, 10000)
      this.ws.send(JSON.stringify(msg))
    })
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status))
  }

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

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return
    this.reconnectAttempts++
    setTimeout(() => this.createConnection(), this.reconnectDelay * this.reconnectAttempts)
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
