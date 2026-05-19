import type { User, PlayerProfile } from '@/types'

export const MOCK_USER: User = {
  id: 'user_001',
  username: '小明同学',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
  phone: '13900008888',
  isPlayer: false,
  playerStatus: 'none',
}

export const MOCK_PLAYER_PROFILE: PlayerProfile = {
  id: 'user_001',
  name: '小明同学',
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
  balance: 1256.50,
  pendingWithdrawal: 200,
  totalEarnings: 8560,
  totalWithdrawn: 6800,
}

export const MOCK_LOGIN_RESPONSE = {
  token: 'mock_token_' + Date.now(),
  user: {
    id: MOCK_USER.id,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    phone: MOCK_USER.phone,
    isPlayer: MOCK_USER.isPlayer,
    playerStatus: MOCK_USER.playerStatus,
  },
}
