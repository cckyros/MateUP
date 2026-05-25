// 通知页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styles } from './NotificationPage.styles'
import { listStagger, listItem, SPRING, backButtonProps } from '@/utils/animations'

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
        <motion.span
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.85, opacity: 0.7 }}
          transition={SPRING.tactile}
        >
          ←
        </motion.span>
        <span style={styles.headerTitle}>消息通知</span>
        {unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
      </div>

      {/* 标签栏 */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <motion.div
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
            whileTap={{ scale: 0.92 }}
            transition={SPRING.tactile}
          >
            {tab}
            {tab === '消息' && unreadCount > 0 && <span style={styles.tabBadge}>{unreadCount}</span>}
          </motion.div>
        ))}
      </div>

      {/* 通知列表 */}
      <motion.div
        style={styles.list}
        variants={listStagger(0.06, 0.1)}
        initial="initial"
        animate="animate"
      >
        {filteredNotifications.length === 0 ? (
          <motion.div
            variants={listItem}
            style={styles.empty}
          >
            <span style={styles.emptyIcon}>🔔</span>
            <p style={styles.emptyText}>暂无消息</p>
          </motion.div>
        ) : (
          filteredNotifications.map(notif => (
            <motion.div
              key={notif.id}
              style={{
                ...styles.item,
                ...(notif.unread ? styles.unreadItem : {}),
              }}
              variants={listItem}
              whileHover={{ backgroundColor: 'rgba(255,107,157,0.06)' }}
              transition={{ duration: 0.15 }}
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

// ========== 暗色风格 ==========

export default NotificationPage
