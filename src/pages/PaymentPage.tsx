import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, GAME_NAMES } from '@/constants'
import { getOrderDetail, payOrder } from '@/api/order'
import { Styles } from '@/utils/styles'

// 下单须知规则
const ORDER_RULES = [
  {
    icon: '💰',
    title: '退款规则',
    content: '支付后如需退款，请提前1小时联系客服。开始陪玩后不支持退款，因陪玩师原因导致无法服务可全额退款。',
  },
  {
    icon: '⏰',
    title: '服务时间',
    content: '陪玩服务严格按预约时长进行，超时费用需额外支付。如陪玩师迟到超过10分钟，可联系客服处理。',
  },
  {
    icon: '🚫',
    title: '取消政策',
    content: '支付后5分钟内可免费取消。超过5分钟取消将收取50%费用作为陪玩师空档补偿。',
  },
  {
    icon: '✅',
    title: '服务确认',
    content: '服务完成后请在订单页确认完成，如服务期间遇到问题请保留凭证并第一时间联系客服。',
  },
  {
    icon: '🔒',
    title: '隐私保护',
    content: '请勿向陪玩师透露账号密码、支付信息等敏感内容，一切交易通过平台进行。',
  },
]

const PaymentPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('mock')
  const [countdown, setCountdown] = useState(15 * 60)
  const [showRules, setShowRules] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)

  // 加载订单
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const data = await getOrderDetail(id)
        setOrder(data)
      } catch (err) {
        console.error('[Payment] 加载订单失败:', err)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // 倒计时
  useEffect(() => {
    if (!order) return
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [order])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePayClick = () => {
    if (!order || paying) return
    setShowRules(true)
    setRulesAccepted(false)
  }

  const handlePayConfirm = async () => {
    if (!order || !rulesAccepted || paying) return
    setPaying(true)
    try {
      await payOrder(order.id, selectedMethod as any)
      alert('支付成功！')
      navigate('/orders')
    } catch (err) {
      alert(err?.response?.data?.message || '支付失败')
    } finally {
      setPaying(false)
    }
  }

  const closeRules = () => {
    setShowRules(false)
    setRulesAccepted(false)
  }

  const gameName = order ? (GAME_NAMES[order.game] || order.game) : ''

  const paymentMethods = [
    { id: 'mock', name: '模拟支付', icon: '💳', desc: '测试用' },
  ]

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: COLORS.textSecondary }}>加载中...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <span style={{ color: COLORS.error }}>订单不存在</span>
        <span style={{ color: COLORS.textSecondary, fontSize: '13px', cursor: 'pointer' }} onClick={() => navigate('/home')}>返回首页</span>
      </div>
    )
  }

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
        <span style={styles.headerTitle}>订单支付</span>
        <span style={styles.placeholder} />
      </div>

      {/* 倒计时 */}
      <div style={styles.countdownBar}>
        <span style={styles.countdownLabel}>剩余支付时间</span>
        <span style={styles.countdownTime}>{countdown > 0 ? formatTime(countdown) : '已过期'}</span>
      </div>

      {/* 订单摘要 */}
      <div style={styles.orderSummary}>
        {[
          { label: '订单编号', value: order.id },
          { label: '陪玩师', value: order.playerName },
          { label: '游戏', value: gameName },
          { label: '时长', value: `${order.duration}小时` },
        ].map((item, i) => (
          <div key={i} style={styles.summaryRow}>
            <span style={styles.summaryLabel}>{item.label}</span>
            <span style={styles.summaryValue}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 支付方式 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>选择支付方式</h3>
        {paymentMethods.map(method => (
          <motion.div
            key={method.id}
            style={{
              ...styles.methodItem,
              ...(selectedMethod === method.id ? styles.methodActive : {}),
            }}
            onClick={() => setSelectedMethod(method.id)}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div style={styles.methodLeft}>
              <span style={styles.methodIcon}>{method.icon}</span>
              <span style={styles.methodName}>{method.name}</span>
            </div>
            <div style={styles.methodRight}>
              {method.desc && <span style={styles.recommendTag}>{method.desc}</span>}
              <div style={{
                ...styles.radio,
                ...(selectedMethod === method.id ? styles.radioActive : {}),
              }}>
                {selectedMethod === method.id && <div style={styles.radioInner} />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 支付金额 */}
      <div style={styles.amountSection}>
        <span style={styles.amountLabel}>支付金额</span>
        <span style={styles.amountValue}>¥{order.price}</span>
      </div>

      {/* 支付按钮 */}
      <div style={styles.bottomBar}>
        <motion.button
          style={{ ...styles.payBtn, ...(paying ? styles.payBtnDisabled : {}) }}
          onClick={handlePayClick}
          disabled={paying}
          whileTap={paying ? {} : { scale: 0.97, opacity: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {paying ? '支付中...' : `确认支付 ¥${order.price}`}
        </motion.button>
      </div>

      {/* 安全提示 */}
      <p style={styles.securityTip}>
        🔒 支付安全由伴游平台保障，请勿泄露支付密码
      </p>

      {/* 下单须知浮层 */}
      <AnimatePresence>
        {showRules && (
          <>
            <motion.div
              style={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeRules}
            />
            <motion.div
              style={styles.bottomSheet}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div style={styles.sheetHandle} />
              <div style={styles.sheetHeader}>
                <h3 style={styles.sheetTitle}>📋 下单须知</h3>
                <motion.span
                  style={styles.sheetClose}
                  onClick={closeRules}
                  whileTap={{ scale: 0.85, opacity: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  ✕
                </motion.span>
              </div>
              <div style={styles.rulesList}>
                {ORDER_RULES.map((rule, i) => (
                  <div key={i} style={styles.ruleItem}>
                    <div style={styles.ruleTitleRow}>
                      <span style={styles.ruleIcon}>{rule.icon}</span>
                      <span style={styles.ruleTitle}>{rule.title}</span>
                    </div>
                    <p style={styles.ruleContent}>{rule.content}</p>
                  </div>
                ))}
              </div>
              <motion.div
                style={styles.agreeRow}
                onClick={() => setRulesAccepted(!rulesAccepted)}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div style={{
                  ...styles.checkbox,
                  ...(rulesAccepted ? styles.checkboxChecked : {}),
                }}>
                  {rulesAccepted && <span style={styles.checkmark}>✓</span>}
                </div>
                <span style={styles.agreeText}>我已阅读并同意以上须知</span>
              </motion.div>
              <motion.button
                style={{
                  ...styles.confirmBtn,
                  ...(rulesAccepted ? {} : styles.confirmBtnDisabled),
                }}
                onClick={handlePayConfirm}
                disabled={!rulesAccepted || paying}
                whileTap={rulesAccepted && !paying ? { scale: 0.97, opacity: 0.85 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {paying ? '支付中...' : `确认支付 ¥${order.price}`}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  placeholder: {
    width: '24px',
  },
  countdownBar: {
    backgroundColor: 'rgba(255,107,157,0.15)',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: '13px',
    color: COLORS.primary,
  },
  countdownTime: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  orderSummary: {
    backgroundColor: COLORS.card,
    margin: '16px',
    borderRadius: '12px',
    padding: '4px 0',
    border: `1px solid ${COLORS.border}`,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: '14px',
    color: COLORS.text,
  },
  section: {
    padding: '16px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  methodItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
    border: `2px solid transparent`,
  },
  methodActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255,107,157,0.1)',
  },
  methodLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  methodIcon: {
    fontSize: '24px',
  },
  methodName: {
    fontSize: '15px',
    color: COLORS.text,
  },
  methodRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  recommendTag: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  radio: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: `2px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
  },
  amountSection: {
    padding: '20px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    marginTop: '10px',
  },
  amountLabel: {
    fontSize: '15px',
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bottomBar: {
    padding: '16px',
  },
  payBtn: {
    width: '100%',
    padding: '16px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
  },
  payBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  securityTip: {
    textAlign: 'center',
    fontSize: '11px',
    color: COLORS.textSecondary,
    padding: '0 20px 20px',
    margin: 0,
  },
  // 浮层
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 200,
  },
  bottomSheet: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: COLORS.card,
    borderRadius: '20px 20px 0 0',
    padding: '0 0 32px 0',
    zIndex: 201,
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  sheetHandle: {
    width: '40px',
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '2px',
    margin: '12px auto 0',
  },
  sheetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sheetTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: 0,
  },
  sheetClose: {
    fontSize: '18px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    padding: '4px',
  },
  rulesList: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  ruleItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '14px',
    border: `1px solid ${COLORS.border}`,
  },
  ruleTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  ruleIcon: {
    fontSize: '16px',
  },
  ruleTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ruleContent: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    lineHeight: '1.6',
    margin: 0,
  },
  agreeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px 16px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: `2px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  agreeText: {
    fontSize: '14px',
    color: COLORS.text,
  },
  confirmBtn: {
    display: 'block',
    width: 'calc(100% - 40px)',
    margin: '0 20px',
    padding: '16px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
  },
  confirmBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}

export default PaymentPage
