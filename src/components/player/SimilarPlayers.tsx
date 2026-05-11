// ============================================================
// SimilarPlayers - 相似陪玩师横向滚动
// ============================================================
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { colors, borderRadius, fontSize } from '@/theme'
import { OnlineDot } from '../ui/Badge'
import type { Player } from '@/store/player/types'

interface SimilarPlayersProps {
  players: Player[]
}

export const SimilarPlayers = memo(function SimilarPlayers({
  players,
}: SimilarPlayersProps) {
  const navigate = useNavigate()

  if (!players.length) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 4,
      }}
    >
      {players.map(player => (
        <motion.div
          key={player.id}
          onClick={() => navigate(`/player/${player.id}`)}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            flexShrink: 0,
            width: 90,
            backgroundColor: colors.card,
            borderRadius: borderRadius.md,
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* 头像 */}
          <div style={{ position: 'relative', marginBottom: 4 }}>
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span style={{ fontSize: 24 }}>💫</span>
            )}
            {player.isOnline && (
              <OnlineDot size={10} />
            )}
          </div>

          <span
            style={{
              fontSize: fontSize.sm,
              fontWeight: 'bold',
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {player.name}
          </span>
          <span
            style={{
              fontSize: fontSize.xs,
              color: '#FFD700',
              fontWeight: 'bold',
            }}
          >
            ¥{player.price}/h
          </span>
          <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
            ⭐{player.rating || '5.0'}
          </span>
        </motion.div>
      ))}
    </div>
  )
})