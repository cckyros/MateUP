import { MOCK_ORDERS } from '../data/orders'
import { MOCK_PLAYERS } from '../data/players'
import type { Order } from '../../store/order'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const orderHandlers = {
  async getOrders(): Promise<{ orders: Order[] }> {
    await delay(300)
    return { orders: MOCK_ORDERS }
  },

  async createOrder(playerId: string, duration: number, game: string): Promise<Order> {
    await delay(400)
    const player = MOCK_PLAYERS.find((p) => p.id === playerId)
    if (!player) throw new Error('陪玩师不存在')

    const newOrder: Order = {
      id: 'order_' + Date.now(),
      playerId,
      playerName: player.name,
      playerAvatar: player.avatar,
      game,
      duration,
      price: player.price * duration,
      status: 'CREATED',
      createTime: Date.now(),
    }
    MOCK_ORDERS.unshift(newOrder)
    return newOrder
  },

  async payOrder(orderId: string): Promise<Order> {
    await delay(800)
    const order = MOCK_ORDERS.find((o) => o.id === orderId)
    if (order) {
      order.status = 'WAIT_ACCEPT'
      order.payTime = Date.now()
    }
    return order!
  },

  async getOrderDetail(orderId: string): Promise<Order | null> {
    await delay(200)
    return MOCK_ORDERS.find((o) => o.id === orderId) || null
  },

  async respondOrder(orderId: string, action: 'accept' | 'reject') {
    await delay(400)
    return { success: true }
  },
}
