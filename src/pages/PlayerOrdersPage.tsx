// 陪玩师订单页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '@/constants'
import { usePlayerProfileStore } from '@/store'
import { getPlayerOrders } from '@/api/playerApi'
import { acceptOrder, rejectOrder, completeOrder } from '@/api/order'
import { styles } from './PlayerOrdersPage.styles'

const TABS = [
  { key: 'WAIT_ACCEPT', label: '待接单' },
  { key: 'IN_PROGRESS', label: '进行中' },
  { key: 'COMPLETED', label: '已完成' },
  { key: 'CANCELLED', label: '已取消' },
]

export default function PlayerOrdersPage() {
  const navigate = useNavigate()
  const { orders, setOrders, updateOrderStatus } = usePlayerProfileStore()
  const [activeTab, setActiveTab] = useState('WAIT_ACCEPT')

  useEffect(() => {
    getPlayerOrders().then((res) => setOrders(res.orders)).catch(() => {})
  }, [])

  const filtered = orders.filter((o) => o.status === activeTab)

  const handleAction = async (orderId, action) => {
    if (action === 'accept') {
      await acceptOrder(orderId)
      updateOrderStatus(orderId, 'IN_PROGRESS')
    } else {
      await rejectOrder(orderId)
      updateOrderStatus(orderId, 'CANCELLED')
    }
  }

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>我的订单</span>
        <span style={{ width: '24px' }} />
      </div>

      {/* Tab切换 */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <div
            key={tab.key}
            style={{
              ...styles.tab,
              borderBottom: activeTab === tab.key ? `2px solid ${COLORS.primary}` : 'none',
              color: activeTab === tab.key ? COLORS.primary : COLORS.textSecondary,
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {orders.filter((o) => o.status === tab.key).length > 0 && (
              <span style={{
                ...styles.tabBadge,
                backgroundColor: tab.key === 'WAIT_ACCEPT' ? COLORS.error : COLORS.primary,
              }}>
                {orders.filter((o) => o.status === tab.key).length}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 订单列表 */}
      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>📭</span>
            <p style={styles.emptyText}>暂无{ORDER_STATUS_TEXT[activeTab]}订单</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>订单 #{order.id.slice(-6)}</span>
                <span style={{
                  ...styles.statusTag,
                  backgroundColor: `${ORDER_STATUS_COLOR[order.status]}22`,
                  color: ORDER_STATUS_COLOR[order.status],
                }}>
                  {ORDER_STATUS_TEXT[order.status]}
                </span>
              </div>

              <div style={styles.orderBody}>
                <img src={order.userAvatar} style={styles.avatar} alt="" />
                <div style={styles.orderInfo}>
                  <p style={styles.userName}>{order.userName}</p>
                  <p style={styles.orderMeta}>
                    {order.game} · {order.duration}小时陪玩
                  </p>
                  {order.remark && (
                    <p style={styles.remark}>备注：{order.remark}</p>
                  )}
                </div>
                <div style={styles.priceBlock}>
                  <span style={styles.price}>¥{order.price}</span>
                </div>
              </div>

              {order.status === 'WAIT_ACCEPT' && (
                <div style={styles.actionRow}>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleAction(order.id, 'reject')}
                  >
                    婉拒
                  </button>
                  <button
                    style={styles.acceptBtn}
                    onClick={() => handleAction(order.id, 'accept')}
                  >
                    接单
                  </button>
                </div>
              )}

              {order.status === 'IN_PROGRESS' && (
                <div style={styles.actionRow}>
                  <button
                    style={styles.completeBtn}
                    onClick={() => {
                      completeOrder(order.id)
                      updateOrderStatus(order.id, 'COMPLETED')
                    }}
                  >
                    完成订单
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

