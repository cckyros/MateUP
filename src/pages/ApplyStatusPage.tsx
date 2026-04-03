// 审核中状态页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'
import { useApplyStore } from '../store'
import { getApplyStatus } from '../api/apply'
import { Styles } from '@/utils/styles'

export default function ApplyStatusPage() {
  const navigate = useNavigate()
  const { status, submittedAt, setStatus } = useApplyStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从真实 API 获取最新状态
    getApplyStatus()
      .then((res) => {
        // step: 1=PENDING, 3=APPROVED, 4=REJECTED
        const statusMap = {
          1: 'pending',
          3: 'approved',
          4: 'rejected',
        }
        const s = statusMap[res.data.step] || 'pending'
        setStatus(s, res.data.submittedAt || null, res.data.rejectedReason || null)
      })
      .catch(() => {
        // API 失败时用本地缓存状态
      })
      .finally(() => setLoading(false))
  }, [])

  const timeStr = submittedAt
    ? new Date(submittedAt).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })
    : ''

  if (status === 'approved') {
    return (
      <div style={styles.container}>
        <div style={styles.nav}>
          <span style={styles.back} onClick={() => navigate(-1)}>←</span>
          <span style={styles.navTitle}>申请结果</span>
          <span style={{ width: '24px' }} />
        </div>
        <div style={styles.centerContent}>
          <div style={styles.iconLarge}>🎉</div>
          <h2 style={styles.title}>恭喜！审核已通过</h2>
          <p style={styles.subtitle}>您已正式成为陪玩师，快去工作台接单吧～</p>
          <button style={styles.primaryBtn} onClick={() => navigate('/player-home')}>
            进入工作台
          </button>
          <button style={styles.ghostBtn} onClick={() => navigate('/profile')}>
            返回个人中心
          </button>
        </div>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div style={styles.container}>
        <div style={styles.nav}>
          <span style={styles.back} onClick={() => navigate(-1)}>←</span>
          <span style={styles.navTitle}>申请结果</span>
          <span style={{ width: '24px' }} />
        </div>
        <div style={styles.centerContent}>
          <div style={styles.iconLarge}>😢</div>
          <h2 style={styles.title}>审核未通过</h2>
          <p style={styles.subtitle}>抱歉，您的申请未通过审核<br />可修改资料后重新提交</p>
          <button style={styles.primaryBtn} onClick={() => navigate('/apply-player')}>
            重新申请
          </button>
          <button style={styles.ghostBtn} onClick={() => navigate('/profile')}>
            返回个人中心
          </button>
        </div>
      </div>
    )
  }

  // pending
  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>申请状态</span>
        <span style={{ width: '24px' }} />
      </div>
      <div style={styles.centerContent}>
        <div style={styles.spinnerWrap}>
          <div style={styles.spinner} />
        </div>
        <h2 style={styles.title}>申请已提交</h2>
        <p style={styles.subtitle}>
          我们已收到您的申请<br />
          管理员将在1-3个工作日内完成审核
        </p>
        {timeStr && <p style={styles.time}>提交时间：{timeStr}</p>}

        <div style={styles.steps}>
          {[
            { done: true, text: '填写申请资料' },
            { done: true, text: '提交申请' },
            { done: false, current: true, text: '等待审核' },
            { done: false, text: '审核通过' },
          ].map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={{
                ...styles.stepDot,
                backgroundColor: step.done ? COLORS.success : step.current ? COLORS.primary : COLORS.border,
              }}>
                {step.done ? '✓' : ''}
              </div>
              {i < 3 && <div style={{
                ...styles.stepLine,
                backgroundColor: step.done ? COLORS.success : COLORS.border,
              }} />}
              <span style={{
                ...styles.stepText,
                color: step.done || step.current ? COLORS.text : COLORS.textSecondary,
              }}>{step.text}</span>
            </div>
          ))}
        </div>

        <button style={styles.ghostBtn} onClick={() => navigate('/profile')}>
          返回个人中心
        </button>
      </div>
    </div>
  )
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
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
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 24px 24px',
  },
  iconLarge: {
    fontSize: '72px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 12px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 1.6,
    margin: '0 0 20px 0',
  },
  time: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    marginBottom: '32px',
  },
  steps: {
    width: '100%',
    maxWidth: '280px',
    marginBottom: '40px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    position: 'relative',
  },
  stepDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
    flexShrink: 0,
  },
  stepLine: {
    position: 'absolute',
    left: '11px',
    top: '-16px',
    width: '2px',
    height: '16px',
  },
  stepText: {
    fontSize: '14px',
    marginLeft: '8px',
  },
  primaryBtn: {
    width: '100%',
    maxWidth: '280px',
    padding: '14px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  ghostBtn: {
    width: '100%',
    maxWidth: '280px',
    padding: '14px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '25px',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  spinnerWrap: {
    marginBottom: '20px',
  },
  spinner: {
    width: '56px',
    height: '56px',
    border: `4px solid ${COLORS.border}`,
    borderTopColor: COLORS.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
}
