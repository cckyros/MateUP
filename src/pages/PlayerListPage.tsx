// 陪玩师列表页 - 已接入真实 API
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlayerStore, useChatStore } from '../store'
import { getPlayers } from '../api/players'
import { COLORS, GAMES, GAME_NAMES } from '../constants'
import { Styles } from '@/utils/styles'
import { listStagger, listItem, buttonTap } from '../utils/animations'

// 字段映射：旧字段 → 新字段（兼容性）
const normalizePlayer = (p) => ({
  ...p,
  isOnline: p.online,
  games: [p.game === '王者荣耀' ? 'honor' : p.game === '和平精英' ? 'apex' : p.game === '英雄联盟' ? 'lol' : 'yongjie'],
  ordersCount: p.orders,
});

const games = [
  { key: 'all', label: '全部', value: undefined },
  { key: 'honor', label: '王者荣耀', value: 'honor' },
  { key: 'apex', label: '和平精英', value: 'apex' },
  { key: 'lol', label: '英雄联盟', value: 'lol' },
  { key: 'yongjie', label: '永劫无间', value: 'yongjie' },
]

const sorts = ['综合排序', '价格升序', '价格降序', '评分最高']
const quickFilters = [
  { key: 'onlineOnly', label: '在线陪玩' },
  { key: 'isHot', label: '热门陪玩' },
]

