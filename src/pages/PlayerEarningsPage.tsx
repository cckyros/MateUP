// 收入中心 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '@/constants'
import { getEarningsOverview, getEarningsList, withdraw } from '@/api/playerApi'
import { styles } from './PlayerEarningsPage.styles'

export default function PlayerEarningsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    Promise.all([
      getEarningsOverview(),
      getEarningsList(),
    ]).then(([overview, listRes]) => {
      setData({ ...overview, records: listRes.records })
    }).catch(() => {})
  }, [])

  const handleWithdraw = async () => {
    if (!data || data.balance <= 0) return
    setWithdrawing(true)
    try {
      await withdraw(data.balance)
      alert('提现申请已提交，预计1-3个工作日到账')
    } catch (e) {
      alert('提现失败，请重试')
    } finally {
      setWithdrawing(false)
    }
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
          data.records.map((record) => (
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

