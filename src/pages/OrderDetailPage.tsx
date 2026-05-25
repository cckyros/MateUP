import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS, GAME_NAMES } from '@/constants'
import { getOrderDetail, cancelOrder, completeOrder, rateOrder } from '@/api/order'
import { OrderRating } from '@/components'
import { SPRING, backButtonProps } from '@/utils/animations'
import { styles } from './OrderDetailPage.styles'

const STATUS_MAP: Record<string, { label: string; color: string; desc: string }> = {
  CREATED: { label: '待支付', color: '#FFD700', desc: '请在规定时间内完成支付' },
  WAIT_ACCEPT: { label: '待接单', color: '#FFD700', desc: '陪玩师还未接单，可取消订单' },
  IN_PROGRESS: { label: '进行中', color: COLORS.primary, desc: '陪玩进行中，请耐心等待' },
  COMPLETED: { label: '已完成', color: COLORS.success, desc: '订单已完成，感谢使用伴游' },
  CANCELLED: { label: '已取消', color: COLORS.textSecondary, desc: '订单已取消' },
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
      } catch (err) {
        console.error('[OrderDetail] 加载订单详情失败:', err)
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

  const handleRate = async ({ rating, comment }: { rating: number; comment: string }) => {
    setShowRating(false)
    setRated(true)
    try {
      await rateOrder(order.id, rating, comment)
      const updated = await getOrderDetail(order.id)
      setOrder(updated)
    } catch (err) {
      console.error('[OrderDetail] 评价失败:', err)
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
          transition={SPRING.tactile}
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
              transition={SPRING.tactile}
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
              transition={SPRING.tactile}
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
            transition={SPRING.tactile}
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
                transition={SPRING.tactile}
              >
                ⭐ 立即评价
              </motion.div>
            )}
            <motion.div
              style={styles.reOrderBtn}
              onClick={() => navigate('/home')}
              whileTap={{ scale: 0.95, opacity: 0.85 }}
              transition={SPRING.tactile}
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


export default OrderDetailPage
