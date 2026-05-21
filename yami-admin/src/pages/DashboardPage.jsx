import React from 'react'
import {
  Row, Col, Card, Statistic, Table, Tag, Space, Typography,
  Progress, Badge, Divider
} from 'antd'
import {
  UserOutlined, DollarOutlined, GiftOutlined, StarOutlined,
  ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography

// ── Mock data ──────────────────────────────────────────────
const stats = [
  {
    title: '创作者总数',
    value: 24,
    suffix: '人',
    icon: <UserOutlined />,
    color: '#16997F',
    trend: +3,
    trendLabel: '较上月',
  },
  {
    title: '本月待打款',
    value: 1047.60,
    prefix: '$',
    precision: 2,
    icon: <DollarOutlined />,
    color: '#16997F',
    trend: +12.4,
    trendLabel: '较上月',
    isPercent: true,
  },
  {
    title: '样品领取中',
    value: 4,
    suffix: '款',
    icon: <GiftOutlined />,
    color: '#FA8005',
    trend: null,
  },
  {
    title: '置顶推荐商品',
    value: 2,
    suffix: '个',
    icon: <StarOutlined />,
    color: '#3383FF',
    trend: null,
  },
]

const recentApplications = [
  { key: '1', name: 'Amy Chen', email: 'amy@email.com', avatar: 'A', appliedAt: '2026-04-10', status: 'pending', platforms: 'Instagram · TikTok' },
  { key: '2', name: 'Jason Liu', email: 'jason@email.com', avatar: 'J', appliedAt: '2026-04-09', status: 'pending', platforms: 'YouTube · Instagram' },
  { key: '3', name: 'Mia Wang', email: 'mia@email.com', avatar: 'M', appliedAt: '2026-04-08', status: 'pending', platforms: '小红书' },
  { key: '4', name: 'Kevin Zhang', email: 'kevin@email.com', avatar: 'K', appliedAt: '2026-04-07', status: 'approved', platforms: 'TikTok' },
  { key: '5', name: 'Sarah Park', email: 'sarah@email.com', avatar: 'S', appliedAt: '2026-04-06', status: 'rejected', platforms: 'Instagram' },
]

const topCreators = [
  { key: '1', name: 'Mia Wang', avatar: 'M', earnings: 412.80, orders: 18, convRate: '9.2%' },
  { key: '2', name: 'Amy Chen', avatar: 'A', earnings: 386.20, orders: 22, convRate: '8.7%' },
  { key: '3', name: 'Jason Liu', avatar: 'J', earnings: 248.60, orders: 11, convRate: '6.4%' },
]

const categoryBreakdown = [
  { category: 'K-Beauty & Skincare', gmv: 4820, percent: 46 },
  { category: 'Snacks & Noodles', gmv: 3240, percent: 31 },
  { category: 'Sweets & Desserts', gmv: 1120, percent: 11 },
  { category: 'Tea & Beverages', gmv: 620, percent: 6 },
  { category: 'Cooking & Pantry', gmv: 420, percent: 4 },
  { category: 'Home & Living', gmv: 210, percent: 2 },
]

const statusConfig = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已拒绝' },
}

const appColumns = [
  {
    title: '创作者',
    render: (_, r) => (
      <Space>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#16997F', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}>{r.avatar}</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
        </div>
      </Space>
    ),
  },
  { title: '平台', dataIndex: 'platforms', render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text> },
  { title: '申请时间', dataIndex: 'appliedAt', render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text> },
  {
    title: '状态',
    dataIndex: 'status',
    render: s => <Tag color={statusConfig[s].color}>{statusConfig[s].text}</Tag>,
  },
]

// ── Component ──────────────────────────────────────────────
export default function DashboardPage({ onNavigate }) {
  return (
    <div>
      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <Col span={6} key={i}>
            <Card style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#222222', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    {s.prefix}{typeof s.value === 'number' && s.precision ? s.value.toFixed(s.precision) : s.value}{s.suffix ? ` ${s.suffix}` : ''}
                  </div>
                  <div style={{ height: 24, marginTop: 8 }}>
                    {s.trend !== null && s.trend !== undefined ? (
                      s.trend > 0
                        ? <Text style={{ color: '#52c41a', fontSize: 12 }}><ArrowUpOutlined /> {s.isPercent ? `${s.trend}%` : `+${s.trend}`} {s.trendLabel}</Text>
                        : <Text style={{ color: '#ff4d4f', fontSize: 12 }}><ArrowDownOutlined /> {Math.abs(s.trend)} {s.trendLabel}</Text>
                    ) : null}
                  </div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `${s.color}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: s.color,
                }}>{s.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        {/* Recent Applications */}
        <Col span={14}>
          <Card
            title={<Space><ClockCircleOutlined style={{ color: '#16997F' }} /><span>最新申请</span></Space>}
            extra={
              <Space size={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>3 个待审核</Text>
                <a
                  href="#"
                  style={{ fontSize: 12, color: '#16997F', fontWeight: 500 }}
                  onClick={e => { e.preventDefault(); onNavigate && onNavigate('review') }}
                >查看全部 →</a>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={appColumns}
              dataSource={recentApplications}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Right column */}
        <Col span={10}>
          {/* Top Creators */}
          <Card
            title="本月佣金 Top 3"
            style={{ marginBottom: 16 }}
          >
            {topCreators.map((c, i) => (
              <div key={c.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                  <Text style={{
                    width: 20, textAlign: 'center', fontWeight: 700,
                    color: i === 0 ? '#16997F' : i === 1 ? '#FA8005' : '#B4B4B4',
                    fontSize: 15,
                  }}>#{i + 1}</Text>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#16997F', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600,
                  }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{c.orders} 单 · 转化率 {c.convRate}</Text>
                  </div>
                  <Text strong style={{ color: '#16997F', fontSize: 14 }}>${c.earnings.toFixed(2)}</Text>
                </div>
                {i < topCreators.length - 1 && <Divider style={{ margin: 0 }} />}
              </div>
            ))}
          </Card>

          {/* Category Breakdown */}
          <Card title="本月佣金品类分布">
            {categoryBreakdown.map(c => (
              <div key={c.category} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12 }}>{c.category}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>${c.gmv.toLocaleString()} · {c.percent}%</Text>
                </div>
                <Progress
                  percent={c.percent}
                  showInfo={false}
                  strokeColor="#16997F"
                  trailColor="#F5F5F5"
                  size={['100%', 6]}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
