// 陪玩师订单页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../constants'
import { usePlayerProfileStore } from '../store'
import { playerApi } from '../api'
import { ordersApi } from '../api'
import { Styles } from '@/utils/styles'

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
    playerApi.getPlayerOrders().then((res: any) => setOrders(res.orders || [])).catch(() => {})
  }, [])

  const filtered = orders.filter((o) => o.status === activeTab)

  const handleAction = async (orderId, action) => {
    if (action === 'accept') {
      await ordersApi.acceptOrder(orderId)
      updateOrderStatus(orderId, 'IN_PROGRESS')
    } else {
      await ordersApi.rejectOrder(orderId)
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

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  back: {
    fontSize: '24px',
    color: COLORS.text,
    cursor: 'pointer',
  },
  navTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabBar: {
    display: 'flex',
    backgroundColor: COLORS.card,
    padding: '0 8px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    padding: '14px 0',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  tabBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
    color: '#fff',
  },
  list: {
    padding: '12px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    border: `1px solid ${COLORS.border}`,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderId: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  statusTag: {
    fontSize: '12px',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  orderBody: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  orderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  orderMeta: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  remark: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: '4px 0 0 0',
    fontStyle: 'italic',
  },
  priceBlock: {
    textAlign: 'right',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  acceptBtn: {
    padding: '8px 24px',
    backgroundColor: COLORS.success,
    border: 'none',
    borderRadius: '18px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '8px 24px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '18px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  completeBtn: {
    padding: '8px 24px',
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '18px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
  },
}
