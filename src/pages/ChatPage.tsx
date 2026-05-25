import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, WS_BASE_URL } from '@/constants'
import { useChatStore, useUserStore, wsManager } from '@/store'
import { getConversationList } from '@/api/chat'
import { styles } from './ChatPage.styles'
import { listStagger, listItem, chatBubble, SPRING, backButtonProps, badgePop } from '@/utils/animations'
import { ListSkeleton } from '@/components/Skeleton'

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
        setConversations(data.conversations || [])
      } catch (err) {
        console.error('[Chat] 加载会话列表失败:', err)
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

    const wsUrl = `${WS_BASE_URL}/ws/chat?token=${localStorage.getItem('token') || ''}`
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
            <motion.div
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.93 }}
              transition={SPRING.tactile}
            >
              {tab === 'chat' ? '聊天' : tab === 'friend' ? '好友' : '匹配'}
              {activeTab === tab && (
                <motion.div
                  style={styles.tabIndicator}
                  layoutId="chatTabIndicator"
                  transition={SPRING.snappy}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          style={styles.chatList}
          variants={listStagger(0.05, 0.08)}
          initial="initial"
          animate="animate"
        >
          {loadingConv ? (
            <ListSkeleton count={5} />
          ) : conversations.length === 0 ? (
            <motion.div
              variants={listItem}
              style={{ ...styles.chatItem, justifyContent: 'center', color: COLORS.textSecondary, fontSize: '13px', padding: '40px' }}
            >
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
                transition={{ duration: 0.15 }}
              >
                <motion.div style={styles.avatarWrapper}>
                  <span style={styles.avatar}>{conv.partnerAvatar || '💫'}</span>
                </motion.div>
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
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    )
  }

  // ========== 聊天房间视图 ==========
  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <motion.span
          style={styles.backBtn}
          onClick={() => setSelectedChat(null)}
          {...backButtonProps}
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
          {currentMessages.map((msg, i) => {
            if (msg.type === 'system') {
              return (
                <motion.div
                  key={msg.id}
                  style={styles.systemMsg}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.content}
                </motion.div>
              )
            }
            if (msg.isSelf) {
              return (
                <motion.div
                  key={msg.id}
                  style={styles.selfMsgWrapper}
                  initial={{ opacity: 0, x: 16, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={SPRING.snappy}
                >
                  <motion.div
                    style={styles.selfBubble}
                    whileHover={{ scale: 1.01 }}
                    transition={SPRING.tactile}
                  >
                    {msg.content}
                  </motion.div>
                  <span style={styles.msgTime}>
                    {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              )
            }
            return (
              <motion.div
                key={msg.id}
                style={styles.otherMsgWrapper}
                initial={{ opacity: 0, x: -16, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8 }}
                transition={SPRING.snappy}
              >
                <motion.span
                  style={styles.otherAvatar}
                  whileHover={{ scale: 1.05 }}
                  transition={SPRING.tactile}
                >
                  {selectedChat.partnerAvatar || '💫'}
                </motion.span>
                <div>
                  <span style={styles.otherName}>{selectedChat.partnerName}</span>
                  <motion.div
                    style={styles.otherBubble}
                    whileHover={{ scale: 1.01 }}
                    transition={SPRING.tactile}
                  >
                    {msg.content}
                  </motion.div>
                </div>
                <span style={styles.msgTime}>
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <motion.span
          style={styles.inputIcon}
          whileTap={{ scale: 0.85 }}
          transition={SPRING.tactile}
        >
          ➕
        </motion.span>
        <input
          style={styles.input}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="说点什么..."
        />
        <motion.span
          style={styles.inputIcon}
          whileTap={{ scale: 0.85 }}
          transition={SPRING.tactile}
        >
          😊
        </motion.span>
        <motion.button
          style={styles.sendBtn}
          onClick={sendMessage}
          whileTap={{ scale: 0.9, opacity: 0.8 }}
          transition={SPRING.tactile}
          disabled={!message.trim()}
        >
          发送
        </motion.button>
      </div>
    </div>
  )
}

export default ChatPage
