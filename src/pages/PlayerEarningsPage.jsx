// 收入中心 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'
import { mockApi } from '../api/mock'

export default function PlayerEarningsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    mockApi.getPlayerEarnings().then(setData)
  }, [])

  const handleWithdraw = async () => {
    if (!data || data.balance <= 0) return
    setWithdrawing(true)
    await new Promise((r) => setTimeout(r, 800))
    setWithdrawing(false)
    alert('提现申请已提交，预计1-3个工作日到账')
  }

  if (!data) {
    return <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: COLORS.textSecondary }}>加载中...</span>
    </div>
  }

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>收入中心</span>
        <span style={{ width: '24px' }} />
      </div>

      {/* 余额卡片 */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceTop}>
          <div>
            <p style={styles.balanceLabel}>可提现余额</p>
            <p style={styles.balanceValue}>¥{data.balance.toFixed(2)}</p>
          </div>
          <button
            style={{ ...styles.withdrawBtn, opacity: withdrawing || data.balance <= 0 ? 0.6 : 1 }}
            onClick={handleWithdraw}
            disabled={withdrawing || data.balance <= 0}
          >
            {withdrawing ? '提现中...' : '提现'}
          </button>
        </div>
        <div style={styles.balanceBottom}>
          <div style={styles.balanceSubItem}>
            <span style={styles.balanceSubLabel}>提现中</span>
            <span style={styles.balanceSubValue}>¥{data.pendingWithdraw.toFixed(2)}</span>
          </div>
          <div style={styles.balanceDivider} />
          <div style={styles.balanceSubItem}>
            <span style={styles.balanceSubLabel}>累计收入</span>
            <span style={styles.balanceSubValue}>¥{data.totalEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 收入统计 */}
      <div style={styles.statsGrid}>
        {[
          { label: '今日收入', value: `¥${data.todayEarnings}` },
          { label: '本周收入', value: `¥${data.weekEarnings}` },
          { label: '本月收入', value: `¥${data.monthEarnings}` },
        ].map((item) => (
          <div key={item.label} style={styles.statCard}>
            <p style={styles.statValue}>{item.value}</p>
            <p style={styles.statLabel}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* 明细记录 */}
      <div style={styles.section}>
        <p style={styles.sectionTitle}>收支明细</p>
        {data.records.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>💰</span>
            <p style={styles.emptyText}>暂无记录</p>
          </div>
        ) : (
          data.records.map((record: any) => (
            <div key={record.id} style={styles.recordItem}>
              <div style={styles.recordLeft}>
                <span style={{
                  ...styles.recordType,
                  backgroundColor: record.amount > 0 ? 'rgba(0,217,166,0.15)' : 'rgba(255,71,87,0.15)',
                  color: record.amount > 0 ? COLORS.success : COLORS.error,
                }}>
                  {record.type === 'withdraw' ? '提现' : '收入'}
                </span>
                <div>
                  <p style={styles.recordNote}>{record.note}</p>
                  <p style={styles.recordTime}>
                    {new Date(record.createTime).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <span style={{
                ...styles.recordAmount,
                color: record.amount > 0 ? COLORS.success : COLORS.error,
              }}>
                {record.amount > 0 ? '+' : ''}{record.amount.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
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
  balanceCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    margin: '12px',
    borderRadius: '16px',
    padding: '20px',
  },
  balanceTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  balanceLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    margin: '0 0 4px 0',
  },
  balanceValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  withdrawBtn: {
    padding: '8px 20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '18px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
  },
  balanceBottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  balanceSubItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  balanceSubLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
  },
  balanceSubValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceDivider: {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    margin: '0 12px 16px',
    backgroundColor: COLORS.border,
    borderRadius: '12px',
    overflow: 'hidden',
  },
  statCard: {
    backgroundColor: COLORS.card,
    padding: '14px 8px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  section: {
    padding: '0 12px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '12px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  emptyIcon: {
    fontSize: '36px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: COLORS.textSecondary,
  },
  recordItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    marginBottom: '8px',
    border: `1px solid ${COLORS.border}`,
  },
  recordLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  recordType: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  recordNote: {
    fontSize: '14px',
    color: COLORS.text,
    margin: '0 0 2px 0',
  },
  recordTime: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  recordAmount: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
}
