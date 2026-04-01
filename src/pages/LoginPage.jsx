// 登录页 - 已接入真实 API
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store'
import { login, register } from '../api/user'
import { getApplyStatus } from '../api/apply'
import { COLORS } from '../constants'

const LoginPage = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 发送验证码
  const sendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 提交登录/注册
  const handleSubmit = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }

    if (!isLogin && password.length < 6) {
      setError('密码不能少于6位')
      return
    }

    if (isLogin && !password) {
      setError('请输入密码')
      return
    }

    setError('')
    setLoading(true)

    try {
      let res
      if (isLogin) {
        res = await login({ phone, password: password || '123456' })
      } else {
        res = await register({ phone, password, username: '用户_' + phone.slice(-4) })
      }

      // 更新 store
      setToken(res.token)

      // 同步获取陪玩师申请状态
      try {
        const applyRes = await getApplyStatus()
        const statusMap: Record<number, string> = {
          1: 'pending',
          3: 'approved',
          4: 'rejected',
        }
        const playerStatus = statusMap[applyRes.step] || 'none'
        setUser({ ...res.user, playerStatus: playerStatus as any, isPlayer: playerStatus === 'approved' })
      } catch {
        setUser({ ...res.user, playerStatus: 'none', isPlayer: false })
      }

      // 跳转到首页
      navigate('/home')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.closeBtn} onClick={() => navigate('/')}>✕</span>
        <span style={styles.headerTitle}>{isLogin ? '登录' : '注册'}</span>
        <span style={styles.switchBtn} onClick={() => {
          setIsLogin(!isLogin)
          setError('')
        }}>
          {isLogin ? '注册' : '登录'}
        </span>
      </div>

      {/* Logo区 */}
      <div style={styles.logoArea}>
        <span style={styles.logo}>💫</span>
        <h1 style={styles.appName}>伴游</h1>
        <p style={styles.slogan}>游戏陪玩 · 语音陪伴 · 开心每一天</p>
      </div>

      {/* 表单 */}
      <div style={styles.form}>
        {/* 手机号 */}
        <div style={styles.inputGroup}>
          <span style={styles.prefix}>+86</span>
          <input
            style={styles.input}
            type="tel"
            placeholder="请输入手机号"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={11}
          />
        </div>

        {/* 验证码 */}
        <div style={styles.inputGroup}>
          <input
            style={{ ...styles.input, flex: 1 }}
            type="text"
            placeholder="请输入验证码"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
          />
          <span
            style={{
              ...styles.codeBtn,
              ...(countdown > 0 ? styles.codeBtnDisabled : {}),
            }}
            onClick={countdown === 0 ? sendCode : undefined}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </span>
        </div>

        {/* 密码（注册时） */}
        {!isLogin && (
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              type="password"
              placeholder="设置密码（6位以上）"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* 错误提示 */}
        {error && <div style={styles.errorTip}>{error}</div>}

        {/* 登录按钮 */}
        <button
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.submitBtnDisabled : {}),
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '登录中...' : (isLogin ? '登录' : '注册')}
        </button>

        {/* 第三方登录 */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>其他登录方式</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.thirdParty}>
          <div style={styles.thirdPartyBtn}>🍎 Apple登录</div>
          <div style={styles.thirdPartyBtn}>💬 微信登录</div>
        </div>
      </div>

      {/* 协议 */}
      <p style={styles.agreement}>
        {isLogin ? '登录即表示同意' : '注册即表示同意'}
        <span style={styles.link}>《用户协议》</span>和
        <span style={styles.link}>《隐私政策》</span>
      </p>

      {/* 测试提示 */}
      <div style={styles.testTip}>
        测试账号：13800138000（任意验证码）
      </div>
    </div>
  )
}

// ========== 样式 ==========
const styles = {
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

export default LoginPage
