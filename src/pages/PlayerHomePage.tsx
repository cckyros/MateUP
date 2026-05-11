// ============================================================
// 陪玩师工作台 - 重构后
// ============================================================
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { usePlayerProfileStore } from '@/store'
import { acceptOrder, rejectOrder } from '@/api/order'
import { getPlayerProfile, getPlayerOrders } from '@/api/playerApi'
import { Header } from '@/components/layout/Header'
import { Button, Badge } from '@/components/ui'

// ============================================================
// 游戏名映射
// ============================================================
const GAME_MAP: Record<string, string> = {
  lol: 'LOL', honor: '王者', yongjie: '永劫', apex: 'Apex', danzai: '蛋仔',
}

// ============================================================
// 主组件
// ============================================================
export default function PlayerHomePage() {
  const navigate = useNavigate()
  const { profile, orders, setProfile, setOrders } = usePlayerProfileStore()

  useEffect(() => {
    getPlayerProfile().then((res: any) => setProfile(res)).catch(() => {})
    getPlayerOrders().then((res: any) => setOrders(res.orders)).catch(() => {})
  }, [])

  const pendingOrders = orders.filter((o: any) => o.status === 'WAIT_ACCEPT')
  const inProgressOrders = orders.filter((o: any) => o.status === 'IN_PROGRESS')

  const handleAccept = (orderId: string) => {
    acceptOrder(orderId).then(() => {
      usePlayerProfileStore.getState().updateOrderStatus(orderId, 'IN_PROGRESS')
    })
  }

  const handleReject = (orderId: string) => {
    rejectOrder(orderId).then(() => {
      usePlayerProfileStore.getState().updateOrderStatus(orderId, 'CANCELLED')
    })
  }

  const gameDisplay = (profile?.games as string[])?.map(g => GAME_MAP[g] || g).join(' / ') || '—'

  return (
    <div style={styles.container}>
      <Header
        title="工作台"
        onBack={() => navigate(-1)}
        right={
          <div style={styles.onlineTag}>
            <span style={styles.onlineDot} />
            在线
          </div>
        }
      />

      {/* 概览卡片 */}
      <div style={styles.overviewCard}>
        <div style={styles.profileRow}>
          <div style={styles.avatar}>
            {profile?.avatar ? (
              <img src={profile.avatar} style={styles.avatarImg} alt="" />
            ) : '👤'}
          </div>
          <div style={styles.profileInfo}>
            <p style={styles.profileName}>{profile?.name || '加载中...'}</p>
            <p style={styles.profileGames}>{gameDisplay}</p>
          </div>
          <Button variant="outline" size="sm" onTap={() => navigate('/player-profile')}>
            编辑资料
          </Button>
        </div>

        <div style={styles.statsRow}>
          <StatItem label="本周订单" value={profile?.weeklyOrders || 0} />
          <div style={styles.statDivider} />
          <StatItem label="本周收入" value={`¥${profile?.weeklyEarnings || 0}`} />
          <div style={styles.statDivider} />
          <StatItem label="综合评分" value={profile?.rating?.toFixed(1) || '—'} />
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
          {pendingOrders.length > 0 && <Badge variant="error">{pendingOrders.length}</Badge>}
          <span style={styles.moreLink} onClick={() => navigate('/player-orders')}>全部 ›</span>
        </div>

        {pendingOrders.length === 0 ? (
          <EmptyCard icon="📭" text="暂无待处理订单" />
        ) : (
          pendingOrders.slice(0, 2).map((order: any) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderLeft}>
                <img src={order.userAvatar} style={styles.orderAvatar} alt="" />
                <div>
                  <p style={styles.orderName}>{order.userName}</p>
                  <p style={styles.orderMeta}>{order.game} · {order.duration}小时 · ¥{order.price}</p>
                </div>
              </div>
              <div style={styles.orderActions}>
                <Button variant="primary" size="sm" onTap={() => handleAccept(order.id)}>接单</Button>
                <Button variant="ghost" size="sm" onTap={() => handleReject(order.id)}>拒单</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 进行中订单 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>进行中</span>
          {inProgressOrders.length > 0 && <Badge variant="success">{inProgressOrders.length}</Badge>}
        </div>

        {inProgressOrders.length === 0 ? (
          <EmptyCard icon="🎮" text="暂无进行中订单" />
        ) : (
          inProgressOrders.slice(0, 2).map((order: any) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderLeft}>
                <img src={order.userAvatar} style={styles.orderAvatar} alt="" />
                <div>
                  <p style={styles.orderName}>{order.userName}</p>
                  <p style={styles.orderMeta}>{order.game} · {order.duration}小时 · ¥{order.price}</p>
                </div>
              </div>
              <Badge variant="success">进行中</Badge>
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
          <motion.div
            key={item.path}
            style={styles.menuItem}
            onClick={() => navigate(item.path)}
            whileTap={{ opacity: 0.7 }}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 子组件
// ============================================================
function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.statItem}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  )
}

function EmptyCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={styles.emptyCard}>
      <span style={styles.emptyIcon}>{icon}</span>
      <span style={styles.emptyText}>{text}</span>
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
  onlineTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: COLORS.success,
    backgroundColor: 'rgba(0,217,166,0.15)',
    padding: '4px 10px',
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: COLORS.success,
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    margin: 12,
    borderRadius: 16,
    padding: 16,
    border: `1px solid ${COLORS.border}`,
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    backgroundColor: COLORS.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: 28,
    marginRight: 12,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  profileGames: {
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTop: `1px solid ${COLORS.border}`,
  },
  statItem: {
    textAlign: 'center' as const,
    flex: 1,
  },
  statValue: {
    display: 'block',
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  statLabel: {
    display: 'block',
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  balanceCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    margin: '0 12px 12px',
    borderRadius: 16,
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: '0 0 4px 0',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
    margin: 0,
  },
  withdrawInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  pendingWithdraw: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    margin: '0 12px 12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  moreLink: {
    marginLeft: 'auto',
    fontSize: 13,
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orderCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    border: `1px solid ${COLORS.border}`,
  },
  orderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  orderAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  orderName: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: 0,
  },
  orderActions: {
    display: 'flex',
    gap: 8,
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 1,
    margin: '16px 12px 0',
    backgroundColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px 8px',
    backgroundColor: COLORS.card,
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  menuLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
}