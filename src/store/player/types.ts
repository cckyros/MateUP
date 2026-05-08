export interface Player {
  id: string
  name: string
  avatar: string | null
  rank: string | null
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
  description?: string
}

export interface PlayerFilters {
  game?: string
  priceMin?: number
  priceMax?: number
  onlineOnly: boolean
  sortBy?: 'comprehensive' | 'price_asc' | 'price_desc' | 'rating'
}
