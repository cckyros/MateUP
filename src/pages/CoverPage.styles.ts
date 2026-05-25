import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
  },
  banner: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    padding: '50px 24px 30px',
    color: '#fff',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '56px',
  },
  appName: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
    color: '#fff',
  },
  slogan: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9,
  },
  stats: {
    fontSize: '14px',
    textAlign: 'center',
    margin: 0,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  // Hot Section
  hotSection: {
    padding: '16px 20px 8px',
  },
  hotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  hotTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  hotFire: {
    fontSize: '20px',
  },
  hotTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  hotMore: {
    fontSize: '13px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  hotList: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '4px',
    scrollbarWidth: 'none',
  },
  hotCard: {
    flexShrink: 0,
    width: '120px',
    backgroundColor: COLORS.card,
    borderRadius: '14px',
    padding: '14px 10px',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
    position: 'relative',
  },
  hotAvatar: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '6px',
  },
  hotOnlineDot: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '10px',
    height: '10px',
    backgroundColor: COLORS.success,
    borderRadius: '50%',
    border: `2px solid ${COLORS.card}`,
  },
  hotInfo: {
    marginBottom: '6px',
  },
  hotName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '2px',
  },
  hotLevel: {
    fontSize: '11px',
    color: '#FFD700',
  },
  hotStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  hotRating: {
    fontSize: '12px',
    color: '#FFD700',
  },
  hotOrders: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  mainContent: {
    padding: '8px 20px 0',
    flex: 1,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: '16px',
    padding: '18px 16px',
    marginBottom: '14px',
    gap: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  cardIcon: {
    fontSize: '36px',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '12px',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '16px',
    margin: '0 0 4px 0',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardDesc: {
    fontSize: '13px',
    margin: 0,
    color: COLORS.textSecondary,
  },
  bottomArea: {
    padding: '0 24px 16px',
  },
  loginBtn: {
    width: '100%',
    padding: '15px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
  },
  guestBtn: {
    width: '100%',
    padding: '15px',
    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #764ba2 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.accent}40`,
  },
  downloadTip: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    paddingBottom: '24px',
    margin: 0,
  },
}

