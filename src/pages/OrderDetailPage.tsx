// ============================================================
// 订单详情页 - 重构后
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { getOrderDetail, cancelOrder, completeOrder } from '@/api/order'
import { Header } from '@/components/layout/Header'
import { OrderStatusBadge } from '@/components/order'
import { Modal, Button } from '@/components/ui'
import OrderRating from '@/components/OrderRating'

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

// ============================================================
// 主组件
// ============================================================
const OrderDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [rated, setRated] = useState(false)

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

  // ============================================================
  // 操作
  // ============================================================
  const handleCancel = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await cancelOrder(order.id)
      const updated = await getOrderDetail(order.id)
      setOrder(updated)
      setShowCancelModal(false)
    } catch (err) {
      alert((err as any)?.response?.data?.message || '取消失败')
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
      alert((err as any)?.response?.data?.message || '操作失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRate = async ({ rating, comment }: { rating: number; comment: string }) => {
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
      alert((err as any)?.response?.data?.message || '评价失败')
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
        <span style={{ color: COLORS.textSecondary, fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('/home')}>
          返回首页
        </span>
      </div>
    )
  }

  const gameName = GAME_NAMES[order.game] || order.game || '游戏'
  const unitPrice = order.duration > 0 ? Math.round(order.price / order.duration) : order.price

  return (
    <div style={styles.container}>
      <Header
        title="订单详情"
        onBack={() => navigate(-1)}
        right={<span style={{ fontSize: 20 }}>⋮</span>}
      />

      {/* 状态卡片 */}
      <div style={styles.statusCard}>
        <OrderStatusBadge status={order.status} />
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
          <motion.div
            style={styles.chatIconBtn}
            onClick={() => navigate('/chat')}
            whileTap={{ scale: 0.88, opacity: 0.8 }}
          >
            💬
          </motion.div>
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
          <Button
            variant="outline"
            size="lg"
            onTap={() => setShowCancelModal(true)}
            style={{ flex: 1 }}
          >
            取消订单
          </Button>
        )}
        {order.status === 'IN_PROGRESS' && (
          <Button
            variant="primary"
            size="lg"
            onTap={() => navigate('/chat')}
            style={{ flex: 1 }}
          >
            💬 联系陪玩
          </Button>
        )}
        {order.status === 'COMPLETED' && (
          <>
            {!rated && (
              <Button
                variant="secondary"
                size="lg"
                onTap={() => setShowRating(true)}
                style={{ flex: 1 }}
              >
                ⭐ 立即评价
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              onTap={() => navigate('/home')}
              style={{ flex: 1 }}
            >
              再次预约
            </Button>
          </>
        )}
      </div>

      {/* 取消弹窗 */}
      <Modal
        visible={showCancelModal}
        title="确认取消订单？"
        description="取消后将退还全部金额"
        confirmText="确认取消"
        cancelText="暂不取消"
        loading={actionLoading}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
      />

      {/* 评价弹窗 */}
      {showRating && (
        <OrderRating
          orderId={order.id}
          playerName={order.playerName}
          onSubmit={handleRate}
          onClose={() => setShowRating(false)}
        />
      )}
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
    paddingBottom: '80px',
  },
  statusCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  section: {
    padding: 16,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  boosterCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: `1px solid ${COLORS.border}`,
  },
  boosterAvatar: {
    fontSize: 48,
  },
  boosterInfo: {
    flex: 1,
  },
  boosterName: {
    display: 'block',
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  boosterLevel: {
    display: 'block',
    fontSize: 12,
    color: '#FFD700',
  },
  chatIconBtn: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,107,157,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    cursor: 'pointer',
  },
  infoGrid: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    border: `1px solid ${COLORS.border}`,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    margin: '12px 0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
  },
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: 12,
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
}

export default OrderDetailPage