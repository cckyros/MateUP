import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/store'
import { pageTransition, SPRING } from '@/utils/animations'
import { COLORS } from '@/constants'
import { ListSkeleton } from '@/components'

// ========== 路由懒加载 ==========
const CoverPage = lazy(() => import('./pages/CoverPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const HomePage = lazy(() => import('./pages/PlayerListPage'))
const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const NotificationPage = lazy(() => import('./pages/NotificationPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ApplyPlayerPage = lazy(() => import('./pages/ApplyPlayerPage'))
const ApplyStatusPage = lazy(() => import('./pages/ApplyStatusPage'))
const PlayerHomePage = lazy(() => import('./pages/PlayerHomePage'))
const PlayerOrdersPage = lazy(() => import('./pages/PlayerOrdersPage'))
const PlayerProfilePage = lazy(() => import('./pages/PlayerProfilePage'))
const PlayerEarningsPage = lazy(() => import('./pages/PlayerEarningsPage'))
const PlayerReviewsPage = lazy(() => import('./pages/PlayerReviewsPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

// 加载 fallback — 骨架屏
const PageFallback = () => (
  <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', paddingTop: 60 }}>
    <ListSkeleton count={6} />
  </div>
)

// 页面包装器 — 统一弹簧物理过渡动画
const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ minHeight: '100vh' }}
  >
    <Suspense fallback={<PageFallback />}>
      {children}
    </Suspense>
  </motion.div>
)

// 路由守卫：陪玩师页面需要 isPlayer 才能访问
const PlayerRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user)
  const navigate = useNavigate()
  if (!user?.isPlayer) {
    navigate('/apply-player')
    return null
  }
  return <>{children}</>
}

// 底部导航栏
const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/home', label: '首页', icon: '🏠' },
    { path: '/orders', label: '订单', icon: '📋' },
    { path: '/chat', label: '聊天', icon: '💬' },
    { path: '/profile', label: '我的', icon: '👤' },
  ]

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
      transition={SPRING.gentle}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <motion.div
            key={tab.path}
            style={{
              ...styles.tabItem,
              color: isActive ? COLORS.primary : COLORS.textMuted,
            }}
            onClick={() => navigate(tab.path)}
            whileTap={{ scale: 0.85 }}
            transition={SPRING.tactile}
          >
            <motion.span
              style={styles.tabIcon}
              animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={SPRING.bouncy}
            >
              {tab.icon}
            </motion.span>
            <span style={styles.tabLabel}>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tab-dot"
                style={styles.tabDot}
                transition={SPRING.snappy}
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// 路由内容
const RoutesContent = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
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
        <Route path="/apply-player" element={<AnimatedPage><ApplyPlayerPage /></AnimatedPage>} />
        <Route path="/apply-status" element={<AnimatedPage><ApplyStatusPage /></AnimatedPage>} />
        <Route path="/favorites" element={<AnimatedPage><FavoritesPage /></AnimatedPage>} />
        <Route
          path="/player-home"
          element={<AnimatedPage><PlayerRouteGuard><PlayerHomePage /></PlayerRouteGuard></AnimatedPage>}
        />
        <Route
          path="/player-orders"
          element={<AnimatedPage><PlayerRouteGuard><PlayerOrdersPage /></PlayerRouteGuard></AnimatedPage>}
        />
        <Route
          path="/player-profile"
          element={<AnimatedPage><PlayerRouteGuard><PlayerProfilePage /></PlayerRouteGuard></AnimatedPage>}
        />
        <Route
          path="/player-earnings"
          element={<AnimatedPage><PlayerRouteGuard><PlayerEarningsPage /></PlayerRouteGuard></AnimatedPage>}
        />
        <Route
          path="/player-reviews"
          element={<AnimatedPage><PlayerRouteGuard><PlayerReviewsPage /></PlayerRouteGuard></AnimatedPage>}
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

const styles: Record<string, React.CSSProperties> = {
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.background,
    minHeight: '100vh',
    position: 'relative',
  },
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.card,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 16px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  tabItem: {
    textAlign: 'center',
    fontSize: 11,
    cursor: 'pointer',
    flex: 1,
    padding: '4px 0',
    position: 'relative',
  },
  tabIcon: {
    display: 'block',
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    display: 'block',
  },
  tabDot: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
}

export default App
