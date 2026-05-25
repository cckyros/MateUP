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
