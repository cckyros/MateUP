import type { Player } from '@/types'
import { GAME_CN_TO_KEY } from '@/constants'

/**
 * Normalize raw API player data to the standard Player interface.
 * Handles field name differences between API versions.
 */
export const normalizePlayer = (raw: Record<string, unknown>): Player => ({
  id: String(raw.id || ''),
  name: String(raw.name || ''),
  avatar: raw.avatar as string | null,
  rank: raw.rank as string | null,
  tags: (raw.tags as string[]) || [],
  price: Number(raw.price || 0),
  isOnline: Boolean(raw.online ?? raw.isOnline),
  games: Array.isArray(raw.games)
    ? raw.games
    : [GAME_CN_TO_KEY[String(raw.game)] || String(raw.game || 'lol')],
  rating: Number(raw.rating || 0),
  ordersCount: Number(raw.orders ?? raw.ordersCount ?? 0),
  description: raw.description as string | undefined,
})

export const getLevelColor = (rank?: string | null): string => {
  if (!rank) return '#FFFFFF'
  if (rank.includes('王者')) return '#FFD700'
  if (rank.includes('大师')) return '#C0C0C0'
  if (rank.includes('钻石')) return '#B9F2F0'
  return '#90EE90'
}