const PlayerListPage = () => {
  const navigate = useNavigate()

  // ========== Store ==========
  const {
    players,
    filters,
    filteredPlayers,
    setPlayers,
    setFilters,
  } = usePlayerStore()

  const { setMessages } = useChatStore()

  // ========== 加载陪玩列表 ==========
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const rawList = await getPlayers()
        // 统一字段
        const normalized = ((rawList as any).players || []).map(normalizePlayer)
        setPlayers(normalized)
      } catch (err) {
        console.error('加载陪玩列表失败:', err)
      }
    }
    if (players.length === 0) {
      loadPlayers()
    }
  }, [players.length, setPlayers])

  // ========== 筛选逻辑 ==========
  const handleGameChange = (gameValue) => {
    setFilters({ game: gameValue })
  }

  const handleQuickFilterToggle = (key) => {
    if (key === 'onlineOnly') {
      setFilters({ onlineOnly: !filters.onlineOnly })
    }
    // 其他快捷筛选...
  }

  const handleSort = () => {
    const sortOptions = ['comprehensive', 'price_asc', 'price_desc', 'rating']
    const currentIndex = sortOptions.indexOf(filters.sortBy || 'comprehensive')
    const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length]
    setFilters({ sortBy: nextSort as any })
  }

  // 获取排序后的列表（前端排序）
  const getSortedPlayers = useCallback(() => {
    let result = [...filteredPlayers]

    // 在线优先
    if (filters.onlineOnly) {
      result = result.filter(p => p.isOnline)
    }

    // 排序
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // 综合：在线 > 评分 > 接单数
        result.sort((a, b) => {
          if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1
          if (b.rating !== a.rating) return b.rating - a.rating
          return b.ordersCount - a.ordersCount
        })
    }

    return result
  }, [filteredPlayers, filters.onlineOnly, filters.sortBy])

  const displayPlayers = getSortedPlayers()
  const selectedGameKey = games.find(g => g.value === filters.game)?.key || 'all'

  return (
    <div style={styles.container}>
      {/* ========== 顶部搜索 ========== */}
      <div style={styles.header}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="搜索陪玩师、游戏..."
          />
        </div>
        <div style={styles.filterBtn} onClick={() => navigate('/search')}>
          筛选
        </div>
      </div>

      {/* ========== 游戏分类 ========== */}
      <div style={styles.gameTabs}>
        {games.map(game => (
          <div
            key={game.key}
            style={{
              ...styles.gameTab,
              ...(selectedGameKey === game.key ? styles.gameTabActive : {}),
            }}
            onClick={() => handleGameChange(game.value)}
          >
            {game.label}
          </div>
        ))}
      </div>

      {/* ========== 快捷筛选 + 排序 ========== */}
      <div style={styles.filterRow}>
        {quickFilters.map(filter => (
          <div
            key={filter.key}
            style={{
              ...styles.filterChip,
              ...(filters[filter.key] ? styles.filterChipActive : {}),
            }}
            onClick={() => handleQuickFilterToggle(filter.key)}
          >
            {filter.label}
          </div>
        ))}
        <div style={styles.sortBtn} onClick={handleSort}>
          {sorts.find((s, i) => {
            const sortMap = ['综合排序', '价格升序', '价格降序', '评分最高']
            return sortMap.indexOf(s) ===
              ['comprehensive', 'price_asc', 'price_desc', 'rating'].indexOf(filters.sortBy || 'comprehensive')
          }) || '综合排序'} ▾
        </div>
      </div>

      {/* ========== 陪玩师列表 ========== */}
      <motion.div
        style={styles.playerList}
        variants={listStagger(0.07, 0.05)}
        initial="initial"
        animate="animate"
      >
        {displayPlayers.map(player => (
          <motion.div
            key={player.id}
            style={styles.playerCard}
            onClick={() => navigate(`/player/${player.id}`)}
            variants={listItem}
            whileHover={{ scale: 1.015, boxShadow: '0px 8px 24px rgba(255,107,157,0.25)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* 头像 */}
            <div style={styles.cardHeader}>
              <div style={styles.avatarWrapper}>
                <img
                  src={player.avatar}
                  alt={player.name}
                  style={styles.avatar}
                />
                {player.isOnline && <span style={styles.onlineBadge} />}
              </div>

              <div style={styles.playerInfo}>
                {/* 名字 + 等级 */}
                <div style={styles.nameRow}>
                  <span style={styles.name}>{player.name}</span>
                  <span style={styles.rankBadge}>{player.rank}</span>
                </div>

                {/* 游戏 + 段位 */}
                <div style={styles.gameRow}>
                  <span style={styles.gameTag}>
                    {GAME_NAMES[filters.game] || player.games?.[0]?.toUpperCase() || '游戏'}
                  </span>
                  <span style={styles.rank}>{player.rank}</span>
                </div>

                {/* 标签 */}
                <div style={styles.tags}>
                  {player.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 统计行 */}
            <div style={styles.cardStats}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>评分</span>
                <span style={styles.statValue}>⭐ {player.rating}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>接单</span>
                <span style={styles.statValue}>{player.ordersCount}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>
                  {player.isOnline ? '在线' : '离线'}
                </span>
                <span style={{
                  ...styles.statValue,
                  color: player.isOnline ? COLORS.success : 'rgba(255,255,255,0.3)',
                }}>
                  {player.isOnline ? '在线' : '离线'}
                </span>
              </div>
            </div>

            {/* 底部：价格 + 预约 */}
            <div style={styles.cardFooter}>
              <div style={styles.priceSection}>
                <span style={styles.price}>¥{player.price}</span>
                <span style={styles.priceUnit}>/小时</span>
              </div>
              <motion.div
                style={styles.orderBtn}
                whileTap={{ scale: 0.96, opacity: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/player/${player.id}`)
                }}
              >
                立即预约
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ========== 样式 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '70px',
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
  },
  filterBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  gameTabs: {
    display: 'flex',
    gap: '6px',
    padding: '12px 16px',
    overflowX: 'auto',
    backgroundColor: COLORS.card,
  },
  gameTab: {
    padding: '6px 14px',
    borderRadius: '14px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  gameTabActive: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    fontWeight: 'bold',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    padding: '0 16px 12px',
    backgroundColor: COLORS.card,
    alignItems: 'center',
    overflowX: 'auto',
  },
  filterChip: {
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,107,157,0.2)',
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
  sortBtn: {
    marginLeft: 'auto',
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  playerList: {
    padding: '12px 16px',
  },
  playerCard: {
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '14px',
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    gap: '14px',
    marginBottom: '14px',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '14px',
    height: '14px',
    backgroundColor: COLORS.success,
    borderRadius: '50%',
    border: `2px solid ${COLORS.card}`,
  },
  playerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  name: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  rankBadge: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  gameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  gameTag: {
    backgroundColor: 'rgba(255,107,157,0.2)',
    color: COLORS.primary,
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
  },
  rank: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    padding: '3px 8px',
    borderRadius: '8px',
    fontSize: '11px',
  },
  cardStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: '12px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  orderBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
    border: 'none',
  },
}

export default PlayerListPage
