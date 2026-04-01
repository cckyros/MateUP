import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import CoverPage from './pages/CoverPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/PlayerListPage'
import PlayerDetailPage from './pages/PlayerDetailPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import PaymentPage from './pages/PaymentPage'
import NotificationPage from './pages/NotificationPage'
import SettingsPage from './pages/SettingsPage'
import ApplyPlayerPage from './pages/ApplyPlayerPage'
import ApplyStatusPage from './pages/ApplyStatusPage'
import PlayerHomePage from './pages/PlayerHomePage'
import PlayerOrdersPage from './pages/PlayerOrdersPage'
import PlayerProfilePage from './pages/PlayerProfilePage'
import PlayerEarningsPage from './pages/PlayerEarningsPage'
import PlayerReviewsPage from './pages/PlayerReviewsPage'
import { useUserStore } from './store'

// 路由守卫：陪玩师页面需要 isPlayer 才能访问
const PlayerRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((s) => s.user)
  const navigate = useNavigate()
  if (!user?.isPlayer) {
    navigate('/apply-player')
    return null
  }
  return <>{children}</>
}

// 底部导航栏组件
const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUserStore((s) => s.user)

  const tabs = [
    { path: '/home', label: '首页', icon: '🏠' },
    { path: '/orders', label: '订单', icon: '📋' },
    { path: '/chat', label: '聊天', icon: '💬' },
    { path: '/profile', label: '我的', icon: '👤' },
  ]

  // 这些页面不显示 tab bar
  const noTabPages = [
    '/', '/login', '/player', '/search',
    '/order-detail', '/payment', '/notifications', '/settings',
    '/apply-player', '/apply-status',
    '/player-home', '/player-orders', '/player-profile',
    '/player-earnings', '/player-reviews',
  ]
  const shouldHide = noTabPages.some((p) =>
    location.pathname === p || location.pathname.startsWith('/player-detail')
  )
  if (shouldHide) return null

  return (
    <div style={styles.tabBar}>
      {tabs.map((tab) => (
        <div
          key={tab.path}
          style={{
            ...styles.tabItem,
            color: location.pathname === tab.path ? '#FF6B9D' : 'rgba(255,255,255,0.4)',
          }}
          onClick={() => navigate(tab.path)}
        >
          <span style={styles.tabIcon}>{tab.icon}</span>
          <span style={styles.tabLabel}>{tab.label}</span>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Routes>
          {/* 基础页面 */}
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-detail/:id" element={<OrderDetailPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Phase 7 - 角色系统 */}
          <Route path="/apply-player" element={<ApplyPlayerPage />} />
          <Route path="/apply-status" element={<ApplyStatusPage />} />
          <Route
            path="/player-home"
            element={
              <PlayerRouteGuard>
                <PlayerHomePage />
              </PlayerRouteGuard>
            }
          />
          <Route
            path="/player-orders"
            element={
              <PlayerRouteGuard>
                <PlayerOrdersPage />
              </PlayerRouteGuard>
            }
          />
          <Route
            path="/player-profile"
            element={
              <PlayerRouteGuard>
                <PlayerProfilePage />
              </PlayerRouteGuard>
            }
          />
          <Route
            path="/player-earnings"
            element={
              <PlayerRouteGuard>
                <PlayerEarningsPage />
              </PlayerRouteGuard>
            }
          />
          <Route
            path="/player-reviews"
            element={
              <PlayerRouteGuard>
                <PlayerReviewsPage />
              </PlayerRouteGuard>
            }
          />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}

const styles = {
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#16213e',
    minHeight: '100vh',
    position: 'relative',
  },
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  tabItem: {
    textAlign: 'center',
    fontSize: '11px',
    cursor: 'pointer',
    flex: 1,
    padding: '4px 0',
  },
  tabIcon: {
    display: 'block',
    fontSize: '22px',
    marginBottom: '2px',
  },
  tabLabel: {
    display: 'block',
  },
}

export default App
