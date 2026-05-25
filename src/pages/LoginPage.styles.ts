import { COLORS } from '@/constants'
import { Styles } from '@/utils/styles'

export const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
  },
  closeBtn: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#fff',
  },
  switchBtn: {
    fontSize: '14px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  logoArea: {
    textAlign: 'center',
    padding: '40px 0 30px',
  },
  logo: {
    fontSize: '72px',
    display: 'block',
    marginBottom: '12px',
  },
  appName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  slogan: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  form: {
    padding: '0 24px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '0 16px',
    marginBottom: '14px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  prefix: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.6)',
    marginRight: '8px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '14px 0',
    fontSize: '15px',
    color: '#fff',
  },
  codeBtn: {
    fontSize: '13px',
    color: COLORS.primary,
    cursor: 'pointer',
    flexShrink: 0,
    padding: '8px 0',
  },
  codeBtnDisabled: {
    color: 'rgba(255,255,255,0.3)',
    cursor: 'not-allowed',
  },
  errorTip: {
    color: COLORS.error,
    fontSize: '12px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  thirdParty: {
    display: 'flex',
    gap: '12px',
  },
  thirdPartyBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '25px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#fff',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  agreement: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '24px',
    padding: '0 20px',
    lineHeight: '1.6',
  },
  link: {
    color: COLORS.primary,
  },
  testTip: {
    textAlign: 'center',
    fontSize: '11px',
    color: COLORS.success,
    marginTop: '12px',
    padding: '0 20px',
  },
}

