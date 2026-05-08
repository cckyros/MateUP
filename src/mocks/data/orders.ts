import { Order } from '../../store/order'
import { MOCK_PLAYERS } from './players'

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order_001',
    playerId: '1',
    playerName: '小甜',
    playerAvatar: MOCK_PLAYERS[0].avatar,
    game: 'lol',
    duration: 2,
    price: 70,
    status: 'IN_PROGRESS',
    createTime: Date.now() - 3600000,
  },
  {
    id: 'order_002',
    playerId: '2',
    playerName: '柚子',
    playerAvatar: MOCK_PLAYERS[1].avatar,
    game: 'honor',
    duration: 3,
    price: 150,
    status: 'COMPLETED',
    createTime: Date.now() - 86400000,
    completeTime: Date.now() - 82800000,
  },
  {
    id: 'order_003',
    playerId: '5',
    playerName: '林妹',
    playerAvatar: MOCK_PLAYERS[4].avatar,
    game: 'apex',
    duration: 1,
    price: 60,
    status: 'WAIT_ACCEPT',
    createTime: Date.now() - 1800000,
  },
]
