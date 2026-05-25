import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlayerStore } from '@/store'
import { getPlayers } from '@/api/players'
import { COLORS, GAME_NAMES, GAME_TABS } from '@/constants'
import type { SortOption } from '@/types'
import { listStagger, listItem, SPRING } from '@/utils/animations'
import { styles } from './PlayerListPage.styles'



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

  // ========== 加载陪玩列表 ==========
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const result = await getPlayers()
        setPlayers(result.players || [])
      } catch (err) {
        console.error('[PlayerList] 加载陪玩列表失败:', err)
      }
    }
    if (players.length === 0) {
      loadPlayers()
    }
  }, [players.length, setPlayers])

  // ========== 筛选逻辑 ==========
  const handleGameChange = (gameValue: string | undefined) => {
    setFilters({ game: gameValue })
  }

  const handleQuickFilterToggle = (key: string) => {
    if (key === 'onlineOnly') {
      setFilters({ onlineOnly: !filters.onlineOnly })
    }
  }

  const handleSort = () => {
    const sortOptions: SortOption[] = ['comprehensive', 'price_asc', 'price_desc', 'rating']
    const currentIndex = sortOptions.indexOf(filters.sortBy || 'comprehensive')
    const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length]
    setFilters({ sortBy: nextSort })
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
  const selectedGameKey = GAME_TABS.find(g => g.value === filters.game)?.key || 'all'

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
        {GAME_TABS.map(game => (
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
            whileHover={{ scale: 1.015, boxShadow: '0 6px 20px rgba(255,107,157,0.2)' }}
            whileTap={{ scale: 0.975 }}
            transition={SPRING.snappy}
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
                whileTap={{ scale: 0.93, opacity: 0.85 }}
                transition={SPRING.tactile}
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


export default PlayerListPage
