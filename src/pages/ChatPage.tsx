// ============================================================
// 聊天页 - 重构后（保留核心 WebSocket 逻辑，仅重构样式）
// ============================================================
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '@/constants'
import { useChatStore, useUserStore, wsManager } from '@/store'
import { getConversationList } from '@/api/chat'
import { listStagger, listItem } from '@/hooks'
import { Header } from '@/components/layout/Header'

// ============================================================
// 常量
// ============================================================
const TABS = [
  { key: 'chat', label: '聊天' },
  { key: 'friend', label: '好友' },
  { key: 'match', label: '匹配' },
]

// ============================================================
// 主组件
// ============================================================
const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState<any[]>([])
  const [loadingConv, setLoadingConv] = useState(true)
  const messagesEndRef = useRef(null)

  const { user } = useUserStore()
  const { messages, setMessages, addMessage } = useChatStore()

  // ============================================================
  // 加载会话列表
  // ============================================================
  useEffect(() => {
    if (activeTab !== 'chat') return
    const loadConvs = async () => {
      try {
        const data = await getConversationList()
        setConversations(data.data?.conversations || [])
      } catch {
        setConversations([])
      } finally {
        setLoadingConv(false)
      }
    }
    loadConvs()
  }, [activeTab])

  // ============================================================
  // WebSocket
  // ============================================================
  useEffect(() => {
    if (!user?.id) return
    const wsUrl = `ws://192.168.3.14:3000/ws/chat?token=${localStorage.getItem('token') || ''}`
    wsManager.connect(wsUrl)

    const unsubStatus = wsManager.onStatusChange((status) => {
      console.log('[WS] status:', status)
    })

    const unsubMsg = wsManager.onMessage((msg) => {
      const conversationId = msg.to || msg.from
      addMessage(conversationId, {
        id: msg.id || `msg_${Date.now()}`,
        type: msg.type,
        from: msg.from,
        to: msg.to,
        content: msg.content,
        timestamp: msg.timestamp || Date.now(),
        isSelf: msg.from === user.id,
      })
      setConversations(prev => prev.map(c =>
        c.partnerId === conversationId ? { ...c, lastMessage: msg.content, lastTime: Date.now() } : c
      ))
    })

    return () => { unsubStatus(); unsubMsg() }
  }, [user?.id])

  useEffect(() => {
    if (selectedChat) {
      const chatId = String(selectedChat.partnerId)
      if (!messages[chatId]) setMessages(chatId, [])
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedChat])

  // ============================================================
  // 发送消息
  // ============================================================
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return
    const chatId = String(selectedChat.partnerId)
    const newMsg = {
      id: `msg_${Date.now()}`,
      type: 'chat' as const,
      from: user?.id || '',
      to: String(selectedChat.id),
      content: message,
      timestamp: Date.now(),
      isSelf: true,
    }
    addMessage(chatId, newMsg)
    setMessage('')
    try {
      await wsManager.sendChatMessage(String(selectedChat.partnerId), message)
    } catch (e) {
      console.error('[WS] send failed:', e)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentMessages = selectedChat ? (messages[String(selectedChat.partnerId)] || []) : []

  // ============================================================
  // 聊天列表视图
  // ============================================================
  if (!selectedChat) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>消息</span>
          <span style={styles.headerRight}>🔍</span>
        </div>

        <div style={styles.tabBar}>
          {TABS.map(tab => (
            <motion.div
              key={tab.key}
              style={{
                ...styles.tab,
                ...(activeTab === tab.key ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.key)}
              whileTap={{ scale: 0.92 }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  style={styles.tabIndicator}
                  layoutId="chatTabIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          style={styles.chatList}
          variants={listStagger(0.05, 0.08)}
          initial="hidden"
          animate="show"
        >
          {loadingConv ? (
            <motion.div variants={listItem} style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: 13, padding: 40 }}>
              加载中...
            </motion.div>
          ) : conversations.length === 0 ? (
            <motion.div variants={listItem} style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: 13, padding: 40 }}>
              暂无会话
            </motion.div>
          ) : (
            conversations.map(conv => (
              <motion.div
                key={conv.partnerId}
                style={styles.chatItem}
                onClick={() => setSelectedChat(conv)}
                variants={listItem}
                whileHover={{ backgroundColor: 'rgba(255,107,157,0.08)' }}
              >
                <div style={styles.avatarWrapper}>
                  <span style={styles.avatar}>{conv.partnerAvatar || '💫'}</span>
                </div>
                <div style={styles.chatContent}>
                  <div style={styles.chatTop}>
                    <span style={styles.chatName}>{conv.partnerName}</span>
                    <span style={styles.chatTime}>
                      {conv.lastTime ? new Date(conv.lastTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div style={styles.chatBottom}>
                    <span style={styles.lastMsg}>{conv.lastMessage}</span>
                    {conv.unreadCount > 0 && <span style={styles.unreadBadge}>{conv.unreadCount}</span>}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    )
  }

  // ============================================================
  // 聊天房间视图
  // ============================================================
  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <motion.span
          style={styles.backBtn}
          onClick={() => setSelectedChat(null)}
          whileTap={{ scale: 0.85, opacity: 0.7 }}
        >
          ←
        </motion.span>
        <div style={styles.chatHeaderInfo}>
          <span style={styles.chatHeaderName}>{selectedChat.partnerName}</span>
        </div>
        <span style={styles.moreBtn}>⋮</span>
      </div>

      <div style={styles.messageList}>
        <AnimatePresence initial={false}>
          {currentMessages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <motion.div key={msg.id} style={styles.systemMsg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {msg.content}
                </motion.div>
              )
            }
            if (msg.isSelf) {
              return (
                <motion.div key={msg.id} style={styles.selfMsgWrapper} initial={{ opacity: 0, x: 20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }}>
                  <div style={styles.selfBubble}>{msg.content}</div>
                  <span style={styles.msgTime}>{new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </motion.div>
              )
            }
            return (
              <motion.div key={msg.id} style={styles.otherMsgWrapper} initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }}>
                <span style={styles.otherAvatar}>{selectedChat.partnerAvatar || '💫'}</span>
                <div>
                  <span style={styles.otherName}>{selectedChat.partnerName}</span>
                  <div style={styles.otherBubble}>{msg.content}</div>
                </div>
                <span style={styles.msgTime}>{new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <motion.span style={styles.inputIcon} whileTap={{ scale: 0.88 }}>➕</motion.span>
        <input
          style={styles.input}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="说点什么..."
        />
        <motion.span style={styles.inputIcon} whileTap={{ scale: 0.88 }}>😊</motion.span>
        <motion.button
          style={styles.sendBtn}
          onClick={sendMessage}
          whileTap={{ scale: 0.92, opacity: 0.8 }}
          disabled={!message.trim()}
        >
          发送
        </motion.button>
      </div>
    </div>
  )
}

// ============================================================
// 样式
// ============================================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    color: COLORS.text,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  headerRight: {
    fontSize: 20,
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    padding: '12px 20px',
    gap: 24,
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    fontSize: 15,
    color: COLORS.textSecondary,
    paddingBottom: 8,
    cursor: 'pointer',
    borderBottom: '2px solid transparent' as const,
    position: 'relative' as const,
  },
  tabIndicator: {
    position: 'absolute' as const,
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  chatList: {
    flex: 1,
    overflow: 'auto' as const,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
    backgroundColor: COLORS.card,
  },
  avatarWrapper: {
    position: 'relative' as const,
    marginRight: 12,
  },
  avatar: {
    fontSize: 48,
    display: 'block',
  },
  chatContent: {
    flex: 1,
  },
  chatTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  chatTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  chatBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: 13,
    color: COLORS.textSecondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    maxWidth: 200,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: 11,
    padding: '2px 6px',
    borderRadius: 10,
    minWidth: 18,
    textAlign: 'center' as const,
  },
  chatHeader: {
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  backBtn: {
    fontSize: 24,
    cursor: 'pointer',
    marginRight: 12,
    color: COLORS.text,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    display: 'block',
    color: COLORS.text,
  },
  moreBtn: {
    fontSize: 20,
    cursor: 'pointer',
    color: COLORS.text,
  },
  messageList: {
    flex: 1,
    padding: 16,
    overflow: 'auto' as const,
    backgroundColor: COLORS.background,
  },
  systemMsg: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: '10px 0',
  },
  selfMsgWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 6,
  },
  selfBubble: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '18px 4px 18px 18px',
    maxWidth: '70%',
    fontSize: 14,
    lineHeight: 1.4,
  },
  otherMsgWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  otherAvatar: {
    fontSize: 36,
    display: 'block',
  },
  otherName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
    display: 'block',
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: '10px 14px',
    borderRadius: '4px 18px 18px 18px',
    maxWidth: '70%',
    fontSize: 14,
    lineHeight: 1.4,
    border: `1px solid ${COLORS.border}`,
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    alignSelf: 'flex-end' as const,
  },
  inputBar: {
    backgroundColor: COLORS.card,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderTop: `1px solid ${COLORS.border}`,
  },
  inputIcon: {
    fontSize: 22,
    cursor: 'pointer',
    color: COLORS.textSecondary,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 20,
    padding: '10px 16px',
    color: COLORS.text,
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 'bold' as const,
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
    border: 'none',
    cursor: 'pointer',
  },
}

export default ChatPage