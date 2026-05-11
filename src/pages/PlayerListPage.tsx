// ============================================================
// 陪玩师列表页 - 重构后
// ============================================================
import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlayerStore, useChatStore } from '@/store'
import { getPlayers } from '@/api/players'
import { COLORS, GAMES, GAME_NAMES } from '@/constants'
import { listStagger, listItem } from '@/hooks'
import { PlayerCard } from '@/components/player'
import { Badge } from '@/components/ui'
import type { Player } from '@/store/player/types'

// ============================================================
// 游戏选项
// ============================================================
const GAME_OPTIONS = [
  { key: 'all', label: '全部', value: undefined },
  { key: 'honor', label: '王者荣耀', value: 'honor' },
  { key: 'apex', label: '和平精英', value: 'apex' },
  { key: 'lol', label: '英雄联盟', value: 'lol' },
  { key: 'yongjie', label: '永劫无间', value: 'yongjie' },
]

const SORT_OPTIONS = [
  { key: 'comprehensive', label: '综合排序' },
  { key: 'price_asc', label: '价格升序' },
  { key: 'price_desc', label: '价格降序' },
  { key: 'rating', label: '评分最高' },
]

const QUICK_FILTERS = [
  { key: 'onlineOnly', label: '在线陪玩' },
  { key: 'isHot', label: '热门陪玩' },
]

// ============================================================
// 字段标准化
// ============================================================
const normalizePlayer = (p: any): Player => ({
  ...p,
  isOnline: p.online ?? p.isOnline ?? false,
  games: Array.isArray(p.games)
    ? p.games
    : [p.game === '王者荣耀' ? 'honor' : p.game === '和平精英' ? 'apex' : p.game === '英雄联盟' ? 'lol' : 'yongjie'],
  ordersCount: p.orders ?? p.ordersCount ?? 0,
})

// ============================================================
// 主组件
// ============================================================
const PlayerListPage = () => {
  const navigate = useNavigate()

  // Store
  const { players, filters, filteredPlayers, setPlayers, setFilters } = usePlayerStore()
  const { setMessages } = useChatStore()

  // Local state
  const [searchText, setSearchText] = useState('')

  // ============================================================
  // 加载数据
  // ============================================================
  useEffect(() => {
    if (players.length > 0) return

    const loadPlayers = async () => {
      try {
        const rawList = await getPlayers()
        const normalized = ((rawList as any).players || []).map(normalizePlayer)
        setPlayers(normalized)
      } catch (err) {
        console.error('加载陪玩列表失败:', err)
      }
    }

    loadPlayers()
  }, [players.length, setPlayers])

  // ============================================================
  // 筛选逻辑
  // ============================================================
  const handleGameChange = (gameValue: string | undefined) => {
    setFilters({ game: gameValue })
  }

  const handleQuickFilterToggle = (key: keyof typeof filters) => {
    if (key === 'onlineOnly') {
      setFilters({ onlineOnly: !filters.onlineOnly })
    }
  }

  const handleSort = () => {
    const sortOptions = ['comprehensive', 'price_asc', 'price_desc', 'rating'] as const
    const currentIndex = sortOptions.indexOf((filters.sortBy || 'comprehensive') as any)
    const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length]
    setFilters({ sortBy: nextSort })
  }

  // 获取当前排序标签
  const currentSortLabel = SORT_OPTIONS.find(
    s => s.key === (filters.sortBy || 'comprehensive')
  )?.label || '综合排序'

  // ============================================================
  // 排序后的列表
  // ============================================================
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
        result.sort((a, b) => {
          if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1
          if (b.rating !== a.rating) return b.rating - a.rating
          return b.ordersCount - a.ordersCount
        })
    }

    return result
  }, [filteredPlayers, filters.onlineOnly, filters.sortBy])

  const displayPlayers = getSortedPlayers()
  const selectedGameKey = GAME_OPTIONS.find(g => g.value === filters.game)?.key || 'all'

  // ============================================================
  // 搜索处理
  // ============================================================
  const filteredBySearch = searchText
    ? displayPlayers.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.games.some(g => g.toLowerCase().includes(searchText.toLowerCase()))
      )
    : displayPlayers

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={styles.container}>
      {/* ========== 顶部搜索栏 ========== */}
      <div style={styles.header}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="搜索陪玩师、游戏..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <motion.div
          style={styles.filterBtn}
          onClick={() => navigate('/search')}
          whileTap={{ scale: 0.95 }}
        >
          筛选
        </motion.div>
      </div>

      {/* ========== 游戏分类 ========== */}
      <div style={styles.gameTabs}>
        {GAME_OPTIONS.map(game => (
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
        {QUICK_FILTERS.map(filter => (
          <div
            key={filter.key}
            style={{
              ...styles.filterChip,
              ...(filters[filter.key as keyof typeof filters] ? styles.filterChipActive : {}),
            }}
            onClick={() => handleQuickFilterToggle(filter.key as keyof typeof filters)}
          >
            {filter.label}
          </div>
        ))}
        <div
          style={styles.sortBtn}
          onClick={handleSort}
        >
          {currentSortLabel} ▾
        </div>
      </div>

      {/* ========== 陪玩师列表 ========== */}
      <motion.div
        style={styles.playerList}
        variants={listStagger(0.07, 0.05)}
        initial="hidden"
        animate="show"
      >
        {filteredBySearch.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: 40 }}>🔍</span>
            <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>
              {searchText ? '未找到匹配的陪玩师' : '暂无陪玩师'}
            </p>
          </div>
        ) : (
          filteredBySearch.map(player => (
            <motion.div key={player.id} variants={listItem}>
              <PlayerCard player={player} />
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
    padding: '12px 16px',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 14,
  },
  filterBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  },
  gameTabs: {
    display: 'flex',
    gap: 6,
    padding: '12px 16px',
    overflowX: 'auto' as const,
    backgroundColor: COLORS.card,
  },
  gameTab: {
    padding: '6px 14px',
    borderRadius: 14,
    fontSize: 13,
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  gameTabActive: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    padding: '0 16px 12px',
    backgroundColor: COLORS.card,
    alignItems: 'center',
    overflowX: 'auto' as const,
  },
  filterChip: {
    padding: '5px 12px',
    borderRadius: 12,
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: `1px solid ${COLORS.border}`,
    whiteSpace: 'nowrap' as const,
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
    borderRadius: 12,
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
  },
  playerList: {
    padding: '12px 16px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
  },
}

export default PlayerListPage