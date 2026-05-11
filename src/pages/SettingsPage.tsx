// ============================================================
// 设置页 - 重构后
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { Header } from '@/components/layout/Header'
import { Toggle } from '@/components/ui'
import { listStagger, listItem } from '@/hooks'

// ============================================================
// 常量
// ============================================================
const TOGGLE_SETTINGS = [
  { key: 'order', label: '订单通知', desc: '接收订单状态变更通知' },
  { key: 'msg', label: '消息通知', desc: '接收聊天消息通知' },
  { key: 'activity', label: '活动通知', desc: '接收优惠活动通知' },
  { key: 'sound', label: '声音', desc: '通知提示音' },
  { key: 'vibrate', label: '震动', desc: '通知震动提示' },
]

const MENU_ITEMS = [
  { icon: '👤', label: '账号安全', sub: '手机号、密码设置' },
  { icon: '🔔', label: '消息通知', sub: '推送设置、声音设置', path: '/notifications' },
  { icon: '🔒', label: '隐私设置', sub: '谁可以联系我' },
  { icon: '🌐', label: '通用设置', sub: '语言、主题' },
  { icon: '❓', label: '帮助与反馈', sub: '常见问题、联系客服' },
  { icon: '📄', label: '关于我们', sub: '版本 1.0.0' },
]

// ============================================================
// 主组件
// ============================================================
const SettingsPage = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    order: true,
    msg: true,
    activity: false,
    sound: true,
    vibrate: true,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={styles.container}>
      <Header title="设置" onBack={() => navigate(-1)} showBack />

      {/* 通知设置 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>通知设置</h3>
        <motion.div
          style={styles.card}
          variants={listStagger(0.04, 0.05)}
          initial="hidden"
          animate="show"
        >
          {TOGGLE_SETTINGS.map(item => (
            <motion.div
              key={item.key}
              style={styles.toggleItem}
              variants={listItem}
            >
              <div style={styles.toggleLeft}>
                <span style={styles.toggleLabel}>{item.label}</span>
                <span style={styles.toggleDesc}>{item.desc}</span>
              </div>
              <Toggle
                checked={settings[item.key as keyof typeof settings]}
                onChange={() => toggle(item.key as keyof typeof settings)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 其他设置 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>其他</h3>
        <motion.div
          style={styles.card}
          variants={listStagger(0.04, 0.05)}
          initial="hidden"
          animate="show"
        >
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              style={styles.menuItem}
              onClick={() => item.path && navigate(item.path)}
              variants={listItem}
              whileTap={{ opacity: 0.7, scale: 0.99 }}
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
        <button
          style={styles.logoutBtn}
          onClick={() => navigate('/')}
        >
          退出登录
        </button>
      </div>

      <p style={styles.version}>伴游 v1.0.0</p>
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
    paddingBottom: 40,
  },
  section: {
    padding: '16px',
  },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    margin: '0 0 12px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
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
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  menuLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    display: 'block',
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSub: {
    display: 'block',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  logoutArea: {
    padding: '20px 16px 0',
  },
  logoutBtn: {
    width: '100%',
    padding: 15,
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 25,
    fontSize: 15,
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  version: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
}

export default SettingsPage