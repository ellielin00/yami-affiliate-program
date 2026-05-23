import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb, Tag } from 'antd'
import {
  AppstoreFilled, DashboardFilled, ProfileFilled,
  ContactsFilled, WalletFilled, GiftFilled, StarFilled,
  PercentageOutlined
} from '@ant-design/icons'
import { CreatorsProvider } from './context/CreatorsContext'
import ReviewPage from './pages/ReviewPage'
import CreatorsPage from './pages/CreatorsPage'
import PayoutsPage from './pages/PayoutsPage'
import SamplesPage from './pages/SamplesPage'
import RecommendedPage from './pages/RecommendedPage'
import CommissionPage from './pages/CommissionPage'

const { Sider, Content, Header } = Layout

const menuItems = [
  {
    key: 'creators',
    icon: <AppstoreFilled />,
    label: '创作者中心',
    children: [
      { key: 'review',    label: '› 创作者审核' },
      { key: 'manage',    label: '› 创作者管理' },
      { key: 'payouts',   label: '› 结账管理' },
      { key: 'samples',   label: <div style={{ lineHeight: 1.3 }}>› 样品管理<div><Tag color="default" style={{ fontSize: 9, padding: '0 3px', lineHeight: '14px', marginTop: 2, opacity: 0.7 }}>首期不做</Tag></div></div> },
      { key: 'recommended', label: <div style={{ lineHeight: 1.3 }}>› 推荐商品管理<div><Tag color="default" style={{ fontSize: 9, padding: '0 3px', lineHeight: '14px', marginTop: 2, opacity: 0.7 }}>首期不做</Tag></div></div> },
      { key: 'commission', label: <div style={{ lineHeight: 1.3 }}>› 佣金管理<div><Tag color="default" style={{ fontSize: 9, padding: '0 3px', lineHeight: '14px', marginTop: 2, opacity: 0.7 }}>首期不做</Tag></div></div> },
    ],
  },
]

const pageTitles = {
  review: '创作者审核',
  manage: '创作者管理',
  payouts: '结账管理',
  samples: '样品管理',
  recommended: '推荐商品管理',
  commission: '佣金管理',
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('review')

  const renderPage = () => {
    switch (currentPage) {
      case 'review': return <ReviewPage />
      case 'manage': return <CreatorsPage />
      case 'payouts': return <PayoutsPage />
      case 'samples': return <SamplesPage />
      case 'recommended': return <RecommendedPage />
      case 'commission': return <CommissionPage />
      default: return <ReviewPage />
    }
  }

  return (
    <CreatorsProvider>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        theme="dark"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, overflow: 'auto' }}
      >
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#16997F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0
          }}>Y</div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
            Yami Admin
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={['creators']}
          selectedKeys={[currentPage]}
          items={menuItems}
          onClick={({ key }) => setCurrentPage(key)}
          style={{ marginTop: 4, borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          height: 56, lineHeight: '56px',
        }}>
          <Breadcrumb items={[
            { title: currentPage === 'dashboard' ? 'Yami Admin' : '创作者中心' },
            { title: pageTitles[currentPage] },
          ]} />
          <div style={{ fontSize: 13, color: '#666' }}>erin.lin · 管理员</div>
        </Header>

        <Content style={{
          padding: 24,
          background: '#F5F7FA',
          minHeight: 'calc(100vh - 56px)'
        }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
    </CreatorsProvider>
  )
}
