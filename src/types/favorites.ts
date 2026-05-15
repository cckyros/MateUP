// ========== 收藏相关类型 ==========

export interface FavoriteItem {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string | null
  playerRank: string | null
  playerGames: string[]
  playerPrice: number
  playerRating: number
  playerOrdersCount: number
  isOnline: boolean
  createTime?: number
}
