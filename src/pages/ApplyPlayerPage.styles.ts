import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '100px',
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
  content: {
    padding: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '10px',
  },
  required: {
    color: COLORS.error,
  },
  hint: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },
  gameGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  gameChip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '14px',
    color: COLORS.text,
    cursor: 'pointer',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  slider: {
    flex: 1,
    accentColor: COLORS.primary,
  },
  priceDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    minWidth: '80px',
  },
  priceValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  rankGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  rankChip: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '13px',
    color: COLORS.text,
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '12px',
    fontSize: '14px',
    color: COLORS.text,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '11px',
    color: COLORS.textSecondary,
    marginTop: '4px',
  },
  notice: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    border: `1px solid ${COLORS.border}`,
  },
  noticeText: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: '4px 0',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    padding: '16px',
    backgroundColor: COLORS.background,
    borderTop: `1px solid ${COLORS.border}`,
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
  },
}
