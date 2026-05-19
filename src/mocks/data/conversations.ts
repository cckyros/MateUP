import type { Conversation, ChatMessage } from '@/types'

const now = Date.now()
const MIN = 60000
const HOUR = 3600000
const DAY = 86400000

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    partnerId: 'p1',
    partnerName: '小甜',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    lastMessage: '好的没问题，今晚8点准时开始~',
    lastTime: now - 5 * MIN,
    unreadCount: 2,
  },
  {
    partnerId: 'p2',
    partnerName: '柚子',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    lastMessage: '昨天的对局很开心，下次继续！',
    lastTime: now - 1 * HOUR,
    unreadCount: 0,
  },
  {
    partnerId: 'p5',
    partnerName: '林妹',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linn',
    lastMessage: '我下午3点上线，到时候联系你',
    lastTime: now - 3 * HOUR,
    unreadCount: 1,
  },
  {
    partnerId: 'p6',
    partnerName: '奶茶',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MilkTea',
    lastMessage: '谢谢评价！欢迎下次再来~',
    lastTime: now - 1 * DAY,
    unreadCount: 0,
  },
  {
    partnerId: 'p9',
    partnerName: '甜甜',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sweet',
    lastMessage: '晚上10点有空哦，要不要来一局？',
    lastTime: now - 2 * DAY,
    unreadCount: 0,
  },
]

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  p1: [
    { id: 'msg_1_1', type: 'chat', from: 'user_001', to: 'p1', content: '你好，我想约今晚的王者荣耀陪玩', timestamp: now - 30 * MIN, isSelf: true },
    { id: 'msg_1_2', type: 'chat', from: 'p1', to: 'user_001', content: '你好呀~ 今晚几点方便呢？', timestamp: now - 28 * MIN, isSelf: false },
    { id: 'msg_1_3', type: 'chat', from: 'user_001', to: 'p1', content: '晚上8点可以吗', timestamp: now - 25 * MIN, isSelf: true },
    { id: 'msg_1_4', type: 'chat', from: 'p1', to: 'user_001', content: '好的没问题，今晚8点准时开始~', timestamp: now - 5 * MIN, isSelf: false },
  ],
  p2: [
    { id: 'msg_2_1', type: 'chat', from: 'user_001', to: 'p2', content: '昨天的对局打得很爽！', timestamp: now - 2 * HOUR, isSelf: true },
    { id: 'msg_2_2', type: 'chat', from: 'p2', to: 'user_001', content: '是呀，你进步很大哦', timestamp: now - 1.5 * HOUR, isSelf: false },
    { id: 'msg_2_3', type: 'chat', from: 'user_001', to: 'p2', content: '嘿嘿，多亏你带飞', timestamp: now - 1.2 * HOUR, isSelf: true },
    { id: 'msg_2_4', type: 'chat', from: 'p2', to: 'user_001', content: '昨天的对局很开心，下次继续！', timestamp: now - 1 * HOUR, isSelf: false },
  ],
  p5: [
    { id: 'msg_5_1', type: 'chat', from: 'p5', to: 'user_001', content: '你好，我是林妹，APEX陪玩', timestamp: now - 5 * HOUR, isSelf: false },
    { id: 'msg_5_2', type: 'chat', from: 'user_001', to: 'p5', content: '你好！我想约下午的APEX', timestamp: now - 4 * HOUR, isSelf: true },
    { id: 'msg_5_3', type: 'chat', from: 'p5', to: 'user_001', content: '我下午3点上线，到时候联系你', timestamp: now - 3 * HOUR, isSelf: false },
  ],
  p6: [
    { id: 'msg_6_1', type: 'chat', from: 'user_001', to: 'p6', content: '今天的和平精英打得不错！给你个好评', timestamp: now - 1.2 * DAY, isSelf: true },
    { id: 'msg_6_2', type: 'chat', from: 'p6', to: 'user_001', content: '谢谢评价！欢迎下次再来~', timestamp: now - 1 * DAY, isSelf: false },
  ],
  p9: [
    { id: 'msg_9_1', type: 'chat', from: 'p9', to: 'user_001', content: '晚上10点有空哦，要不要来一局？', timestamp: now - 2 * DAY, isSelf: false },
    { id: 'msg_9_2', type: 'chat', from: 'user_001', to: 'p9', content: '好呀，到时候叫我', timestamp: now - 1.9 * DAY, isSelf: true },
  ],
}
