// 封面页 - 已统一暗色风格 + 登录状态检测 + 热门陪玩Banner
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store'
import { styles } from './CoverPage.styles'

// 热门陪玩师 Mock 数据（后续替换为真实 API: GET /api/players/hot）
const hotPlayers = [
  { id: 1, name: '小美', avatar: '👩', level: '金牌陪玩', rating: 4.9, ordersCount: 892, game: '王者荣耀', price: 80 },
  { id: 2, name: '阿杰', avatar: '👨', level: '银牌陪玩', rating: 4.8, ordersCount: 564, game: '和平精英', price: 60 },
  { id: 3, name: '小林', avatar: '👩', level: '金牌陪玩', rating: 5.0, ordersCount: 1203, game: '永劫无间', price: 100 },
]

const CoverPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useUserStore()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true })
    }
  }, [isLoggedIn, navigate])

  const features = [
    {
      icon: '🎮',
      title: '海量陪玩',
      desc: '王者荣耀、和平精英...热门游戏全覆盖',
    },
    {
      icon: '🎧',
      title: '语音连麦',
      desc: '实时语音，边玩边聊，欢乐不间断',
    },
    {
      icon: '🛡️',
      title: '安全支付',
      desc: '平台担保交易，资金安全有保障',
    },
    {
      icon: '⭐',
      title: '真实评价',
      desc: '查看真实评价，找到靠谱陪玩',
    },
  ]

  return (
    <div style={styles.container}>
      {/* 顶部 Banner */}
      <div style={styles.banner}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>💫</div>
          <div>
            <h1 style={styles.appName}>伴游</h1>
            <p style={styles.slogan}>游戏陪玩 · 语音陪伴 · 开心每一天</p>
          </div>
        </div>
        <p style={styles.stats}>
          已有 <span style={styles.highlight}>5万+</span> 玩家加入
        </p>
      </div>

      {/* 热门陪玩师 Banner */}
      <div style={styles.hotSection}>
        <div style={styles.hotHeader}>
          <div style={styles.hotTitleRow}>
            <span style={styles.hotFire}>🔥</span>
            <span style={styles.hotTitle}>热门陪玩师</span>
          </div>
          <span style={styles.hotMore} onClick={() => navigate('/home')}>查看更多 →</span>
        </div>
        <div style={styles.hotList}>
          {hotPlayers.map((player) => (
            <div
              key={player.id}
              style={styles.hotCard}
              onClick={() => navigate(`/player/${player.id}`)}
            >
              <span style={styles.hotAvatar}>{player.avatar}</span>
              <span style={styles.hotOnlineDot} />
              <div style={styles.hotInfo}>
                <span style={styles.hotName}>{player.name}</span>
                <span style={styles.hotLevel}>{player.level}</span>
              </div>
              <div style={styles.hotStats}>
                <span style={styles.hotRating}>⭐ {player.rating}</span>
                <span style={styles.hotOrders}>接单 {player.ordersCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 特性卡片 */}
      <div style={styles.mainContent}>
        {features.map((f, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div style={styles.bottomArea}>
        <button
          style={styles.loginBtn}
          onClick={() => navigate('/login')}
        >
          立即登录
        </button>
        <button
          style={styles.guestBtn}
          onClick={() => navigate('/home')}
        >
          先逛逛
        </button>
      </div>

      <p style={styles.downloadTip}>下载 App 获取更多功能</p>
    </div>
  )
}

// ========== 样式 ==========

export default CoverPage
