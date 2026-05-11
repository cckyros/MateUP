// ============================================================
// TabBar 组件 - 标签页切换
// ============================================================
import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { colors, fontSize, borderRadius } from '@/theme'

interface Tab {
  key: string
  label: string
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onChange: (key: string) => void
}

export const TabBar = memo(function TabBar({
  tabs,
  activeTab,
  onChange,
}: TabBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: colors.card,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {tabs.map(tab => (
        <div
          key={tab.key}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '14px 0',
            fontSize: fontSize.lg,
            color: activeTab === tab.key ? colors.primary : colors.textSecondary,
            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
            cursor: 'pointer',
            borderBottom: activeTab === tab.key
              ? `2px solid ${colors.primary}`
              : '2px solid transparent',
            transition: 'all 0.2s',
          }}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
})