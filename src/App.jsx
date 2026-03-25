import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CoverPage from './pages/CoverPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/PlayerListPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import PaymentPage from './pages/PaymentPage';
import NotificationPage from './pages/NotificationPage';
import SettingsPage from './pages/SettingsPage';

// 底部导航栏组件
const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/home', label: '首页', icon: '🏠' },
    { path: '/orders', label: '订单', icon: '📋' },
    { path: '/chat', label: '聊天', icon: '💬' },
    { path: '/profile', label: '我的', icon: '👤' },
  ];

  // 这些页面不显示 tab bar
  const noTabPages = [
    '/', '/login', '/player', '/search',
    '/order-detail', '/payment', '/notifications', '/settings'
  ];
  const shouldHide = noTabPages.some(p =>
    location.pathname === p || location.pathname.startsWith('/player')
  );
  if (shouldHide) return null;

  return (
    <div style={styles.tabBar}>
      {tabs.map(tab => (
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
  );
};

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Routes>
          {/* 封面 */}
          <Route path="/" element={<CoverPage />} />
          {/* 登录 */}
          <Route path="/login" element={<LoginPage />} />
          {/* 首页 - 陪玩列表 */}
          <Route path="/home" element={<HomePage />} />
          {/* 陪玩师详情 */}
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          {/* 订单列表 */}
          <Route path="/orders" element={<OrdersPage />} />
          {/* 订单详情 */}
          <Route path="/order-detail/:id" element={<OrderDetailPage />} />
          {/* 聊天 */}
          <Route path="/chat" element={<ChatPage />} />
          {/* 个人中心 */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* 搜索筛选 */}
          <Route path="/search" element={<SearchPage />} />
          {/* 支付 */}
          <Route path="/payment" element={<PaymentPage />} />
          {/* 通知 */}
          <Route path="/notifications" element={<NotificationPage />} />
          {/* 设置 */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  );
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
};

export default App;
