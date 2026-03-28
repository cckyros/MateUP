// 订单评价组件 - 评分 + 文字 + 提交
import { useState } from 'react'
import { COLORS } from '../constants'

const OrderRating = ({ orderId, playerName, onSubmit, onClose }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://192.168.3.14:3000/api/orders/${orderId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      })
      if (res.ok) {
        setSubmitted(true)
        onSubmit?.({ rating, comment })
      } else {
        alert('提交失败，请重试')
      }
    } catch (e) {
      console.error('[OrderRating] submit error:', e)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h3 style={styles.successTitle}>评价成功</h3>
          <p style={styles.successDesc}>感谢您的反馈，期待下次相遇~</p>
          <div style={styles.successRating}>
            {[1,2,3,4,5].map(n => (
              <span key={n} style={{
                fontSize: '24px',
                color: n <= rating ? '#FFD700' : '#555',
              }}>★</span>
            ))}
          </div>
          <button style={styles.closeBtn2} onClick={onClose}>关闭</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>服务评价</h3>
          <span style={styles.closeBtn} onClick={onClose}>×</span>
        </div>
        <p style={styles.subtitle}>对陪玩师 {playerName} 的服务进行评价</p>

        <div style={styles.ratingSection}>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                style={{ ...styles.star, color: n <= rating ? '#FFD700' : '#555' }}
                onClick={() => setRating(n)}
              >
                ★
              </span>
            ))}
          </div>
          <span style={styles.ratingText}>
            {rating === 5 ? '非常满意' : rating === 4 ? '满意' : rating === 3 ? '一般' : rating === 2 ? '不满意' : '非常不满意'}
          </span>
        </div>

        <div style={styles.tags}>
          {['态度好', '技术强', '准时', '聊天开心', '会再来'].map(tag => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>

        <textarea
          style={styles.textarea}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="分享您的体验（选填）..."
          rows={4}
          maxLength={200}
        />
        <div style={styles.charCount}>{comment.length}/200</div>

        <button
          style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '提交中...' : '提交评价'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    padding: '20px',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: '20px',
    padding: '24px',
    width: '100%',
    maxWidth: '380px',
    border: `1px solid ${COLORS.border}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: 0,
  },
  closeBtn: {
    fontSize: '28px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    padding: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: '0 0 20px 0',
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  stars: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    fontSize: '32px',
    cursor: 'pointer',
  },
  ratingText: {
    fontSize: '14px',
    color: '#FFD700',
    fontWeight: 'bold',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  tag: {
    backgroundColor: 'rgba(255,107,157,0.15)',
    color: COLORS.primary,
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '13px',
    border: `1px solid ${COLORS.primary}40`,
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '12px',
    color: COLORS.text,
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '4px',
  },
  charCount: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: '16px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
  },
  successCard: {
    backgroundColor: COLORS.card,
    borderRadius: '20px',
    padding: '32px 24px',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  successIcon: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 8px 0',
  },
  successDesc: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: '0 0 20px 0',
  },
  successRating: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '24px',
  },
  closeBtn2: {
    width: '100%',
    padding: '12px',
    borderRadius: '20px',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
  },
}

export default OrderRating
