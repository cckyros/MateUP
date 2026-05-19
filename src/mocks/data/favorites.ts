import type { FavoriteItem } from '@/types'
import { MOCK_PLAYERS } from './players'

export const MOCK_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav_p1',
    playerId: 'p1',
    playerName: MOCK_PLAYERS[0].name,
    playerAvatar: MOCK_PLAYERS[0].avatar,
    playerRank: MOCK_PLAYERS[0].rank,
    playerGames: MOCK_PLAYERS[0].games,
    playerPrice: MOCK_PLAYERS[0].price,
    playerRating: MOCK_PLAYERS[0].rating,
    playerOrdersCount: MOCK_PLAYERS[0].ordersCount,
    isOnline: MOCK_PLAYERS[0].isOnline,
    createTime: Date.now() - 86400000 * 3,
  },
  {
    id: 'fav_p2',
    playerId: 'p2',
    playerName: MOCK_PLAYERS[1].name,
    playerAvatar: MOCK_PLAYERS[1].avatar,
    playerRank: MOCK_PLAYERS[1].rank,
    playerGames: MOCK_PLAYERS[1].games,
    playerPrice: MOCK_PLAYERS[1].price,
    playerRating: MOCK_PLAYERS[1].rating,
    playerOrdersCount: MOCK_PLAYERS[1].ordersCount,
    isOnline: MOCK_PLAYERS[1].isOnline,
    createTime: Date.now() - 86400000 * 5,
  },
  {
    id: 'fav_p5',
    playerId: 'p5',
    playerName: MOCK_PLAYERS[4].name,
    playerAvatar: MOCK_PLAYERS[4].avatar,
    playerRank: MOCK_PLAYERS[4].rank,
    playerGames: MOCK_PLAYERS[4].games,
    playerPrice: MOCK_PLAYERS[4].price,
    playerRating: MOCK_PLAYERS[4].rating,
    playerOrdersCount: MOCK_PLAYERS[4].ordersCount,
    isOnline: MOCK_PLAYERS[4].isOnline,
    createTime: Date.now() - 86400000 * 7,
  },
]
