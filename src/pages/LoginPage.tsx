import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store'
import { login, register } from '@/api/user'
import { getApplyStatus } from '@/api/apply'
import { STORAGE_KEYS } from '@/constants'
import { styles } from './LoginPage.styles'

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

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const sendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')
    setCountdown(60)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          countdownRef.current = null
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
        const statusMap = {
          1: 'pending',
          3: 'approved',
          4: 'rejected',
        }
        const playerStatus = statusMap[applyRes.step] || 'none'
        setUser({ ...res.user, playerStatus, isPlayer: playerStatus === 'approved' })
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

export default LoginPage
