// 陪玩师工作台 - Phase 7
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerProfileStore } from '@/store'
import { acceptOrder, rejectOrder } from '@/api/order'
import { getPlayerProfile, getPlayerOrders, setOnlineStatus } from '@/api/playerApi'
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '@/constants'
import { styles } from './PlayerHomePage.styles'

export default function PlayerHomePage() {
  const navigate = useNavigate()
  const { profile, orders, setProfile, setOrders } = usePlayerProfileStore()

  useEffect(() => {
    getPlayerProfile().then((res) => setProfile(res as any)).catch(() => {})
    getPlayerOrders().then((res) => setOrders(res.orders as any)).catch(() => {})
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
          <span style={styles.pendingWithdraw}>提现中 ¥{profile?.pendingWithdrawal || 0}</span>
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
