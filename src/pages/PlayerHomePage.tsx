// 陪玩师工作台 - Phase 7
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'
import { usePlayerProfileStore } from '../store'
import { acceptOrder, rejectOrder } from '../api/order'
import { getPlayerProfile, getPlayerOrders, setOnlineStatus } from '../api/playerApi'
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../constants'

export default function PlayerHomePage() {
  const navigate = useNavigate()
  const { profile, orders, setProfile, setOrders } = usePlayerProfileStore()

  useEffect(() => {
    getPlayerProfile().then((res) => setProfile(res)).catch(() => {})
    getPlayerOrders().then((res) => setOrders(res.orders)).catch(() => {})
  }, [])

  const pendingOrders = orders.filter((o) => o.status === 'WAIT_ACCEPT')
  const inProgressOrders = orders.filter((o) => o.status === 'IN_PROGRESS')

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.navTitle}>工作台</span>
        <span style={styles.onlineTag}>
          <span style={styles.onlineDot} />在线
        </span>
      </div>

      {/* 概览卡片 */}
      <div style={styles.overviewCard}>
        <div style={styles.profileRow}>
          <div style={styles.avatar}>{profile?.avatar ? (
            <img src={profile.avatar} style={styles.avatarImg} alt="" />
          ) : '👤'}</div>
          <div style={styles.profileInfo}>
            <p style={styles.profileName}>{profile?.name || '加载中...'}</p>
            <p style={styles.profileGames}>
              {profile?.games?.map((g) => ({ lol: 'LOL', honor: '王者', yongjie: '永劫', apex: 'Apex', danzai: '蛋仔' }[g] || g)).join(' / ') || '—'}
            </p>
          </div>
          <button style={styles.editBtn} onClick={() => navigate('/player-profile')}>
            编辑资料
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{profile?.weeklyOrders || 0}</span>
            <span style={styles.statLabel}>本周订单</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statValue}>¥{profile?.weeklyEarnings || 0}</span>
            <span style={styles.statLabel}>本周收入</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statValue}>{profile?.rating?.toFixed(1) || '—'}</span>
            <span style={styles.statLabel}>综合评分</span>
          </div>
        </div>
      </div>

      {/* 余额卡片 */}
      <div style={styles.balanceCard} onClick={() => navigate('/player-earnings')}>
        <div>
          <p style={styles.balanceLabel}>可提现余额</p>
          <p style={styles.balanceValue}>¥{profile?.balance?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={styles.withdrawInfo}>
          <span style={styles.pendingWithdraw}>提现中 ¥{profile?.pendingWithdraw || 0}</span>
          <span style={styles.arrow}>›</span>
        </div>
      </div>

      {/* 待处理订单 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>待处理订单</span>
          <span style={styles.badge}>{pendingOrders.length}</span>
          <span style={styles.moreLink} onClick={() => navigate('/player-orders')}>全部 ›</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={styles.emptyIcon}>📭</span>
            <span style={styles.emptyText}>暂无待处理订单</span>
          </div>
        ) : (
          pendingOrders.slice(0, 2).map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderLeft}>
                <img src={order.userAvatar} style={styles.orderAvatar} alt="" />
                <div>
                  <p style={styles.orderName}>{order.userName}</p>
                  <p style={styles.orderMeta}>
                    {order.game} · {order.duration}小时 · ¥{order.price}
                  </p>
                </div>
              </div>
              <div style={styles.orderActions}>
                <button
                  style={styles.acceptBtn}
                  onClick={() => acceptOrder(order.id).then(() => {
                    usePlayerProfileStore.getState().updateOrderStatus(order.id, 'IN_PROGRESS')
                  })}
                >
                  接单
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => rejectOrder(order.id).then(() => {
                    usePlayerProfileStore.getState().updateOrderStatus(order.id, 'CANCELLED')
                  })}
                >
                  拒单
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 进行中订单 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>进行中</span>
          <span style={styles.badgeInProgress}>{inProgressOrders.length}</span>
        </div>
        {inProgressOrders.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={styles.emptyIcon}>🎮</span>
            <span style={styles.emptyText}>暂无进行中订单</span>
          </div>
        ) : (
          inProgressOrders.slice(0, 2).map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderLeft}>
                <img src={order.userAvatar} style={styles.orderAvatar} alt="" />
                <div>
                  <p style={styles.orderName}>{order.userName}</p>
                  <p style={styles.orderMeta}>
                    {order.game} · {order.duration}小时 · ¥{order.price}
                  </p>
                </div>
              </div>
              <div style={styles.inProgressTag}>进行中</div>
            </div>
          ))
        )}
      </div>

      {/* 底部菜单 */}
      <div style={styles.menuGrid}>
        {[
          { icon: '📋', label: '我的订单', path: '/player-orders' },
          { icon: '💰', label: '收入中心', path: '/player-earnings' },
          { icon: '⭐', label: '评价管理', path: '/player-reviews' },
          { icon: '👤', label: '陪玩资料', path: '/player-profile' },
        ].map((item) => (
          <div key={item.path} style={styles.menuItem} onClick={() => navigate(item.path)}>
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '80px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  navTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  onlineTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: COLORS.success,
    backgroundColor: 'rgba(0,217,166,0.15)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  onlineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: COLORS.success,
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    margin: '12px',
    borderRadius: '16px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: COLORS.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: '28px',
    marginRight: '12px',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  profileGames: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  editBtn: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.primary}`,
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  statItem: {
    textAlign: 'center',
    flex: 1,
  },
  statValue: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: COLORS.border,
  },
  balanceCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    margin: '0 12px 12px',
    borderRadius: '16px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  balanceLabel: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: '0 0 4px 0',
  },
  balanceValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: 0,
  },
  withdrawInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pendingWithdraw: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: '16px',
    color: COLORS.textSecondary,
  },
  section: {
    margin: '0 12px 12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.error,
    color: '#fff',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  badgeInProgress: {
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  moreLink: {
    marginLeft: 'auto',
    fontSize: '13px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: COLORS.textSecondary,
  },
  orderCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '8px',
    border: `1px solid ${COLORS.border}`,
  },
  orderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  orderAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  orderName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  orderMeta: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  orderActions: {
    display: 'flex',
    gap: '8px',
  },
  acceptBtn: {
    padding: '6px 16px',
    backgroundColor: COLORS.success,
    border: 'none',
    borderRadius: '14px',
    fontSize: '12px',
    color: '#fff',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '6px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.error}`,
    borderRadius: '14px',
    fontSize: '12px',
    color: COLORS.error,
    cursor: 'pointer',
  },
  inProgressTag: {
    padding: '4px 10px',
    backgroundColor: 'rgba(0,217,166,0.15)',
    color: COLORS.success,
    borderRadius: '10px',
    fontSize: '12px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    margin: '16px 12px 0',
    backgroundColor: COLORS.border,
    borderRadius: '12px',
    overflow: 'hidden',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 8px',
    backgroundColor: COLORS.card,
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: '24px',
    marginBottom: '6px',
  },
  menuLabel: {
    fontSize: '12px',
    color: COLORS.text,
  },
}
