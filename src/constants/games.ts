// ========== 游戏相关常量 ==========

export const GAMES = {
  LOL: 'lol',
  王者: 'honor',
  永劫: 'yongjie',
  APEX: 'apex',
  蛋仔: 'danzai',
} as const

export type GameType = (typeof GAMES)[keyof typeof GAMES]

export const GAME_NAMES: Record<string, string> = {
  lol: '英雄联盟',
  honor: '王者荣耀',
  yongjie: '永劫无间',
  apex: '和平精英',
  danzai: '蛋仔派对',
}

export const GAME_CN_TO_KEY: Record<string, string> = {
  '王者荣耀': 'honor',
  '和平精英': 'apex',
  '英雄联盟': 'lol',
  '永劫无间': 'yongjie',
  '蛋仔派对': 'danzai',
}

export const GAME_KEY_TO_CN: Record<string, string> = Object.fromEntries(
  Object.entries(GAME_CN_TO_KEY).map(([k, v]) => [v, k])
)

export const GAME_TABS = [
  { key: 'all', label: '全部', value: undefined },
  { key: 'honor', label: '王者荣耀', value: 'honor' },
  { key: 'apex', label: '和平精英', value: 'apex' },
  { key: 'lol', label: '英雄联盟', value: 'lol' },
  { key: 'yongjie', label: '永劫无间', value: 'yongjie' },
] as const
