// 搜索筛选页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const SearchPage = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedGames, setSelectedGames] = useState([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedTags, setSelectedTags] = useState([])
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [levelFilter, setLevelFilter] = useState('')

  const games = ['王者荣耀', '和平精英', '英雄联盟', '永劫无间', '穿越火线']
  const tags = ['御姐音', '萝莉音', '幽默风趣', '连胜王', 'carry型', '教学向', '心态好', '新手友好']
  const levels = ['星耀以下', '星耀', '钻石', '大师', '王者', '王者以上']

  const toggleGame = (game) => {
    setSelectedGames(prev =>
      prev.includes(game) ? prev.filter(g => g !== game) : [...prev, game]
    )
  }

  const toggleTag = (tag) => {
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

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
        <span style={styles.headerTitle}>筛选</span>
        <span style={styles.resetBtn} onClick={resetFilters}>重置</span>
      </div>

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
          {games.map(game => (
            <div
              key={game}
              style={{
                ...styles.chip,
                ...(selectedGames.includes(game) ? styles.chipActive : {}),
              }}
              onClick={() => toggleGame(game)}
            >
              {game}
            </div>
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
          {levels.map(level => (
            <div
              key={level}
              style={{
                ...styles.chip,
                ...(levelFilter === level ? styles.chipActive : {}),
              }}
              onClick={() => setLevelFilter(levelFilter === level ? '' : level)}
            >
              {level}
            </div>
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>陪玩风格</h3>
        <div style={styles.chipList}>
          {tags.map(tag => (
            <div
              key={tag}
              style={{
                ...styles.chip,
                ...(selectedTags.includes(tag) ? styles.chipActive : {}),
              }}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* 在线状态 */}
      <div style={styles.section}>
        <div style={styles.toggleRow}>
          <span style={styles.toggleLabel}>只看在线</span>
          <div
            style={{
              ...styles.toggle,
              ...(onlineOnly ? styles.toggleActive : {}),
            }}
            onClick={() => setOnlineOnly(!onlineOnly)}
          >
            <div style={{
              ...styles.toggleDot,
              ...(onlineOnly ? styles.toggleDotActive : {}),
            }} />
          </div>
        </div>
      </div>

      {/* 确认按钮 */}
      <div style={styles.bottomBar}>
        <div style={styles.resultCount}>共找到 12 位陪玩</div>
        <div style={styles.confirmBtn} onClick={() => navigate('/home')}>
          查看结果
        </div>
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '80px',
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resetBtn: {
    fontSize: '14px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  searchSection: {
    padding: '12px 16px',
    backgroundColor: COLORS.card,
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: COLORS.text,
    fontSize: '14px',
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  chip: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    cursor: 'pointer',
    border: `1px solid ${COLORS.border}`,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    borderColor: COLORS.primary,
    fontWeight: 'bold',
  },
  rangeSlider: {
    display: 'flex',
    gap: '20px',
    padding: '0 10px',
  },
  slider: {
    flex: 1,
    accentColor: COLORS.primary,
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  rangeLabel: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: '15px',
    color: COLORS.text,
  },
  toggle: {
    width: '48px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '2px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: `1px solid ${COLORS.border}`,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleDot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
  },
  toggleDotActive: {
    transform: 'translateX(20px)',
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  resultCount: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '24px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
    border: 'none',
  },
}

export default SearchPage
