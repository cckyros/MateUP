import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import FavoritesPage from './pages/FavoritesPage'
import { useUserStore } from '@/store'
import { pageTransition } from '@/utils/animations'

// 页面包装器 - 统一路由动画
const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ minHeight: '100vh' }}
  >
    {children}
  </motion.div>
)

// 路由守卫：陪玩师页面需要 isPlayer 才能访问
interface PlayerRouteGuardProps {
  children: React.ReactNode
}

const PlayerRouteGuard: React.FC<PlayerRouteGuardProps> = ({ children }) => {
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
    '/player-earnings', '/player-reviews', '/favorites',
  ]
  const shouldHide = noTabPages.some((p) =>
    location.pathname === p || location.pathname.startsWith('/player-detail')
  )
  if (shouldHide) return null

  return (
    <motion.div
      style={styles.tabBar}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.15 }}
    >
      {tabs.map((tab, i) => (
        <motion.div
          key={tab.path}
          style={{
            ...styles.tabItem,
            color: location.pathname === tab.path ? '#FF6B9D' : 'rgba(255,255,255,0.4)',
          }}
          onClick={() => navigate(tab.path)}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span style={styles.tabIcon}>{tab.icon}</span>
          <span style={styles.tabLabel}>{tab.label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// 路由内容（需要 location 作为 key 给 AnimatePresence）
const RoutesContent = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><CoverPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/home" element={<AnimatedPage><HomePage /></AnimatedPage>} />
        <Route path="/player/:id" element={<AnimatedPage><PlayerDetailPage /></AnimatedPage>} />
        <Route path="/orders" element={<AnimatedPage><OrdersPage /></AnimatedPage>} />
        <Route path="/order-detail/:id" element={<AnimatedPage><OrderDetailPage /></AnimatedPage>} />
        <Route path="/chat" element={<AnimatedPage><ChatPage /></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
        <Route path="/search" element={<AnimatedPage><SearchPage /></AnimatedPage>} />
        <Route path="/payment" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
        <Route path="/payment/:id" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
        <Route path="/notifications" element={<AnimatedPage><NotificationPage /></AnimatedPage>} />
        <Route path="/settings" element={<AnimatedPage><SettingsPage /></AnimatedPage>} />

        {/* Phase 7 - 角色系统 */}
        <Route path="/apply-player" element={<AnimatedPage><ApplyPlayerPage /></AnimatedPage>} />
        <Route path="/apply-status" element={<AnimatedPage><ApplyStatusPage /></AnimatedPage>} />
        <Route path="/favorites" element={<AnimatedPage><FavoritesPage /></AnimatedPage>} />
        <Route
          path="/player-home"
          element={
            <AnimatedPage>
              <PlayerRouteGuard><PlayerHomePage /></PlayerRouteGuard>
            </AnimatedPage>
          }
        />
        <Route
          path="/player-orders"
          element={
            <AnimatedPage>
              <PlayerRouteGuard><PlayerOrdersPage /></PlayerRouteGuard>
            </AnimatedPage>
          }
        />
        <Route
          path="/player-profile"
          element={
            <AnimatedPage>
              <PlayerRouteGuard><PlayerProfilePage /></PlayerRouteGuard>
            </AnimatedPage>
          }
        />
        <Route
          path="/player-earnings"
          element={
            <AnimatedPage>
              <PlayerRouteGuard><PlayerEarningsPage /></PlayerRouteGuard>
            </AnimatedPage>
          }
        />
        <Route
          path="/player-reviews"
          element={
            <AnimatedPage>
              <PlayerRouteGuard><PlayerReviewsPage /></PlayerRouteGuard>
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <RoutesContent />
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
