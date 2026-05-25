import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    minWidth: '20px',
    textAlign: 'center',
  },
  tabBar: {
    display: 'flex',
    padding: '12px 16px',
    gap: '24px',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    paddingBottom: '8px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tabActive: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    fontWeight: 'bold',
  },
  tabBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: '10px',
    padding: '1px 5px',
    borderRadius: '8px',
  },
  list: {
    padding: '0',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
    gap: '14px',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  unreadItem: {
    backgroundColor: 'rgba(255,107,157,0.05)',
  },
  itemIcon: {
    fontSize: '32px',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: COLORS.card,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: `1px solid ${COLORS.border}`,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  itemTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemTime: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  itemDesc: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: 0,
    lineHeight: '1.5',
  },
  unreadDot: {
    position: 'absolute',
    top: '20px',
    right: '16px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: COLORS.primary,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: 0,
  },
}

