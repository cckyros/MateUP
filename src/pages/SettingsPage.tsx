// 设置页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styles } from './SettingsPage.styles'
import { listStagger, listItem, SPRING, backButtonProps } from '@/utils/animations'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    order: true,
    msg: true,
    activity: false,
    sound: true,
    vibrate: true,
  })

  const toggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const menuItems = [
    { icon: '👤', label: '账号安全', sub: '手机号、密码设置' },
    { icon: '🔔', label: '消息通知', sub: '推送设置、声音设置', action: () => navigate('/notifications') },
    { icon: '🔒', label: '隐私设置', sub: '谁可以联系我' },
    { icon: '🌐', label: '通用设置', sub: '语言、主题' },
    { icon: '❓', label: '帮助与反馈', sub: '常见问题、联系客服' },
    { icon: '📄', label: '关于我们', sub: '版本 1.0.0' },
  ]

  const toggleSettings = [
    { key: 'order', label: '订单通知', desc: '接收订单状态变更通知' },
    { key: 'msg', label: '消息通知', desc: '接收聊天消息通知' },
    { key: 'activity', label: '活动通知', desc: '接收优惠活动通知' },
    { key: 'sound', label: '声音', desc: '通知提示音' },
    { key: 'vibrate', label: '震动', desc: '通知震动提示' },
  ]

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
        <span style={styles.headerTitle}>设置</span>
      </div>

      {/* 通知设置 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>通知设置</h3>
        <motion.div
          style={styles.toggleList}
          variants={listStagger(0.04, 0.05)}
          initial="initial"
          animate="animate"
        >
          {toggleSettings.map(item => (
            <motion.div key={item.key} style={styles.toggleItem} variants={listItem}>
              <div style={styles.toggleLeft}>
                <span style={styles.toggleLabel}>{item.label}</span>
                <span style={styles.toggleDesc}>{item.desc}</span>
              </div>
              <motion.div
                style={{
                  ...styles.toggle,
                  ...(notifications[item.key] ? styles.toggleOn : {}),
                }}
                onClick={() => toggle(item.key)}
                whileTap={{ scale: 0.92 }}
                transition={SPRING.tactile}
              >
                <div style={{
                  ...styles.toggleDot,
                  ...(notifications[item.key] ? styles.toggleDotOn : {}),
                }} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 其他设置 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>其他</h3>
        <motion.div
          style={styles.menuList}
          variants={listStagger(0.04, 0.05)}
          initial="initial"
          animate="animate"
        >
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              style={styles.menuItem}
              onClick={item.action || (() => {})}
              variants={listItem}
              whileTap={{ opacity: 0.7, scale: 0.99 }}
              transition={SPRING.tactile}
            >
              <div style={styles.menuLeft}>
                <span style={styles.menuIcon}>{item.icon}</span>
                <div>
                  <span style={styles.menuLabel}>{item.label}</span>
                  <span style={styles.menuSub}>{item.sub}</span>
                </div>
              </div>
              <span style={styles.menuArrow}>›</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 退出登录 */}
      <div style={styles.logoutArea}>
        <button style={styles.logoutBtn} onClick={() => navigate('/')}>
          退出登录
        </button>
      </div>

      {/* 版本信息 */}
      <p style={styles.version}>伴游 v1.0.0</p>
    </div>
  )
}

// ========== 暗色风格 ==========

export default SettingsPage
