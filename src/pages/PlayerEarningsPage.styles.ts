import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
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
