// 订单详情页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const OrderDetailPage = () => {
  const navigate = useNavigate()
  const [orderStatus, setOrderStatus] = useState('待接单')
  const [showCancelModal, setShowCancelModal] = useState(false)

  const order = {
    id: 'PG20260324002',
    status: '待接单',
    statusColor: '#FFD700',
    game: '王者荣耀',
    gameIcon: '🎮',
    booster: {
      name: '小美',
      avatar: '👩',
      level: '金牌陪玩',
      rating: 4.9,
      online: true,
    },
    levelUp: '星耀3 → 星耀2',
    duration: 2,
    price: 80,
    total: 160,
    createTime: '2026-03-24 14:00',
    startTime: '今天 20:00',
    remark: '希望小姐姐能带我上分，心态好不骂人',
  }

  const handleCancel = () => {
    setShowCancelModal(false)
    setOrderStatus('已取消')
  }

  return (
    <div style={styles.container}>
      {/* 顶部返回 */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
        <span style={styles.headerTitle}>订单详情</span>
        <span style={styles.moreBtn}>⋮</span>
      </div>

      {/* 状态卡片 */}
      <div style={styles.statusCard}>
        <div style={styles.statusIcon}>
          {orderStatus === '待接单' && '⏳'}
          {orderStatus === '进行中' && '🎮'}
          {orderStatus === '已完成' && '✅'}
          {orderStatus === '已取消' && '❌'}
        </div>
        <div style={styles.statusInfo}>
          <span style={{ ...styles.statusText, color: orderStatus === '已取消' ? COLORS.textSecondary : order.statusColor }}>
            {orderStatus}
          </span>
          <span style={styles.statusDesc}>
            {orderStatus === '待接单' && '陪玩师还未接单，可取消订单'}
            {orderStatus === '进行中' && '陪玩进行中，请耐心等待'}
            {orderStatus === '已完成' && '订单已完成，感谢使用伴游'}
            {orderStatus === '已取消' && '订单已取消'}
          </span>
        </div>
      </div>

      {/* 陪玩师信息 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>陪玩师</h3>
        <div style={styles.boosterCard}>
          <div style={styles.boosterAvatar}>{order.booster.avatar}</div>
          <div style={styles.boosterInfo}>
            <span style={styles.boosterName}>{order.booster.name}</span>
            <span style={styles.boosterLevel}>{order.booster.level}</span>
            <span style={styles.boosterRating}>⭐ {order.booster.rating}</span>
          </div>
          <div style={styles.boosterActions}>
            <div style={styles.chatBtn} onClick={() => navigate('/chat')}>💬</div>
            <div style={styles.callBtn}>📞</div>
          </div>
        </div>
      </div>

      {/* 订单信息 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>订单信息</h3>
        <div style={styles.infoGrid}>
          {[
            { label: '订单编号', value: order.id },
            { label: '游戏', value: `${order.gameIcon} ${order.game}` },
            { label: '段位要求', value: order.levelUp },
            { label: '陪玩时长', value: `${order.duration}小时` },
            { label: '预约时间', value: order.startTime },
            { label: '下单时间', value: order.createTime },
            { label: '备注', value: order.remark },
          ].map((item, i) => (
            <div key={i} style={styles.infoRow}>
              <span style={styles.infoLabel}>{item.label}</span>
              <span style={styles.infoValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 费用明细 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>费用明细</h3>
        <div style={styles.priceCard}>
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>单价</span>
            <span style={styles.priceText}>¥{order.price}/小时 × {order.duration}小时</span>
          </div>
          <div style={styles.priceDivider} />
          <div style={styles.priceRow}>
            <span style={styles.totalLabel}>应付总额</span>
            <span style={styles.totalValue}>¥{order.total}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={styles.bottomBar}>
        {orderStatus === '待接单' && (
          <>
            <div style={styles.cancelBtn} onClick={() => setShowCancelModal(true)}>取消订单</div>
            <div style={styles.editBtn}>修改备注</div>
          </>
        )}
        {orderStatus === '进行中' && (
          <div style={styles.chatMainBtn} onClick={() => navigate('/chat')}>
            💬 联系陪玩
          </div>
        )}
        {orderStatus === '已完成' && (
          <div style={styles.reOrderBtn} onClick={() => navigate('/home')}>
            再次预约
          </div>
        )}
      </div>

      {/* 取消弹窗 */}
      {showCancelModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>确认取消订单？</h3>
            <p style={styles.modalDesc}>取消后将退还全部金额</p>
            <div style={styles.modalBtns}>
              <div style={styles.modalCancel} onClick={() => setShowCancelModal(false)}>暂不取消</div>
              <div style={styles.modalConfirm} onClick={handleCancel}>确认取消</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== 暗色风格 ==========
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '80px',
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  moreBtn: {
    fontSize: '20px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  statusCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    margin: '16px',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statusIcon: {
    fontSize: '40px',
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '4px',
  },
  statusDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  boosterCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    border: `1px solid ${COLORS.border}`,
  },
  boosterAvatar: {
    fontSize: '48px',
  },
  boosterInfo: {
    flex: 1,
  },
  boosterName: {
    display: 'block',
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '4px',
  },
  boosterLevel: {
    display: 'block',
    fontSize: '12px',
    color: '#FFD700',
    marginBottom: '2px',
  },
  boosterRating: {
    fontSize: '13px',
    color: '#FFD700',
  },
  boosterActions: {
    display: 'flex',
    gap: '10px',
  },
  chatBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,107,157,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
  },
  callBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(76,175,80,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
  },
  infoGrid: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '4px 0',
    border: `1px solid ${COLORS.border}`,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  infoLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: '14px',
    color: COLORS.text,
  },
  priceCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  priceLabel: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  priceDivider: {
    height: '1px',
    backgroundColor: COLORS.border,
    margin: '12px 0',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: '15px',
    cursor: 'pointer',
  },
  editBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.text,
    textAlign: 'center',
    fontSize: '15px',
    cursor: 'pointer',
  },
  chatMainBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
    border: 'none',
  },
  reOrderBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '24px',
    backgroundColor: COLORS.primary,
    color: '#fff',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '24px',
    margin: '20px',
    maxWidth: '300px',
    width: '100%',
    border: `1px solid ${COLORS.border}`,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    margin: '0 0 10px 0',
  },
  modalDesc: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    textAlign: 'center',
    margin: '0 0 20px 0',
  },
  modalBtns: {
    display: 'flex',
    gap: '12px',
  },
  modalCancel: {
    flex: 1,
    padding: '12px',
    borderRadius: '20px',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: '14px',
    cursor: 'pointer',
  },
  modalConfirm: {
    flex: 1,
    padding: '12px',
    borderRadius: '20px',
    backgroundColor: COLORS.primary,
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
}

export default OrderDetailPage
