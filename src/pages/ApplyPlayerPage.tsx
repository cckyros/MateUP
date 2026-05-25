// 申请陪玩师页 - Phase 7
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, GAMES, GAME_NAMES } from '@/constants'
import { useApplyStore } from '@/store'
import { submitApply } from '@/api/apply'
import { styles } from './ApplyPlayerPage.styles'

const GAME_OPTIONS = Object.entries(GAME_NAMES)

const RANK_OPTIONS = ['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者', '荣耀王者']

export default function ApplyPlayerPage() {
  const navigate = useNavigate()
  const setStatus = useApplyStore((s) => s.setStatus)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    games: [],
    price: 35,
    rank: '钻石',
    description: '',
  })

  const toggleGame = (game) => {
    setForm((f) => ({
      ...f,
      games: f.games.includes(game)
        ? f.games.filter((g) => g !== game)
        : [...f.games, game],
    }))
  }

  const handleSubmit = async () => {
    if (form.games.length === 0) {
      alert('请选择至少一个擅长游戏')
      return
    }
    if (!form.description.trim()) {
      alert('请填写个人介绍')
      return
    }
    setLoading(true)
    try {
      await submitApply(form)
      setStatus('pending', Date.now())
      navigate('/apply-status')
    } catch (e) {
      alert('提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>申请成为陪玩师</span>
        <span style={{ width: '24px' }} />
      </div>

      <div style={styles.content}>
        {/* 选择游戏 */}
        <div style={styles.section}>
          <p style={styles.label}>擅长游戏 <span style={styles.required}>*</span></p>
          <div style={styles.gameGrid}>
            {GAME_OPTIONS.map(([key, name]) => (
              <div
                key={key}
                style={{
                  ...styles.gameChip,
                  backgroundColor: form.games.includes(key) ? COLORS.primary : COLORS.card,
                  borderColor: form.games.includes(key) ? COLORS.primary : COLORS.border,
                }}
                onClick={() => toggleGame(key)}
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* 设置价格 */}
        <div style={styles.section}>
          <p style={styles.label}>
            收费标准 <span style={styles.required}>*</span>
            <span style={styles.hint}> 元/小时</span>
          </p>
          <div style={styles.priceRow}>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              style={styles.slider}
            />
            <div style={styles.priceDisplay}>
              <span style={styles.priceValue}>{form.price}</span>
              <span style={styles.priceUnit}>元/小时</span>
            </div>
          </div>
        </div>

        {/* 游戏段位 */}
        <div style={styles.section}>
          <p style={styles.label}>最高段位 <span style={styles.required}>*</span></p>
          <div style={styles.rankGrid}>
            {RANK_OPTIONS.map((r) => (
              <div
                key={r}
                style={{
                  ...styles.rankChip,
                  backgroundColor: form.rank === r ? COLORS.secondary : COLORS.card,
                  borderColor: form.rank === r ? COLORS.secondary : COLORS.border,
                }}
                onClick={() => setForm((f) => ({ ...f, rank: r }))}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* 个人介绍 */}
        <div style={styles.section}>
          <p style={styles.label}>
            个人介绍 <span style={styles.required}>*</span>
            <span style={styles.hint}>（让用户更了解你）</span>
          </p>
          <textarea
            style={styles.textarea}
            placeholder="介绍一下自己，比如：擅长位置、游戏风格、语音特点..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            maxLength={200}
            rows={4}
          />
          <p style={styles.charCount}>{form.description.length}/200</p>
        </div>

        {/* 提示 */}
        <div style={styles.notice}>
          <p style={styles.noticeText}>📋 提交申请后，管理员将在1-3个工作日内完成审核</p>
          <p style={styles.noticeText}>✅ 审核通过后即可开始接单，享受陪玩收入</p>
        </div>
      </div>

      {/* 提交按钮 */}
      <div style={styles.footer}>
        <button
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.6 : 1,
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '提交中...' : '提交申请'}
        </button>
      </div>
    </div>
  )
}

