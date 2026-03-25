// 支付页 - 已统一暗色风格
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const PaymentPage = () => {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState('wechat')
  const [countdown, setCountdown] = useState(15 * 60)

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const order = {
    id: 'PG20260324002',
    amount: 160,
    booster: '小美',
    game: '王者荣耀',
    duration: 2,
  }

  const paymentMethods = [
    { id: 'wechat', name: '微信支付', icon: '💳', desc: '推荐' },
    { id: 'alipay', name: '支付宝', icon: '💰', desc: '' },
    { id: 'bank', name: '银行卡', icon: '🏦', desc: '' },
  ]

  const handlePay = () => {
    alert('支付成功！')
    navigate('/orders')
  }

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
        <span style={styles.headerTitle}>订单支付</span>
        <span style={styles.placeholder} />
      </div>

      {/* 倒计时 */}
      <div style={styles.countdownBar}>
        <span style={styles.countdownLabel}>剩余支付时间</span>
        <span style={styles.countdownTime}>{formatTime(countdown)}</span>
      </div>

      {/* 订单摘要 */}
      <div style={styles.orderSummary}>
        {[
          { label: '订单编号', value: order.id },
          { label: '陪玩师', value: order.booster },
          { label: '游戏', value: order.game },
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
          <div
            key={method.id}
            style={{
              ...styles.methodItem,
              ...(selectedMethod === method.id ? styles.methodActive : {}),
            }}
            onClick={() => setSelectedMethod(method.id)}
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
          </div>
        ))}
      </div>

      {/* 支付金额 */}
      <div style={styles.amountSection}>
        <span style={styles.amountLabel}>支付金额</span>
        <span style={styles.amountValue}>¥{order.amount}</span>
      </div>

      {/* 支付按钮 */}
      <div style={styles.bottomBar}>
        <button style={styles.payBtn} onClick={handlePay}>
          确认支付 ¥{order.amount}
        </button>
      </div>

      {/* 安全提示 */}
      <p style={styles.securityTip}>
        🔒 支付安全由伴游平台保障，请勿泄露支付密码
      </p>
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
  securityTip: {
    textAlign: 'center',
    fontSize: '11px',
    color: COLORS.textSecondary,
    padding: '0 20px 20px',
    margin: 0,
  },
}

export default PaymentPage
