import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '40px',
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
  },
  section: {
    padding: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  toggleList: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  toggleLeft: {
    flex: 1,
  },
  toggleLabel: {
    display: 'block',
    fontSize: '15px',
    color: COLORS.text,
    marginBottom: '2px',
  },
  toggleDesc: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  toggle: {
    width: '50px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '2px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
    border: `1px solid ${COLORS.border}`,
  },
  toggleOn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleDot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
  },
  toggleDotOn: {
    transform: 'translateX(22px)',
  },
  menuList: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  menuLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuIcon: {
    fontSize: '22px',
  },
  menuLabel: {
    display: 'block',
    fontSize: '15px',
    color: COLORS.text,
    marginBottom: '2px',
  },
  menuSub: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  menuArrow: {
    fontSize: '20px',
    color: COLORS.textSecondary,
  },
  logoutArea: {
    padding: '20px 16px 0',
  },
  logoutBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '25px',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  version: {
    textAlign: 'center',
    fontSize: '12px',
    color: COLORS.textSecondary,
    marginTop: '20px',
  },
}

