// 订单页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const orderTabs = ['全部', '待接单', '进行中', '已完成']

const mockOrders = [
  {
    id: 'PG20260324001',
    status: '进行中',
    statusColor: COLORS.primary,
    type: '王者荣耀',
    booster: '小美',
    boosterAvatar: '👩',
    level: '星耀3 → 星耀2',
    duration: '2小时',
    price: '¥80.00',
    time: '今天 14:00 开始',
    created: '30分钟前',
    gameIcon: '🎮',
  },
  {
    id: 'PG20260324002',
    status: '待接单',
    statusColor: '#FFD700',
    type: '和平精英',
    booster: '待分配',
    boosterAvatar: '⏳',
    level: '黄金 → 铂金',
    duration: '3小时',
    price: '¥120.00',
    time: '明天 20:00',
    created: '1小时前',
    gameIcon: '🔫',
  },
  {
    id: 'PG20260323003',
    status: '已完成',
    statusColor: COLORS.success,
    type: '英雄联盟',
    booster: '阿杰',
    boosterAvatar: '👨',
    level: '钻石3 → 钻石2',
    duration: '4小时',
    price: '¥200.00',
    time: '昨天 已完成',
    created: '昨天 15:00',
    gameIcon: '⚔️',
  },
  {
    id: 'PG20260323004',
    status: '已完成',
    statusColor: COLORS.success,
    type: '王者荣耀',
    booster: '小林',
    boosterAvatar: '👩',
    level: '星耀1 → 王者',
    duration: '6小时',
    price: '¥350.00',
    time: '03-22 已完成',
    created: '03-22',
    gameIcon: '🎮',
  },
]

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('全部')

  const getFilteredOrders = () => {
    if (activeTab === '全部') return mockOrders
    if (activeTab === '待接单') return mockOrders.filter(o => o.status === '待接单')
    if (activeTab === '进行中') return mockOrders.filter(o => o.status === '进行中')
    if (activeTab === '已完成') return mockOrders.filter(o => o.status === '已完成')
    return mockOrders
  }

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
        {orderTabs.map(tab => (
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
      <div style={styles.orderList}>
        {getFilteredOrders().length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>📋</span>
            <p style={styles.emptyText}>暂无订单</p>
          </div>
        ) : (
          getFilteredOrders().map(order => (
            <div
              key={order.id}
              style={styles.orderCard}
              onClick={() => navigate(`/order-detail/${order.id}`)}
            >
              <div style={styles.orderTop}>
                <span style={styles.gameTag}>
                  <span style={styles.gameIcon}>{order.gameIcon}</span>
                  {order.type}
                </span>
                <span style={{ ...styles.orderStatus, color: order.statusColor }}>
                  {order.status}
                </span>
              </div>

              <div style={styles.boosterInfo}>
                <span style={styles.boosterAvatar}>{order.boosterAvatar}</span>
                <div style={styles.boosterDetail}>
                  <span style={styles.boosterName}>{order.booster}</span>
                  <span style={styles.boostLevel}>{order.level}</span>
                </div>
                <div style={styles.duration}>
                  <span style={styles.durationLabel}>时长</span>
                  <span style={styles.durationValue}>{order.duration}</span>
                </div>
              </div>

              <div style={styles.orderBottom}>
                <div style={styles.orderTime}>
                  <span>📅 {order.time}</span>
                </div>
                <div style={styles.orderPrice}>
                  <span style={styles.priceLabel}>总价</span>
                  <span style={styles.priceValue}>{order.price}</span>
                </div>
              </div>

              <div style={styles.orderFooter}>
                <span style={styles.orderId}>订单号: {order.id}</span>
                <span style={styles.orderCreated}>{order.created}</span>
              </div>

              {order.status === '待接单' && (
                <div style={styles.actionBar}>
                  <span style={styles.cancelBtn}>取消订单</span>
                  <span style={styles.editBtn}>修改需求</span>
                </div>
              )}
              {order.status === '进行中' && (
                <div style={styles.actionBar}>
                  <span style={styles.chatBtn}>💬 联系陪玩</span>
                  <span style={styles.finishBtn}>确认完成</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ========== 暗色风格样式 ==========
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
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  statsCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    margin: '12px',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
  },
  statsLeft: {
    borderRight: '1px solid rgba(255,255,255,0.3)',
    paddingRight: '16px',
  },
  statsLabel: {
    fontSize: '12px',
    opacity: 0.9,
    color: 'rgba(255,255,255,0.8)',
  },
  statsValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSub: {
    fontSize: '11px',
    opacity: 0.8,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '6px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    fontSize: '12px',
  },
  statLabel: {
    opacity: 0.9,
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontWeight: 'bold',
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
    textAlign: 'center',
    padding: '12px 0',
    fontSize: '14px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold',
  },
  orderList: {
    padding: '12px',
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  orderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  gameTag: {
    backgroundColor: 'rgba(255,107,157,0.15)',
    color: COLORS.primary,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  gameIcon: {
    fontSize: '14px',
  },
  orderStatus: {
    fontSize: '13px',
    fontWeight: 'bold',
  },
  boosterInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  boosterAvatar: {
    fontSize: '40px',
    display: 'block',
  },
  boosterDetail: {
    flex: 1,
  },
  boosterName: {
    display: 'block',
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '2px',
  },
  boostLevel: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  duration: {
    textAlign: 'right',
  },
  durationLabel: {
    display: 'block',
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  durationValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
  },
  orderTime: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  orderPrice: {
    textAlign: 'right',
  },
  priceLabel: {
    display: 'block',
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  orderId: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  orderCreated: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  editBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  chatBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    cursor: 'pointer',
  },
  finishBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: '#fff',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
    border: 'none',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: '14px',
  },
}

export default OrdersPage
