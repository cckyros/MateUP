// ============================================================
// 通知页 - 重构后
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { Header } from '@/components/layout/Header'
import { Empty } from '@/components/ui'
import { listStagger, listItem } from '@/hooks'

// ============================================================
// 常量
// ============================================================
const TABS = ['全部', '订单', '消息', '系统']
const TAB_MAP: Record<string, string> = { '全部': 'all', '订单': 'order', '消息': 'msg', '系统': 'system' }

const NOTIFICATIONS = [
  { id: 1, type: 'order', icon: '📋', title: '订单已接单', content: '小美 已接单，您预约的王者荣耀陪玩服务将于今天20:00开始', time: '刚刚', unread: true },
  { id: 2, type: 'msg', icon: '💬', title: '新消息', content: '小美：好的没问题，今晚见~', time: '5分钟前', unread: true },
  { id: 3, type: 'system', icon: '🔔', title: '系统通知', content: '恭喜您获得新人优惠券，满50减10，限今日使用', time: '1小时前', unread: false },
  { id: 4, type: 'order', icon: '✅', title: '订单已完成', content: '您与阿杰的和平精英陪玩服务已完成，邀您评价', time: '昨天', unread: false },
  { id: 5, type: 'activity', icon: '🎁', title: '活动提醒', content: '周末连单享8折优惠，快去约陪玩吧~', time: '3天前', unread: false },
]

// ============================================================
// 主组件
// ============================================================
const NotificationPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('全部')

  const filtered = activeTab === '全部'
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter(n => n.type === TAB_MAP[activeTab])

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <div style={styles.container}>
      <Header
        title="消息通知"
        onBack={() => navigate(-1)}
        right={unreadCount > 0 ? <span style={styles.unreadBadge}>{unreadCount}</span> : undefined}
      />

      {/* 标签栏 */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <motion.div
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
            whileTap={{ scale: 0.92 }}
          >
            {tab}
            {tab === '消息' && unreadCount > 0 && (
              <span style={styles.tabBadge}>{unreadCount}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* 通知列表 */}
      <motion.div
        style={styles.list}
        variants={listStagger(0.06, 0.1)}
        initial="hidden"
        animate="show"
      >
        {filtered.length === 0 ? (
          <Empty icon="🔔" text="暂无消息" />
        ) : (
          filtered.map(notif => (
            <motion.div
              key={notif.id}
              style={{
                ...styles.item,
                ...(notif.unread ? styles.unreadItem : {}),
              }}
              variants={listItem}
              whileHover={{ backgroundColor: 'rgba(255,107,157,0.06)' }}
            >
              <div style={styles.itemIcon}>{notif.icon}</div>
              <div style={styles.itemContent}>
                <div style={styles.itemHeader}>
                  <span style={styles.itemTitle}>{notif.title}</span>
                  <span style={styles.itemTime}>{notif.time}</span>
                </div>
                <p style={styles.itemDesc}>{notif.content}</p>
              </div>
              {notif.unread && <span style={styles.unreadDot} />}
            </motion.div>
          ))
        )}
      </motion.div>
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
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center' as const,
  },
  tabBar: {
    display: 'flex',
    padding: '12px 16px',
    gap: 24,
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingBottom: 8,
    cursor: 'pointer',
    borderBottom: '2px solid transparent' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  tabBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: 10,
    padding: '1px 5px',
    borderRadius: 8,
  },
  list: {
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 16,
    borderBottom: `1px solid ${COLORS.border}`,
    gap: 14,
    position: 'relative' as const,
    backgroundColor: 'transparent',
  },
  unreadItem: {
    backgroundColor: 'rgba(255,107,157,0.05)',
  },
  itemIcon: {
    fontSize: 32,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: `1px solid ${COLORS.border}`,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    margin: 0,
    lineHeight: 1.5,
  },
  unreadDot: {
    position: 'absolute' as const,
    top: 20,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
  },
}

export default NotificationPage