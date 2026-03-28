// 聊天页 - 已集成真实 WebSocket + Zustand 持久化
import { useState, useRef, useEffect } from 'react'
import { COLORS } from '../constants'
import { useChatStore, useUserStore, wsManager } from '../store'

const mockChats = [
  { id: 1, name: '小美', avatar: '👩', lastMsg: '今晚一起打游戏吗？🎮', time: '刚刚', unread: 2, online: true },
  { id: 2, name: '阿杰', avatar: '👨', lastMsg: '收到，已上线', time: '10分钟前', unread: 0, online: true },
  { id: 3, name: '王者荣耀开黑群', avatar: '🎮', lastMsg: '阿珂：差一个人，来就来', time: '30分钟前', unread: 5, online: false, isGroup: true },
  { id: 4, name: '小林', avatar: '👩', lastMsg: '下次再约~', time: '昨天', unread: 0, online: false },
]

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)

  const { user } = useUserStore()
  const { messages, setMessages, addMessage } = useChatStore()

  // WebSocket 连接与消息监听
  useEffect(() => {
    if (!user?.id) return

    // 连接 WebSocket（真实连接）
    const wsUrl = `wss://api.banyou.com/ws/chat?token=${localStorage.getItem('token') || ''}`
    wsManager.connect(wsUrl)

    // 监听连接状态
    const unsubStatus = wsManager.onStatusChange((status) => {
      console.log('[WS] status:', status)
    })

    // 监听新消息 → 存入 Zustand store
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
    })

    return () => {
      unsubStatus()
      unsubMsg()
    }
  }, [user?.id])

  // 加载聊天记录（从 Zustand store）
  useEffect(() => {
    if (!selectedChat) return

    const chatId = String(selectedChat.id)
    if (messages[chatId]) {
      // 已有本地记录
    } else {
      // 首次进入，从 mockMessages 初始化（后续替换为真实 API）
      setMessages(chatId, [])
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedChat])

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    const chatId = String(selectedChat.id)
    const msgId = `msg_${Date.now()}`
    const newMsg = {
      id: msgId,
      type: 'chat',
      from: user?.id || '',
      to: String(selectedChat.id),
      content: message,
      timestamp: Date.now(),
      isSelf: true,
    }

    //乐观更新：先显示自己发的消息
    addMessage(chatId, newMsg)
    setMessage('')

    //通过 WebSocket 发送（wsManager.sendChatMessage 内部会调用 wsManager.send）
    try {
      await wsManager.sendChatMessage(String(selectedChat.id), message)
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

  const currentMessages = selectedChat ? (messages[String(selectedChat.id)] || []) : []

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
          {mockChats.map(chat => (
            <div
              key={chat.id}
              style={styles.chatItem}
              onClick={() => setSelectedChat(chat)}
            >
              <div style={styles.avatarWrapper}>
                <span style={styles.avatar}>{chat.avatar}</span>
                {chat.online && <span style={styles.onlineDot} />}
              </div>
              <div style={styles.chatContent}>
                <div style={styles.chatTop}>
                  <span style={styles.chatName}>{chat.name}</span>
                  <span style={styles.chatTime}>{chat.time}</span>
                </div>
                <div style={styles.chatBottom}>
                  <span style={styles.lastMsg}>{chat.lastMsg}</span>
                  {chat.unread > 0 && <span style={styles.unreadBadge}>{chat.unread}</span>}
                </div>
              </div>
            </div>
          ))}
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
          <span style={styles.chatHeaderName}>{selectedChat.name}</span>
          <span style={styles.chatHeaderStatus}>{selectedChat.online ? '在线' : '离线'}</span>
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
              <span style={styles.otherAvatar}>{selectedChat.avatar}</span>
              <div>
                <span style={styles.otherName}>{selectedChat.name}</span>
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
const styles = {
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
