// 通知页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const NotificationPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('全部')

  const notifications = [
    { id: 1, type: 'order', icon: '📋', title: '订单已接单', content: '小美 已接单，您预约的王者荣耀陪玩服务将于今天20:00开始', time: '刚刚', unread: true },
    { id: 2, type: 'msg', icon: '💬', title: '新消息', content: '小美：好的没问题，今晚见~', time: '5分钟前', unread: true },
    { id: 3, type: 'system', icon: '🔔', title: '系统通知', content: '恭喜您获得新人优惠券，满50减10，限今日使用', time: '1小时前', unread: false },
    { id: 4, type: 'order', icon: '✅', title: '订单已完成', content: '您与阿杰的和平精英陪玩服务已完成，邀您评价', time: '昨天', unread: false },
    { id: 5, type: 'activity', icon: '🎁', title: '活动提醒', content: '周末连单享8折优惠，快去约陪玩吧~', time: '3天前', unread: false },
  ]

  const tabs = ['全部', '订单', '消息', '系统']
  const tabMap = { '全部': 'all', '订单': 'order', '消息': 'msg', '系统': 'system' }

  const filteredNotifications = activeTab === '全部'
    ? notifications
    : notifications.filter(n => n.type === tabMap[activeTab])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
        <span style={styles.headerTitle}>消息通知</span>
        {unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
      </div>

      {/* 标签栏 */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <div
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === '消息' && unreadCount > 0 && <span style={styles.tabBadge}>{unreadCount}</span>}
          </div>
        ))}
      </div>

      {/* 通知列表 */}
      <div style={styles.list}>
        {filteredNotifications.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>🔔</span>
            <p style={styles.emptyText}>暂无消息</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              style={{
                ...styles.item,
                ...(notif.unread ? styles.unreadItem : {}),
              }}
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    minWidth: '20px',
    textAlign: 'center',
  },
  tabBar: {
    display: 'flex',
    padding: '12px 16px',
    gap: '24px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    paddingBottom: '8px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold',
  },
  tabBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '10px',
    padding: '1px 5px',
    borderRadius: '8px',
  },
  list: {
    padding: '0',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
    gap: '14px',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  unreadItem: {
    backgroundColor: 'rgba(255,107,157,0.05)',
  },
  itemIcon: {
    fontSize: '32px',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
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
    marginBottom: '6px',
  },
  itemTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemTime: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  itemDesc: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: 0,
    lineHeight: '1.5',
  },
  unreadDot: {
    position: 'absolute',
    top: '20px',
    right: '16px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: 0,
  },
}

export default NotificationPage
