export const MOCK_USER = {
  id: 'user_001',
  username: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
  phone: '13800138000',
  isPlayer: false,
  playerStatus: 'none' as const,
}

export const MOCK_PLAYER_PROFILE = {
  id: 'user_001',
  name: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
  games: ['lol', 'honor'],
  price: 40,
  rank: '钻石',
  description: '专业陪玩，擅长辅助和打野位置，语音连麦全程陪伴',
  isOnline: true,
  rating: 4.9,
  ordersCount: 328,
  weeklyOrders: 12,
  weeklyEarnings: 480,
  balance: 1256.5,
  pendingWithdrawal: 200,
  totalEarnings: 8560,
}
