// 聊天页 - 已集成真实 WebSocket + 会话列表 API
import { useState, useRef, useEffect } from 'react'
import { COLORS } from '../constants'
import { useChatStore, useUserStore, wsManager } from '../store'
import { getConversationList } from '../api/chat'
import { Styles } from '@/utils/styles'

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState([])
  const [loadingConv, setLoadingConv] = useState(true)
  const messagesEndRef = useRef(null)

  const { user } = useUserStore()
  const { messages, setMessages, addMessage } = useChatStore()

  // 加载会话列表
  useEffect(() => {
    const loadConvs = async () => {
      try {
        const data = await getConversationList()
        setConversations(data.data.conversations || [])
      } catch {
        setConversations([])
      } finally {
        setLoadingConv(false)
      }
    }
    if (activeTab === 'chat') loadConvs()
  }, [activeTab])

  // WebSocket 连接与消息监听
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
      // 更新会话列表的最近消息
      setConversations(prev => prev.map(c =>
        c.partnerId === conversationId ? { ...c, lastMessage: msg.content, lastTime: Date.now() } : c
      ))
    })

    return () => {
      unsubStatus()
      unsubMsg()
    }
  }, [user?.id])

  // 加载聊天记录
  useEffect(() => {
    if (!selectedChat) return
    const chatId = String(selectedChat.partnerId)
    if (!messages[chatId]) {
      setMessages(chatId, [])
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedChat])

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    const chatId = String(selectedChat.partnerId)
    const msgId = `msg_${Date.now()}`
    const newMsg = {
      id: msgId,
      type: 'chat' as const,
      from: user?.id || '',
      to: String(selectedChat.id),
      content: message,
      timestamp: Date.now(),
      isSelf: true,
    }

    //乐观更新：先显示自己发的消息
    addMessage(chatId, newMsg)
    setMessage('')

    try {
      await wsManager.sendChatMessage(String(selectedChat.partnerId), message)
    } catch (e) {
      console.error('[WS] send failed:', e)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentMessages = selectedChat ? (messages[String(selectedChat.partnerId)] || []) : []

  // ========== 聊天列表视图 ==========
  if (!selectedChat) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>消息</span>
          <span style={styles.headerRight}>🔍</span>
        </div>

        <div style={styles.tabBar}>
          {['chat', 'friend', 'match'].map(tab => (
            <div
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'chat' ? '聊天' : tab === 'friend' ? '好友' : '匹配'}
            </div>
          ))}
        </div>

        <div style={styles.chatList}>
          {loadingConv ? (
            <div style={{ ...styles.chatItem, justifyContent: 'center', color: COLORS.textSecondary, fontSize: '13px', padding: '40px' }}>
              加载中...
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ ...styles.chatItem, justifyContent: 'center', color: COLORS.textSecondary, fontSize: '13px', padding: '40px' }}>
              暂无会话
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.partnerId}
                style={styles.chatItem}
                onClick={() => setSelectedChat(conv)}
              >
                <div style={styles.avatarWrapper}>
                  <span style={styles.avatar}>{conv.partnerAvatar || '💫'}</span>
                </div>
                <div style={styles.chatContent}>
                  <div style={styles.chatTop}>
                    <span style={styles.chatName}>{conv.partnerName}</span>
                    <span style={styles.chatTime}>{conv.lastTime ? new Date(conv.lastTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <div style={styles.chatBottom}>
                    <span style={styles.lastMsg}>{conv.lastMessage}</span>
                    {conv.unreadCount > 0 && <span style={styles.unreadBadge}>{conv.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // ========== 聊天房间视图 ==========
  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <span style={styles.backBtn} onClick={() => setSelectedChat(null)}>←</span>
        <div style={styles.chatHeaderInfo}>
          <span style={styles.chatHeaderName}>{selectedChat.partnerName}</span>
        </div>
        <span style={styles.moreBtn}>⋮</span>
      </div>

      <div style={styles.messageList}>
        {currentMessages.map(msg => {
          if (msg.type === 'system') {
            return <div key={msg.id} style={styles.systemMsg}>{msg.content}</div>
          }
          if (msg.isSelf) {
            return (
              <div key={msg.id} style={styles.selfMsgWrapper}>
                <div style={styles.selfBubble}>{msg.content}</div>
                <span style={styles.msgTime}>
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          }
          return (
            <div key={msg.id} style={styles.otherMsgWrapper}>
              <span style={styles.otherAvatar}>{selectedChat.partnerAvatar || '💫'}</span>
              <div>
                <span style={styles.otherName}>{selectedChat.partnerName}</span>
                <div style={styles.otherBubble}>{msg.content}</div>
              </div>
              <span style={styles.msgTime}>
                {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <span style={styles.inputIcon}>➕</span>
        <input
          style={styles.input}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="说点什么..."
        />
        <span style={styles.inputIcon}>😊</span>
        <span style={styles.sendBtn} onClick={sendMessage}>发送</span>
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    color: COLORS.text,
    display: 'flex',
    flexDirection: 'column',
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
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    padding: '12px 20px',
    gap: '24px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    fontSize: '15px',
    color: COLORS.textSecondary,
    paddingBottom: '8px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
    overflow: 'auto',
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
    position: 'relative',
    marginRight: '12px',
  },
  avatar: {
    fontSize: '48px',
    display: 'block',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    backgroundColor: COLORS.success,
    borderRadius: '50%',
    border: `2px solid ${COLORS.card}`,
  },
  chatContent: {
    flex: 1,
  },
  chatTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  chatName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chatTime: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  chatBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
  chatHeader: {
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  backBtn: {
    fontSize: '24px',
    cursor: 'pointer',
    marginRight: '12px',
    color: COLORS.text,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'block',
    color: COLORS.text,
  },
  chatHeaderStatus: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  moreBtn: {
    fontSize: '20px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  messageList: {
    flex: 1,
    padding: '16px',
    overflow: 'auto',
    backgroundColor: COLORS.background,
  },
  systemMsg: {
    textAlign: 'center',
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: '10px 0',
  },
  selfMsgWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: '12px',
    gap: '6px',
  },
  selfBubble: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '18px 4px 18px 18px',
    maxWidth: '70%',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  otherMsgWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '8px',
  },
  otherAvatar: {
    fontSize: '36px',
    display: 'block',
  },
  otherName: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    marginBottom: '2px',
    display: 'block',
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: '10px 14px',
    borderRadius: '4px 18px 18px 18px',
    maxWidth: '70%',
    fontSize: '14px',
    lineHeight: '1.4',
    border: `1px solid ${COLORS.border}`,
  },
  msgTime: {
    fontSize: '10px',
    color: COLORS.textSecondary,
    alignSelf: 'flex-end',
  },
  inputBar: {
    backgroundColor: COLORS.card,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  inputIcon: {
    fontSize: '22px',
    cursor: 'pointer',
    color: COLORS.textSecondary,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '20px',
    padding: '10px 16px',
    color: COLORS.text,
    fontSize: '14px',
    outline: 'none',
  },
  sendBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '16px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
    border: 'none',
  },
}

export default ChatPage
