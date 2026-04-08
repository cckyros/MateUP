// 订单详情页 - 已接入真实 API
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '../constants'
import { getOrderDetail, cancelOrder, completeOrder } from '../api/order'
import OrderRating from '../components/OrderRating'
import { Styles } from '@/utils/styles'

const STATUS_MAP = {
  CREATED: { label: '待支付', color: '#FFD700', desc: '请在规定时间内完成支付' },
  WAIT_ACCEPT: { label: '待接单', color: '#FFD700', desc: '陪玩师还未接单，可取消订单' },
  IN_PROGRESS: { label: '进行中', color: COLORS.primary, desc: '陪玩进行中，请耐心等待' },
  COMPLETED: { label: '已完成', color: COLORS.success, desc: '订单已完成，感谢使用伴游' },
  CANCELLED: { label: '已取消', color: COLORS.textSecondary, desc: '订单已取消' },
}

const GAME_NAMES = {
  honor: '王者荣耀',
  apex: '和平精英',
  lol: '英雄联盟',
  yongjie: '永劫无间',
  danzai: '蛋仔派对',
}

const OrderDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rated, setRated] = useState(false) // 追踪是否已评价

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

  const handleCancel = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await cancelOrder(order.id)
      const updated = await getOrderDetail(order.id)
      setOrder(updated)
      setShowCancelModal(false)
    } catch (err) {
      alert(err?.response?.data?.message || '取消失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await completeOrder(order.id)
      const updated = await getOrderDetail(order.id)
      setOrder(updated)
    } catch (err) {
      alert(err?.response?.data?.message || '操作失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRate = async ({ rating, comment }) => {
    setShowRating(false)
    setRated(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://192.168.3.14:3000/api/order/${order.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      })
      const updated = await getOrderDetail(order.id)
      setOrder(updated)
    } catch (err) {
      alert(err?.response?.data?.message || '评价失败')
    }
  }

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

  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: COLORS.textSecondary, desc: '' }
  const gameName = GAME_NAMES[order.game] || order.game || '游戏'
  const unitPrice = order.duration > 0 ? Math.round(order.price / order.duration) : order.price

  return (
    <div style={styles.container}>
      {/* 顶部返回 */}
      <div style={styles.header}>
        <motion.span
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.85, opacity: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          ←
        </motion.span>
        <span style={styles.headerTitle}>订单详情</span>
        <span style={styles.moreBtn}>⋮</span>
      </div>

      {/* 状态卡片 */}
      <div style={styles.statusCard}>
        <div style={styles.statusIcon}>
          {order.status === 'WAIT_ACCEPT' && '⏳'}
          {order.status === 'IN_PROGRESS' && '🎮'}
          {order.status === 'COMPLETED' && '✅'}
          {order.status === 'CANCELLED' && '❌'}
          {order.status === 'CREATED' && '💳'}
        </div>
        <div style={styles.statusInfo}>
          <span style={{ ...styles.statusText, color: statusInfo.color }}>
            {statusInfo.label}
          </span>
          <span style={styles.statusDesc}>{statusInfo.desc}</span>
        </div>
      </div>

      {/* 陪玩师信息 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>陪玩师</h3>
        <div style={styles.boosterCard}>
          <div style={styles.boosterAvatar}>💫</div>
          <div style={styles.boosterInfo}>
            <span style={styles.boosterName}>{order.playerName}</span>
            <span style={styles.boosterLevel}>陪玩师</span>
          </div>
          <div style={styles.boosterActions}>
            <motion.div
              style={styles.chatBtn}
              onClick={() => navigate('/chat')}
              whileTap={{ scale: 0.88, opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              💬
            </motion.div>
          </div>
        </div>
      </div>

      {/* 订单信息 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>订单信息</h3>
        <div style={styles.infoGrid}>
          {[
            { label: '订单编号', value: order.id },
            { label: '游戏', value: gameName },
            { label: '陪玩时长', value: `${order.duration}小时` },
            { label: '下单时间', value: new Date(order.createTime).toLocaleString('zh-CN') },
            ...(order.remark ? [{ label: '备注', value: order.remark }] : []),
          ].map((item, i) => (
            <div key={i} style={styles.infoRow}>
              <span style={styles.infoLabel}>{item.label}</span>
              <span style={styles.infoValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 费用明细 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>费用明细</h3>
        <div style={styles.priceCard}>
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>单价</span>
            <span style={styles.priceText}>¥{unitPrice}/小时 × {order.duration}小时</span>
          </div>
          <div style={styles.priceDivider} />
          <div style={styles.priceRow}>
            <span style={styles.totalLabel}>应付总额</span>
            <span style={styles.totalValue}>¥{order.price}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={styles.bottomBar}>
        {order.status === 'WAIT_ACCEPT' && (
          <>
            <motion.div
              style={styles.cancelBtn}
              onClick={() => setShowCancelModal(true)}
              whileTap={{ scale: 0.95, opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              取消订单
            </motion.div>
          </>
        )}
        {order.status === 'IN_PROGRESS' && (
          <motion.div
            style={styles.chatMainBtn}
            onClick={() => navigate('/chat')}
            whileTap={{ scale: 0.95, opacity: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            💬 联系陪玩
          </motion.div>
        )}
        {order.status === 'COMPLETED' && (
          <>
            {!rated && (
              <motion.div
                style={styles.rateBtn}
                onClick={() => setShowRating(true)}
                whileTap={{ scale: 0.95, opacity: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                ⭐ 立即评价
              </motion.div>
            )}
            <motion.div
              style={styles.reOrderBtn}
              onClick={() => navigate('/home')}
              whileTap={{ scale: 0.95, opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              再次预约
            </motion.div>
          </>
        )}
      </div>

      {/* 取消弹窗 */}
      {showCancelModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>确认取消订单？</h3>
            <p style={styles.modalDesc}>取消后将退还全部金额</p>
            <div style={styles.modalBtns}>
              <div style={styles.modalCancel} onClick={() => setShowCancelModal(false)}>暂不取消</div>
              <div
                style={{ ...styles.modalConfirm, ...(actionLoading ? { opacity: 0.6 } : {}) }}
                onClick={actionLoading ? undefined : handleCancel}
              >
                {actionLoading ? '取消中...' : '确认取消'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 评价弹窗 */}
      {showRating && (
        <OrderRating
          orderId={order.id}
          playerName={order.playerName}
          onSubmit={handleRate}
          onClose={() => setShowRating(false)}
        />
      )}

      {/* 取消弹窗 */}
      {showCancelModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>确认取消订单？</h3>
            <p style={styles.modalDesc}>取消后将退还全部金额</p>
            <div style={styles.modalBtns}>
              <div style={styles.modalCancel} onClick={() => setShowCancelModal(false)}>暂不取消</div>
              <div
                style={{ ...styles.modalConfirm, ...(actionLoading ? { opacity: 0.6 } : {}) }}
                onClick={actionLoading ? undefined : handleCancel}
              >
                {actionLoading ? '取消中...' : '确认取消'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== 暗色风格 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '80px',
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
  moreBtn: {
    fontSize: '20px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  statusCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    margin: '16px',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statusIcon: {
    fontSize: '40px',
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '4px',
  },
  statusDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  boosterCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    border: `1px solid ${COLORS.border}`,
  },
  boosterAvatar: {
    fontSize: '48px',
  },
  boosterInfo: {
    flex: 1,
  },
  boosterName: {
    display: 'block',
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '4px',
  },
  boosterLevel: {
    display: 'block',
    fontSize: '12px',
    color: '#FFD700',
    marginBottom: '2px',
  },
  boosterRating: {
    fontSize: '13px',
    color: '#FFD700',
  },
  boosterActions: {
    display: 'flex',
    gap: '10px',
  },
  chatBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,107,157,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
  },
  callBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(76,175,80,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
  },
  infoGrid: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '4px 0',
    border: `1px solid ${COLORS.border}`,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  infoLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: '14px',
    color: COLORS.text,
  },
  priceCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  priceLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  priceDivider: {
    height: '1px',
    backgroundColor: COLORS.border,
    margin: '12px 0',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: '15px',
    cursor: 'pointer',
  },
  editBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.text,
    textAlign: 'center',
    fontSize: '15px',
    cursor: 'pointer',
  },
  chatMainBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
    border: 'none',
  },
  reOrderBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    backgroundColor: COLORS.primary,
    color: '#fff',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
  rateBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${COLORS.warning} 0%, #ff9500 100%)`,
    color: '#fff',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    boxShadow: `0 4px 15px ${COLORS.warning}40`,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '24px',
    margin: '20px',
    maxWidth: '300px',
    width: '100%',
    border: `1px solid ${COLORS.border}`,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    margin: '0 0 10px 0',
  },
  modalDesc: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    textAlign: 'center',
    margin: '0 0 20px 0',
  },
  modalBtns: {
    display: 'flex',
    gap: '12px',
  },
  modalCancel: {
    flex: 1,
    padding: '12px',
    borderRadius: '20px',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: '14px',
    cursor: 'pointer',
  },
  modalConfirm: {
    flex: 1,
    padding: '12px',
    borderRadius: '20px',
    backgroundColor: COLORS.primary,
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
}

export default OrderDetailPage
