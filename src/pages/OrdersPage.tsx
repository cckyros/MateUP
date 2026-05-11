// ============================================================
// 订单页 - 重构后
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { getOrderList, cancelOrder, completeOrder } from '@/api/order'
import { listStagger, listItem } from '@/hooks'
import { OrderCard } from '@/components/order'
import { Badge } from '@/components/ui'
import type { Order } from '@/store/order/types'

// ============================================================
// Tab 选项
// ============================================================
const ORDER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'WAIT_ACCEPT', label: '待接单' },
  { key: 'IN_PROGRESS', label: '进行中' },
  { key: 'COMPLETED', label: '已完成' },
]

// ============================================================
// 主组件
// ============================================================
const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // ============================================================
  // 加载订单
  // ============================================================
  const loadOrders = async () => {
    try {
      const data = await getOrderList()
      setOrders(data.data?.orders || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // ============================================================
  // 操作
  // ============================================================
  const handleCancel = async (orderId: string) => {
    if (!confirm('确认取消订单？')) return
    try {
      await cancelOrder(orderId)
      loadOrders()
    } catch (err) {
      alert((err as any)?.response?.data?.message || '取消失败')
    }
  }

  const handleComplete = async (orderId: string) => {
    try {
      await completeOrder(orderId)
      loadOrders()
    } catch (err) {
      alert((err as any)?.response?.data?.message || '操作失败')
    }
  }

  // ============================================================
  // 筛选
  // ============================================================
  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders
    return orders.filter(o => o.status === activeTab)
  }

  const filteredOrders = getFilteredOrders()

  // ============================================================
  // 统计数据
  // ============================================================
  const stats = {
    total: '¥4,472',
    settled: '¥3,842',
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    monthComplete: orders.filter(o => o.status === 'COMPLETED').length,
  }

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>我的订单</span>
        <span
          style={styles.headerRight}
          onClick={() => navigate('/notifications')}
        >
          🔔
        </span>
      </div>

      {/* 统计卡片 */}
      <div style={styles.statsCard}>
        <div style={styles.statsLeft}>
          <span style={styles.statsLabel}>总收益</span>
          <span style={styles.statsValue}>{stats.total}</span>
          <span style={styles.statsSub}>已结算 {stats.settled}</span>
        </div>
        <div style={styles.statsRight}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>进行中</span>
            <span style={styles.statValue}>{stats.inProgress}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>本月完成</span>
            <span style={styles.statValue}>{stats.monthComplete}</span>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={styles.tabBar}>
        {ORDER_TABS.map(tab => (
          <div
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 订单列表 */}
      <motion.div
        style={styles.orderList}
        variants={listStagger(0.06, 0.08)}
        initial="hidden"
        animate="show"
      >
        {loading ? (
          <div style={styles.empty}>
            <span style={{ color: COLORS.textSecondary }}>加载中...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div style={styles.empty} variants={listItem}>
            <span style={styles.emptyIcon}>📋</span>
            <p style={styles.emptyText}>暂无订单</p>
          </motion.div>
        ) : (
          filteredOrders.map(order => (
            <motion.div key={order.id} variants={listItem}>
              <OrderCard
                order={order}
                onCancel={handleCancel}
                onComplete={handleComplete}
              />
            </motion.div>
          ))
        )}
      </motion.div>
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
    paddingBottom: '70px',
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  headerRight: {
    fontSize: 20,
    cursor: 'pointer',
  },
  statsCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    margin: 12,
    borderRadius: 16,
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
  },
  statsLeft: {
    borderRight: '1px solid rgba(255,255,255,0.3)',
    paddingRight: 16,
  },
  statsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statsValue: {
    display: 'block',
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  statsSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRight: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 6,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    fontSize: 12,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  tabBar: {
    backgroundColor: COLORS.card,
    display: 'flex',
    padding: '0 12px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    flex: 1,
    textAlign: 'center' as const,
    padding: '12px 0',
    fontSize: 14,
    color: COLORS.textSecondary,
    cursor: 'pointer',
    borderBottom: '2px solid transparent' as const,
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  orderList: {
    padding: 12,
  },
  empty: {
    textAlign: 'center' as const,
    padding: '60px 0',
  },
  emptyIcon: {
    fontSize: 48,
    display: 'block',
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
}

export default OrdersPage