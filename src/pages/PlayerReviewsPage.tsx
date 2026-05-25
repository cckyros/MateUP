// 评价管理页 - Phase 7
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerProfileStore } from '@/store'
import { getPlayerReviews, replyReview } from '@/api/playerApi'
import { styles } from './PlayerReviewsPage.styles'

export default function PlayerReviewsPage() {
  const navigate = useNavigate()
  const { reviews, setReviews } = usePlayerProfileStore()
  const [replying, setReplying] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    getPlayerReviews().then((res) => setReviews(res.reviews)).catch(() => {})
  }, [])

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return
    setReplying(reviewId)
    await replyReview(reviewId, replyText)
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

