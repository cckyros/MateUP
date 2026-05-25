import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
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
  tabBar: {
    display: 'flex',
    backgroundColor: COLORS.card,
    padding: '0 8px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    padding: '14px 0',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  tabBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
    color: '#fff',
  },
  list: {
    padding: '12px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    border: `1px solid ${COLORS.border}`,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderId: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  statusTag: {
    fontSize: '12px',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  orderBody: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  orderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 4px 0',
  },
  orderMeta: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  remark: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: '4px 0 0 0',
    fontStyle: 'italic',
  },
  priceBlock: {
    textAlign: 'right',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  acceptBtn: {
    padding: '8px 24px',
    backgroundColor: COLORS.success,
    border: 'none',
    borderRadius: '18px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '8px 24px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '18px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  completeBtn: {
    padding: '8px 24px',
    backgroundColor: COLORS.primary,
    border: 'none',
    borderRadius: '18px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
  },
}
