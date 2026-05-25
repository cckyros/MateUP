// 搜索筛选页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styles } from './SearchPage.styles'

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

export default SearchPage
