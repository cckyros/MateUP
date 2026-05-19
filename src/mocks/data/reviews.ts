import type { Review } from '@/types'

const now = Date.now()
const HOUR = 3600000
const DAY = 86400000

export const MOCK_PLAYER_REVIEWS: Review[] = [
  {
    id: 'rv_001',
    orderId: 'po_003',
    userName: '张小强',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoQiang',
    rating: 5,
    comment: '陪玩师很专业，全程带飞，体验很好！下次还来',
    createTime: now - 1 * HOUR,
    replied: false,
  },
  {
    id: 'rv_002',
    orderId: 'po_004',
    userName: '赵小美',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoMei',
    rating: 5,
    comment: '声音好听，游戏技术很强，开黑超愉快！',
    createTime: now - 1 * DAY,
    replied: true,
    reply: '谢谢支持～欢迎下次再来！',
  },
  {
    id: 'rv_003',
    orderId: 'po_005',
    userName: '刘大壮',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaZhuang',
    rating: 4,
    comment: '总体不错，稍微有点跟不上节奏，但态度很好',
    createTime: now - 2 * DAY,
    replied: false,
  },
  {
    id: 'rv_004',
    orderId: 'order_002',
    userName: '王小明',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoMing',
    rating: 5,
    comment: '教了很多实用技巧，感觉自己水平提升了不少',
    createTime: now - 3 * DAY,
    replied: true,
    reply: '谢谢认可，你本身学习能力就很强！加油~',
  },
  {
    id: 'rv_005',
    orderId: 'order_005',
    userName: '陈小白',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoBai',
    rating: 5,
    comment: '非常有耐心，作为新手感觉很舒服，不会被嫌弃',
    createTime: now - 5 * DAY,
    replied: true,
    reply: '新手友好是我们的宗旨，期待下次见面~',
  },
  {
    id: 'rv_006',
    orderId: 'order_007',
    userName: '孙小红',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoHong',
    rating: 4,
    comment: '游戏陪玩不错，就是时间上稍微晚了点开始',
    createTime: now - 7 * DAY,
    replied: false,
  },
]

export const MOCK_USER_REVIEWS: Review[] = MOCK_PLAYER_REVIEWS.slice(0, 3)
