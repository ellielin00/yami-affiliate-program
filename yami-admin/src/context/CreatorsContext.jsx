import React, { createContext, useContext, useState } from 'react'

// ── 活跃度判断：3个月内有效销售额 >= $300 ──
export const ACTIVE_THRESHOLD = 300
export const ACTIVE_WINDOW_MONTHS = 3

// ── Mock 近3个月销售额（用于活跃度计算）──
export const mockSales3M = {
  '1': 480.50,  // 活跃
  '2': 248.60,  // 不活跃
  '3': 315.00,  // 活跃
  '4': 320.00,  // 活跃
  '5': 120.00,  // 不活跃
}

export const isActive = (creatorKey) =>
  (mockSales3M[creatorKey] || 0) >= ACTIVE_THRESHOLD

// ── 一级品类默认佣金比例 ──
export const CATEGORY_DEFAULT_RATES = {
  snacks:  5,
  beauty:  8,
  tea:     5,
  sweets:  5,
  cooking: 6,
  home:    6,
}

// ── 初始创作者数据 ──
const initialCreators = [
  {
    key: '1', name: 'Amy Chen', email: 'amy@email.com', avatar: 'A',
    type: 'influencer',
    registeredAt: '2026-03-15', status: 'approved',
    platforms: [
      { name: 'Instagram', url: '@amychen.eats', followers: '2.4K' },
      { name: 'TikTok', url: '@amychen', followers: '5.1K' },
      { name: 'YouTube', url: 'youtube.com/@amycheneats', followers: '890' },
    ],
    taxForm: 'submitted',
    commissionRates: { snacks: 5, beauty: 10, tea: 5, sweets: 5, cooking: 6, home: 6 },
    rateHistory: [{ date: '2026-04-01', category: 'K-Beauty & Skincare', from: 8, to: 10, by: 'Admin' }],
    // 创作者级别的 boost 覆盖：key = boost 的唯一标识，value = 覆盖后的比例
    boostOverrides: { cb1: 14, sb1: 18 },
    boostOverrideHistory: [
      { date: '2026-04-28', label: 'Snacks & Noodles › Instant Ramen', from: 12, to: 14, by: 'Admin' },
    ],
    totalEarnings: '$2,480.50',
    featureSamples: true,
  },
  {
    key: '2', name: 'Jason Liu', email: 'jason@email.com', avatar: 'J',
    type: 'influencer',
    registeredAt: '2026-03-20', status: 'approved',
    platforms: [{ name: 'YouTube', url: 'youtube.com/@jasonliu', followers: '12K' }],
    taxForm: 'not_submitted',
    commissionRates: { snacks: 5, beauty: 8, tea: 5, sweets: 5, cooking: 6, home: 6 },
    rateHistory: [],
    boostOverrides: {},
    boostOverrideHistory: [],
    totalEarnings: '$1,240.00',
    featureSamples: true,
  },
  {
    key: '3', name: 'Mia Wang', email: 'mia@email.com', avatar: 'M',
    type: 'influencer',
    registeredAt: '2026-04-01', status: 'approved',
    platforms: [{ name: '小红书', url: 'mia_yami', followers: '8.9K' }],
    taxForm: 'submitted',
    commissionRates: { snacks: 5, beauty: 12, tea: 5, sweets: 5, cooking: 6, home: 6 },
    rateHistory: [{ date: '2026-04-05', category: 'K-Beauty & Skincare', from: 8, to: 12, by: 'Admin' }],
    boostOverrides: {},
    boostOverrideHistory: [],
    totalEarnings: '$890.00',
    featureSamples: true,
  },
  {
    key: '4', name: 'Linda Park', email: 'linda@email.com', avatar: 'L',
    type: 'affiliate',
    registeredAt: '2026-03-10', status: 'approved',
    platforms: [{ name: 'Instagram', url: '@lindapark', followers: '1.2K' }],
    taxForm: 'submitted',
    commissionRates: { snacks: 5, beauty: 8, tea: 5, sweets: 5, cooking: 6, home: 6 },
    rateHistory: [],
    boostOverrides: {},
    boostOverrideHistory: [],
    totalEarnings: '$320.00',
    featureSamples: false,
  },
  {
    key: '5', name: 'Tom Rivera', email: 'tom@email.com', avatar: 'T',
    type: 'affiliate',
    registeredAt: '2026-04-05', status: 'approved',
    platforms: [{ name: 'TikTok', url: '@tomrivera', followers: '3.8K' }],
    taxForm: 'not_submitted',
    commissionRates: { snacks: 5, beauty: 8, tea: 5, sweets: 5, cooking: 6, home: 6 },
    rateHistory: [],
    boostOverrides: {},
    boostOverrideHistory: [],
    totalEarnings: '$120.00',
    featureSamples: false,
  },
]

const CreatorsContext = createContext(null)

export function CreatorsProvider({ children }) {
  const [creators, setCreators] = useState(initialCreators)

  // 全局开关：是否在 Affiliate 前台展示活跃度标签
  const [affiliateActivityVisible, setAffiliateActivityVisible] = useState(false)

  // 更新单个创作者
  const updateCreator = (key, patch) => {
    setCreators(prev => prev.map(c => c.key === key ? { ...c, ...patch } : c))
  }

  return (
    <CreatorsContext.Provider value={{
      creators, setCreators, updateCreator,
      affiliateActivityVisible, setAffiliateActivityVisible,
    }}>
      {children}
    </CreatorsContext.Provider>
  )
}

export function useCreators() {
  return useContext(CreatorsContext)
}
