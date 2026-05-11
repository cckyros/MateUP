// ============================================================
// 搜索筛选页 - 重构后
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '@/constants'
import { Header } from '@/components/layout/Header'
import { Chip, Toggle } from '@/components/ui'
import { Button } from '@/components/ui'

// ============================================================
// 常量
// ============================================================
const GAMES = ['王者荣耀', '和平精英', '英雄联盟', '永劫无间', '穿越火线']
const TAGS = ['御姐音', '萝莉音', '幽默风趣', '连胜王', 'carry型', '教学向', '心态好', '新手友好']
const LEVELS = ['星耀以下', '星耀', '钻石', '大师', '王者', '王者以上']

// ============================================================
// 主组件
// ============================================================
const SearchPage = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [levelFilter, setLevelFilter] = useState('')

  // ============================================================
  // 切换选择
  // ============================================================
  const toggleGame = (game: string) => {
    setSelectedGames(prev =>
      prev.includes(game) ? prev.filter(g => g !== game) : [...prev, game]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const resetFilters = () => {
    setSelectedGames([])
    setSelectedTags([])
    setPriceRange([0, 200])
    setOnlineOnly(false)
    setLevelFilter('')
  }

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={styles.container}>
      <Header
        title="筛选"
        onBack={() => navigate(-1)}
        right={<span style={{ color: COLORS.primary, fontSize: 14 }} onClick={resetFilters}>重置</span>}
      />

      {/* 搜索框 */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="搜索陪玩师..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* 游戏选择 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>游戏</h3>
        <div style={styles.chipList}>
          {GAMES.map(game => (
            <Chip
              key={game}
              label={game}
              active={selectedGames.includes(game)}
              onClick={() => toggleGame(game)}
            />
          ))}
        </div>
      </div>

      {/* 价格区间 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>价格区间 (¥{priceRange[0]} - ¥{priceRange[1]})</h3>
        <div style={styles.rangeSlider}>
          <input
            type="range"
            min="0"
            max="200"
            value={priceRange[0]}
            onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            style={styles.slider}
          />
          <input
            type="range"
            min="0"
            max="200"
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            style={styles.slider}
          />
        </div>
        <div style={styles.rangeLabels}>
          <span style={styles.rangeLabel}>¥0</span>
          <span style={styles.rangeLabel}>¥200+</span>
        </div>
      </div>

      {/* 段位筛选 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>段位要求</h3>
        <div style={styles.chipList}>
          {LEVELS.map(level => (
            <Chip
              key={level}
              label={level}
              active={levelFilter === level}
              onClick={() => setLevelFilter(levelFilter === level ? '' : level)}
            />
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>陪玩风格</h3>
        <div style={styles.chipList}>
          {TAGS.map(tag => (
            <Chip
              key={tag}
              label={tag}
              active={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* 在线状态 */}
      <div style={styles.section}>
        <div style={styles.toggleRow}>
          <span style={styles.toggleLabel}>只看在线</span>
          <Toggle checked={onlineOnly} onChange={setOnlineOnly} />
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={styles.bottomBar}>
        <span style={styles.resultCount}>共找到 12 位陪玩</span>
        <Button variant="primary" size="md" onTap={() => navigate('/home')}>
          查看结果
        </Button>
      </div>
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
  searchSection: {
    padding: '12px 16px',
    backgroundColor: COLORS.card,
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: COLORS.text,
    fontSize: 14,
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  rangeSlider: {
    display: 'flex',
    gap: 20,
    padding: '0 10px',
  },
  slider: {
    flex: 1,
    accentColor: COLORS.primary,
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  resultCount: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}

export default SearchPage