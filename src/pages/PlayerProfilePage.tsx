// 陪玩师资料页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS, GAME_NAMES } from '@/constants'
import { usePlayerProfileStore } from '@/store'
import { mockApi } from '@/api/mock'
import { getPlayerProfile, updatePlayerProfile } from '@/api/playerApi'
import { Styles } from '@/utils/styles'

export default function PlayerProfilePage() {
  const navigate = useNavigate()
  const { profile, setProfile } = usePlayerProfileStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ price: 40, rank: '钻石', description: '', games: [] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getPlayerProfile().then((res) => {
      setProfile(res as any)
      setForm({
        price: res.price,
        rank: res.rank,
        description: res.description,
        games: res.games,
      })
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await updatePlayerProfile(form)
    setProfile({ ...profile, ...form })
    setEditing(false)
    setSaving(false)
  }

  if (!profile) {
    return <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: COLORS.textSecondary }}>加载中...</span>
    </div>
  }

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>陪玩资料</span>
        {!editing ? (
          <span style={styles.editBtn} onClick={() => setEditing(true)}>编辑</span>
        ) : (
          <span style={{ width: '24px' }} />
        )}
      </div>

      {/* 头像区 */}
      <div style={styles.headerSection}>
        <img src={profile.avatar} style={styles.avatar} alt="" />
        <div style={styles.headerInfo}>
          <h2 style={styles.name}>{profile.name}</h2>
          <p style={styles.subInfo}>
            {form.games.map((g) => GAME_NAMES[g] || g).join(' / ')} · {profile.rank}
          </p>
          <p style={styles.onlineIndicator}>
            <span style={styles.onlineDot} />{profile.isOnline ? '在线' : '离线'}
          </p>
        </div>
      </div>

      {/* 价格和评分 */}
      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>¥{profile.price}/小时</span>
          <span style={styles.statLabel}>收费</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{profile.rating.toFixed(1)}</span>
          <span style={styles.statLabel}>评分</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{profile.ordersCount}</span>
          <span style={styles.statLabel}>完成订单</span>
        </div>
      </div>

      {/* 编辑区域 */}
      {editing ? (
        <div style={styles.editSection}>
          {/* 价格 */}
          <div style={styles.field}>
            <p style={styles.fieldLabel}>收费标准（元/小时）</p>
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
              <span style={styles.priceTag}>{form.price}元</span>
            </div>
          </div>

          {/* 段位 */}
          <div style={styles.field}>
            <p style={styles.fieldLabel}>最高段位</p>
            <div style={styles.chipGroup}>
              {['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者', '荣耀王者'].map((r) => (
                <div
                  key={r}
                  style={{
                    ...styles.chip,
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

          {/* 擅长游戏 */}
          <div style={styles.field}>
            <p style={styles.fieldLabel}>擅长游戏</p>
            <div style={styles.chipGroup}>
              {Object.entries(GAME_NAMES).map(([key, name]) => (
                <div
                  key={key}
                  style={{
                    ...styles.chip,
                    backgroundColor: form.games.includes(key) ? COLORS.primary : COLORS.card,
                    borderColor: form.games.includes(key) ? COLORS.primary : COLORS.border,
                  }}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      games: f.games.includes(key)
                        ? f.games.filter((g) => g !== key)
                        : [...f.games, key],
                    }))
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* 个人介绍 */}
          <div style={styles.field}>
            <p style={styles.fieldLabel}>个人介绍</p>
            <textarea
              style={styles.textarea}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              maxLength={200}
              rows={4}
            />
          </div>

          <div style={styles.editActions}>
            <button style={styles.cancelBtn} onClick={() => setEditing(false)}>取消</button>
            <button style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      ) : (
        /* 只读区域 */
        <div style={styles.readonlySection}>
          <div style={styles.field}>
            <p style={styles.fieldLabel}>个人介绍</p>
            <p style={styles.description}>{profile.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '40px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  back: {
    fontSize: '24px',
    color: COLORS.text,
    cursor: 'pointer',
  },
  navTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editBtn: {
    fontSize: '15px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 16px',
    backgroundColor: COLORS.card,
    marginBottom: '12px',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${COLORS.primary}`,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 6px 0',
  },
  subInfo: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: '0 0 6px 0',
  },
  onlineIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: COLORS.success,
    margin: 0,
  },
  onlineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: COLORS.success,
  },
  statsCard: {
    display: 'flex',
    backgroundColor: COLORS.card,
    margin: '0 12px 12px',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: '1px',
    backgroundColor: COLORS.border,
    margin: '0 8px',
  },
  editSection: {
    padding: '0 12px',
  },
  readonlySection: {
    padding: '0 12px',
  },
  field: {
    marginBottom: '20px',
  },
  fieldLabel: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  slider: {
    flex: 1,
    accentColor: COLORS.primary,
  },
  priceTag: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.primary,
    minWidth: '60px',
    textAlign: 'right',
  },
  chipGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '13px',
    color: COLORS.text,
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '12px',
    fontSize: '14px',
    color: COLORS.text,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  description: {
    fontSize: '14px',
    color: COLORS.text,
    lineHeight: 1.6,
    margin: 0,
    backgroundColor: COLORS.card,
    padding: '12px',
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '25px',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 2,
    padding: '14px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
  },
}
