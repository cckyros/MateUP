// 支付页 - 已接入真实 API
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { COLORS } from '../constants'
import { getOrderDetail, payOrder } from '../api/order'
import { Styles } from '@/utils/styles'

// 游戏中文名映射
const GAME_NAMES = {
  honor: '王者荣耀',
  apex: '和平精英',
  lol: '英雄联盟',
  yongjie: '永劫无间',
  danzai: '蛋仔派对',
}

const PaymentPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('mock') // mock支付
  const [countdown, setCountdown] = useState(15 * 60)

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
      } catch {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePay = async () => {
    if (!order || paying) return
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
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
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
        <span style={styles.amountValue}>¥{order.price}</span>
      </div>

      {/* 支付按钮 */}
      <div style={styles.bottomBar}>
        <button
          style={{ ...styles.payBtn, ...(paying ? styles.payBtnDisabled : {}) }}
          onClick={handlePay}
          disabled={paying}
        >
          {paying ? '支付中...' : `确认支付 ¥${order.price}`}
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
}

export default PaymentPage
