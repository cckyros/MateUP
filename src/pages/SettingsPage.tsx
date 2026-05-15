// 设置页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'
import { listStagger, listItem } from '@/utils/animations'

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
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '40px',
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
  },
  section: {
    padding: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  toggleList: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  toggleLeft: {
    flex: 1,
  },
  toggleLabel: {
    display: 'block',
    fontSize: '15px',
    color: COLORS.text,
    marginBottom: '2px',
  },
  toggleDesc: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  toggle: {
    width: '50px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '2px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
    border: `1px solid ${COLORS.border}`,
  },
  toggleOn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleDot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
  },
  toggleDotOn: {
    transform: 'translateX(22px)',
  },
  menuList: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  menuLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuIcon: {
    fontSize: '22px',
  },
  menuLabel: {
    display: 'block',
    fontSize: '15px',
    color: COLORS.text,
    marginBottom: '2px',
  },
  menuSub: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  menuArrow: {
    fontSize: '20px',
    color: COLORS.textSecondary,
  },
  logoutArea: {
    padding: '20px 16px 0',
  },
  logoutBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '25px',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  version: {
    textAlign: 'center',
    fontSize: '12px',
    color: COLORS.textSecondary,
    marginTop: '20px',
  },
}

export default SettingsPage
