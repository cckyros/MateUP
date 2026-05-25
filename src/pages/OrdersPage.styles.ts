import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '70px',
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  statsCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    margin: '12px',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
  },
  statsLeft: {
    borderRight: '1px solid rgba(255,255,255,0.3)',
    paddingRight: '16px',
  },
  statsLabel: {
    fontSize: '12px',
    opacity: 0.9,
    color: 'rgba(255,255,255,0.8)',
  },
  statsValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSub: {
    fontSize: '11px',
    opacity: 0.8,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '6px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    fontSize: '12px',
  },
  statLabel: {
    opacity: 0.9,
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    backgroundColor: COLORS.card,
    display: 'flex',
    padding: '0 12px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    padding: '12px 0',
    fontSize: '14px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold',
  },
  orderList: {
    padding: '12px',
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  orderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  gameTag: {
    backgroundColor: 'rgba(255,107,157,0.15)',
    color: COLORS.primary,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  gameIcon: {
    fontSize: '14px',
  },
  orderStatus: {
    fontSize: '13px',
    fontWeight: 'bold',
  },
  boosterInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  boosterAvatar: {
    fontSize: '40px',
    display: 'block',
  },
  boosterDetail: {
    flex: 1,
  },
  boosterName: {
    display: 'block',
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '2px',
  },
  boostLevel: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  duration: {
    textAlign: 'right',
  },
  durationLabel: {
    display: 'block',
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  durationValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
  },
  orderTime: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  orderPrice: {
    textAlign: 'right',
  },
  priceLabel: {
    display: 'block',
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  orderId: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  orderCreated: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  editBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  chatBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    cursor: 'pointer',
  },
  finishBtn: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    color: '#fff',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
    border: 'none',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: '14px',
  },
}

