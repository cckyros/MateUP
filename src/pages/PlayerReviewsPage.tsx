// 评价管理页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'
import { usePlayerProfileStore } from '../store'
import { playerApi } from '../api'
import { Styles } from '@/utils/styles'

export default function PlayerReviewsPage() {
  const navigate = useNavigate()
  const { reviews, setReviews } = usePlayerProfileStore()
  const [replying, setReplying] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    playerApi.getPlayerReviews().then((res: any) => setReviews(res.reviews || [])).catch(() => {})
  }, [])

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return
    setReplying(reviewId)
    await playerApi.replyReview(reviewId, replyText)
    usePlayerProfileStore.getState().setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, replied: true, reply: replyText } : r
      )
    )
    setReplyText('')
    setReplying(null)
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.nav}>
        <span style={styles.back} onClick={() => navigate(-1)}>←</span>
        <span style={styles.navTitle}>评价管理</span>
        <span style={{ width: '24px' }} />
      </div>

      {/* 评价概览 */}
      <div style={styles.overviewCard}>
        <div style={styles.overviewItem}>
          <span style={styles.overviewValue}>{reviews.length}</span>
          <span style={styles.overviewLabel}>全部评价</span>
        </div>
        <div style={styles.overviewDivider} />
        <div style={styles.overviewItem}>
          <span style={styles.overviewValue}>{reviews.filter((r) => r.replied).length}</span>
          <span style={styles.overviewLabel}>已回复</span>
        </div>
        <div style={styles.overviewDivider} />
        <div style={styles.overviewItem}>
          <span style={styles.overviewValue}>
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '—'}
          </span>
          <span style={styles.overviewLabel}>平均评分</span>
        </div>
      </div>

      {/* 评价列表 */}
      <div style={styles.list}>
        {reviews.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>⭐</span>
            <p style={styles.emptyText}>暂无评价</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <img src={review.userAvatar} style={styles.avatar} alt="" />
                <div style={styles.reviewMeta}>
                  <p style={styles.userName}>{review.userName}</p>
                  <p style={styles.stars}>{renderStars(review.rating)}</p>
                </div>
                <span style={styles.reviewTime}>
                  {new Date(review.createTime).toLocaleString('zh-CN', { dateStyle: 'medium' })}
                </span>
              </div>

              <p style={styles.comment}>{review.comment}</p>

              {review.replied ? (
                <div style={styles.replyBlock}>
                  <p style={styles.replyLabel}>我的回复：</p>
                  <p style={styles.replyText}>{review.reply}</p>
                </div>
              ) : (
                <div style={styles.replyArea}>
                  <textarea
                    style={styles.replyInput}
                    placeholder="回复用户评价..."
                    value={replying === review.id ? replyText : ''}
                    onChange={(e) => {
                      setReplying(review.id)
                      setReplyText(e.target.value)
                    }}
                    rows={2}
                  />
                  <div style={styles.replyActions}>
                    <button
                      style={styles.cancelBtn}
                      onClick={() => { setReplying(null); setReplyText('') }}
                    >
                      取消
                    </button>
                    <button
                      style={{ ...styles.submitBtn, opacity: (replying === review.id && !replyText.trim()) ? 0.6 : 1 }}
                      onClick={() => handleReply(review.id)}
                      disabled={replying === review.id && !replyText.trim()}
                    >
                      {replying === review.id ? '发送中...' : '发送回复'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
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
  overviewCard: {
    display: 'flex',
    backgroundColor: COLORS.card,
    margin: '12px',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  overviewItem: {
    flex: 1,
    textAlign: 'center',
  },
  overviewValue: {
    display: 'block',
    fontSize: '22px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  overviewLabel: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  overviewDivider: {
    width: '1px',
    backgroundColor: COLORS.border,
    margin: '0 8px',
  },
  list: {
    padding: '0 12px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    border: `1px solid ${COLORS.border}`,
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  reviewMeta: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 2px 0',
  },
  stars: {
    fontSize: '12px',
    margin: 0,
  },
  reviewTime: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  comment: {
    fontSize: '14px',
    color: COLORS.text,
    lineHeight: 1.5,
    margin: '0 0 10px 0',
  },
  replyBlock: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '10px 12px',
    borderLeft: `3px solid ${COLORS.primary}`,
  },
  replyLabel: {
    fontSize: '12px',
    color: COLORS.primary,
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  replyText: {
    fontSize: '13px',
    color: COLORS.text,
    margin: 0,
  },
  replyArea: {
    marginTop: '4px',
  },
  replyInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    padding: '10px',
    fontSize: '13px',
    color: COLORS.text,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  replyActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  cancelBtn: {
    padding: '7px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '7px 16px',
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '14px',
    fontSize: '12px',
    color: '#fff',
    cursor: 'pointer',
  },
}
