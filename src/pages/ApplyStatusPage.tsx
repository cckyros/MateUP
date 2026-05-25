// 审核中状态页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '@/constants'
import { useApplyStore } from '@/store'
import { getApplyStatus } from '@/api/apply'
import { styles } from './ApplyStatusPage.styles'

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
        const s = statusMap[res.step] || 'pending'
        setStatus(s, res.submittedAt || null, res.rejectedReason || null)
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

