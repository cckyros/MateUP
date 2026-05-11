// ============================================================
// 支付页 - 重构后
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { getOrderDetail, payOrder } from '@/api/order'
import { Header } from '@/components/layout/Header'
import { Button, BottomSheet } from '@/components/ui'
import { useCountdown } from '@/hooks'

// ============================================================
// 常量
// ============================================================
const GAME_NAMES: Record<string, string> = {
  honor: '王者荣耀',
  apex: '和平精英',
  lol: '英雄联盟',
  yongjie: '永劫无间',
  danzai: '蛋仔派对',
}

const ORDER_RULES = [
  { icon: '💰', title: '退款规则', content: '支付后如需退款，请提前1小时联系客服。开始陪玩后不支持退款，因陪玩师原因导致无法服务可全额退款。' },
  { icon: '⏰', title: '服务时间', content: '陪玩服务严格按预约时长进行，超时费用需额外支付。如陪玩师迟到超过10分钟，可联系客服处理。' },
  { icon: '🚫', title: '取消政策', content: '支付后5分钟内可免费取消。超过5分钟取消将收取50%费用作为陪玩师空档补偿。' },
  { icon: '✅', title: '服务确认', content: '服务完成后请在订单页确认完成，如服务期间遇到问题请保留凭证并第一时间联系客服。' },
  { icon: '🔒', title: '隐私保护', content: '请勿向陪玩师透露账号密码、支付信息等敏感内容，一切交易通过平台进行。' },
]

const PAYMENT_METHODS = [
  { id: 'mock', name: '模拟支付', icon: '💳', desc: '测试用' },
]

// ============================================================
// 主组件
// ============================================================
const PaymentPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('mock')
  const [showRules, setShowRules] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const { countdown } = useCountdown(15 * 60)

  // ============================================================
  // 加载订单
  // ============================================================
  useEffect(() => {
    if (!id) { setLoading(false); return }
    const load = async () => {
      try {
        const data = await getOrderDetail(id)
        setOrder(data)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // ============================================================
  // 支付
  // ============================================================
  const handlePayClick = () => {
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
      alert((err as any)?.response?.data?.message || '支付失败')
    } finally {
      setPaying(false)
    }
  }

  // ============================================================
  // 渲染
  // ============================================================
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: COLORS.textSecondary }}>加载中...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12 }}>
        <span style={{ color: COLORS.error }}>订单不存在</span>
        <span style={{ color: COLORS.textSecondary, fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('/home')}>返回首页</span>
      </div>
    )
  }

  const gameName = GAME_NAMES[order.game] || order.game || '游戏'

  return (
    <div style={styles.container}>
      <Header
        title="订单支付"
        onBack={() => navigate(-1)}
      />

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
        {PAYMENT_METHODS.map(method => (
          <motion.div
            key={method.id}
            style={{
              ...styles.methodItem,
              ...(selectedMethod === method.id ? styles.methodActive : {}),
            }}
            onClick={() => setSelectedMethod(method.id)}
            whileTap={{ scale: 0.98 }}
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

      {/* 底部 */}
      <div style={styles.bottomBar}>
        <Button
          variant="primary"
          size="lg"
          loading={paying}
          onTap={handlePayClick}
          style={{ width: '100%' }}
        >
          {paying ? '支付中...' : `确认支付 ¥${order.price}`}
        </Button>
      </div>

      <p style={styles.securityTip}>🔒 支付安全由伴游平台保障，请勿泄露支付密码</p>

      {/* 下单须知浮层 */}
      <BottomSheet
        visible={showRules}
        title="📋 下单须知"
        onClose={() => { setShowRules(false); setRulesAccepted(false) }}
      >
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
        >
          <div style={{
            ...styles.checkbox,
            ...(rulesAccepted ? styles.checkboxChecked : {}),
          }}>
            {rulesAccepted && <span style={styles.checkmark}>✓</span>}
          </div>
          <span style={styles.agreeText}>我已阅读并同意以上须知</span>
        </motion.div>

        <Button
          variant="primary"
          size="lg"
          loading={paying}
          disabled={!rulesAccepted}
          onTap={handlePayConfirm}
          style={{ width: 'calc(100% - 40px)', margin: '0 20px 16px' }}
        >
          {paying ? '支付中...' : `确认支付 ¥${order.price}`}
        </Button>
      </BottomSheet>
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
  countdownBar: {
    backgroundColor: 'rgba(255,107,157,0.15)',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 13,
    color: COLORS.primary,
  },
  countdownTime: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  orderSummary: {
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  methodItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    cursor: 'pointer',
    border: '2px solid transparent' as const,
  },
  methodActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255,107,157,0.1)',
  },
  methodLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodName: {
    fontSize: 15,
    color: COLORS.text,
  },
  methodRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  recommendTag: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 4,
  },
  radio: {
    width: 22,
    height: 22,
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
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
  },
  amountSection: {
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    marginTop: 10,
  },
  amountLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
  },
  bottomBar: {
    padding: 16,
  },
  securityTip: {
    textAlign: 'center' as const,
    fontSize: 11,
    color: COLORS.textSecondary,
    padding: '0 20px 20px',
    margin: 0,
  },
  rulesList: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  ruleItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    border: `1px solid ${COLORS.border}`,
  },
  ruleTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ruleIcon: {
    fontSize: 16,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  ruleContent: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },
  agreeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px 16px',
    cursor: 'pointer',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
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
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  agreeText: {
    fontSize: 14,
    color: COLORS.text,
  },
}

export default PaymentPage