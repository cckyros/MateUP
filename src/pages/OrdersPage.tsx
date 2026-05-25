import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS, GAME_NAMES, ORDER_TABS } from '@/constants'
import { getOrderList, cancelOrder, completeOrder } from '@/api/order'
import { styles } from './OrdersPage.styles'
import { listStagger, listItem, SPRING } from '@/utils/animations'
import { ListSkeleton } from '@/components'
import { formatRelativeTime } from '@/utils/formatTime'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  CREATED: { label: '待支付', color: '#FFD700' },
  WAIT_ACCEPT: { label: '待接单', color: '#FFD700' },
  IN_PROGRESS: { label: '进行中', color: COLORS.primary },
  COMPLETED: { label: '已完成', color: COLORS.success },
  CANCELLED: { label: '已取消', color: COLORS.textSecondary },
}

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('全部')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      const data = await getOrderList()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('[Orders] 加载订单失败:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCancel = async (orderId) => {
    if (!confirm('确认取消订单？')) return
    try {
      await cancelOrder(orderId)
      loadOrders()
    } catch (err) {
      alert(err?.response?.data?.message || '取消失败')
    }
  }

  const handleComplete = async (orderId) => {
    try {
      await completeOrder(orderId)
      loadOrders()
    } catch (err) {
      alert(err?.response?.data?.message || '操作失败')
    }
  }

  const getFilteredOrders = () => {
    let result = orders
    if (activeTab === '待接单') result = result.filter(o => o.status === 'WAIT_ACCEPT')
    else if (activeTab === '进行中') result = result.filter(o => o.status === 'IN_PROGRESS')
    else if (activeTab === '已完成') result = result.filter(o => o.status === 'COMPLETED')
    return result
  }

  const getStatusInfo = (status) => STATUS_MAP[status] || { label: status, color: COLORS.textSecondary }
  const getGameName = (game) => GAME_NAMES[game] || game || '游戏'

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>我的订单</span>
        <span style={styles.headerRight} onClick={() => navigate('/notifications')}>🔔</span>
      </div>

      {/* 统计卡片 */}
      <div style={styles.statsCard}>
        <div style={styles.statsLeft}>
          <span style={styles.statsLabel}>总收益</span>
          <span style={styles.statsValue}>¥4,472</span>
          <span style={styles.statsSub}>已结算 ¥3,842</span>
        </div>
        <div style={styles.statsRight}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>进行中</span>
            <span style={styles.statValue}>1</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>本月完成</span>
            <span style={styles.statValue}>12</span>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={styles.tabBar}>
        {ORDER_TABS.map(tab => (
          <div
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 订单列表 */}
      <motion.div
        style={styles.orderList}
        variants={listStagger(0.06, 0.08)}
        initial="initial"
        animate="animate"
      >
        {loading ? (
          <ListSkeleton count={4} />
        ) : getFilteredOrders().length === 0 ? (
          <motion.div style={styles.empty} variants={listItem}>
            <span style={styles.emptyIcon}>📋</span>
            <p style={styles.emptyText}>暂无订单</p>
          </motion.div>
        ) : (
          getFilteredOrders().map(order => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <motion.div
                key={order.id}
                style={styles.orderCard}
                onClick={() => navigate(`/order-detail/${order.id}`)}
                variants={listItem}
                whileHover={{ scale: 1.01, boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING.snappy}
              >
                <div style={styles.orderTop}>
                  <span style={styles.gameTag}>
                    {getGameName(order.game)}
                  </span>
                  <span style={{ ...styles.orderStatus, color: statusInfo.color }}>
                    {statusInfo.label}
                  </span>
                </div>

                <div style={styles.boosterInfo}>
                  <span style={styles.boosterAvatar}>💫</span>
                  <div style={styles.boosterDetail}>
                    <span style={styles.boosterName}>{order.playerName}</span>
                    <span style={styles.boostLevel}>{order.duration}小时</span>
                  </div>
                  <div style={styles.duration}>
                    <span style={styles.durationLabel}>时长</span>
                    <span style={styles.durationValue}>{order.duration}小时</span>
                  </div>
                </div>

                <div style={styles.orderBottom}>
                  <div style={styles.orderTime}>
                    <span>📅 {formatRelativeTime(order.createTime)}</span>
                  </div>
                  <div style={styles.orderPrice}>
                    <span style={styles.priceLabel}>总价</span>
                    <span style={styles.priceValue}>¥{order.price}</span>
                  </div>
                </div>

                <div style={styles.orderFooter}>
                  <span style={styles.orderId}>订单号: {order.id}</span>
                  <span style={styles.orderCreated}>{formatRelativeTime(order.createTime)}</span>
                </div>

                {order.status === 'WAIT_ACCEPT' && (
                  <div style={styles.actionBar}>
                    <motion.span
                      style={styles.cancelBtn}
                      onClick={(e) => { e.stopPropagation(); handleCancel(order.id) }}
                      whileTap={{ scale: 0.92, opacity: 0.7 }}
                      transition={SPRING.tactile}
                    >
                      取消订单
                    </motion.span>
                  </div>
                )}
                {order.status === 'IN_PROGRESS' && (
                  <div style={styles.actionBar}>
                    <motion.span
                      style={styles.finishBtn}
                      onClick={(e) => { e.stopPropagation(); handleComplete(order.id) }}
                      whileTap={{ scale: 0.92, opacity: 0.8 }}
                      transition={SPRING.tactile}
                    >
                      确认完成
                    </motion.span>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}


export default OrdersPage
