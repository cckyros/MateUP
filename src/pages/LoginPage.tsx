// ============================================================
// 登录页 - 重构后
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store'
import { login, register } from '@/api/user'
import { getApplyStatus } from '@/api/apply'
import { COLORS } from '@/constants'
import { Button, PrefixedInput, Input } from '@/components/ui'
import { useCountdown } from '@/hooks'

// ============================================================
// 主组件
// ============================================================
const LoginPage = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { countdown, restart: restartCountdown } = useCountdown(0)

  // ============================================================
  // 发送验证码
  // ============================================================
  const sendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')
    restartCountdown(60)
  }

  // ============================================================
  // 提交
  // ============================================================
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

      setToken(res.token)

      try {
        const applyRes = await getApplyStatus()
        const statusMap: Record<number, string> = { 1: 'pending', 3: 'approved', 4: 'rejected' }
        const playerStatus = statusMap[applyRes.data.step] || 'none'
        setUser({ ...res.user, playerStatus, isPlayer: playerStatus === 'approved' })
      } catch {
        setUser({ ...res.user, playerStatus: 'none', isPlayer: false })
      }

      navigate('/home')
    } catch (err) {
      setError((err as any)?.response?.data?.message || (err as any)?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSwitch = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <span style={styles.closeBtn} onClick={() => navigate('/')}>✕</span>
        <span style={styles.headerTitle}>{isLogin ? '登录' : '注册'}</span>
        <span style={styles.switchBtn} onClick={handleSwitch}>
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
        <div style={{ marginBottom: 14 }}>
          <PrefixedInput
            prefix="+86"
            type="tel"
            placeholder="请输入手机号"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={11}
          />
        </div>

        {/* 验证码 */}
        {!isLogin && (
          <div style={{ marginBottom: 14 }}>
            <div style={styles.codeRow}>
              <Input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                wrapperStyle={{ flex: 1, marginRight: 8 }}
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
          </div>
        )}

        {/* 密码 */}
        <div style={{ marginBottom: 14 }}>
          <Input
            type="password"
            placeholder={isLogin ? '请输入密码' : '设置密码（6位以上）'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* 错误提示 */}
        {error && <div style={styles.errorTip}>{error}</div>}

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="lg"
          loading={loading}
          onTap={handleSubmit}
          style={{ width: '100%', marginTop: 10 }}
        >
          {loading ? '登录中...' : (isLogin ? '登录' : '注册')}
        </Button>

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

// ============================================================
// 样式
// ============================================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: 40,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
  },
  closeBtn: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  switchBtn: {
    fontSize: 14,
    color: COLORS.primary,
    cursor: 'pointer',
  },
  logoArea: {
    textAlign: 'center' as const,
    padding: '40px 0 30px',
  },
  logo: {
    fontSize: 72,
    display: 'block',
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#fff',
    margin: '0 0 8px 0',
  },
  slogan: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  form: {
    padding: '0 24px',
  },
  codeRow: {
    display: 'flex',
    alignItems: 'center',
  },
  codeBtn: {
    fontSize: 13,
    color: COLORS.primary,
    cursor: 'pointer',
    flexShrink: 0,
    padding: '14px 0',
    minWidth: 90,
    textAlign: 'center' as const,
  },
  codeBtnDisabled: {
    color: 'rgba(255,255,255,0.3)',
    cursor: 'not-allowed' as const,
  },
  errorTip: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  thirdParty: {
    display: 'flex',
    gap: 12,
  },
  thirdPartyBtn: {
    flex: 1,
    padding: 12,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 25,
    textAlign: 'center' as const,
    fontSize: 14,
    color: '#fff',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  agreement: {
    textAlign: 'center' as const,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 24,
    padding: '0 20px',
    lineHeight: 1.6,
  },
  link: {
    color: COLORS.primary,
  },
  testTip: {
    textAlign: 'center' as const,
    fontSize: 11,
    color: COLORS.success,
    marginTop: 12,
    padding: '0 20px',
  },
}

export default LoginPage