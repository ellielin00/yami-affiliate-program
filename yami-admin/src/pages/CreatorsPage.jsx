import React, { useState } from 'react'
import {
  Table, Button, Tag, Space, Input, Card, Avatar, Typography,
  Drawer, Divider, InputNumber, Form, Tooltip,
  Badge, Row, Col, Timeline, message, Tabs, Select, Statistic, Switch, Alert, Progress
} from 'antd'
import {
  SearchOutlined, EditOutlined, SaveOutlined, HistoryOutlined,
  CheckCircleOutlined, CloseCircleOutlined, BarChartOutlined,
  ThunderboltOutlined, GiftOutlined, TeamOutlined
} from '@ant-design/icons'
import { useCreators, isActive, mockSales3M, ACTIVE_THRESHOLD, CATEGORY_DEFAULT_RATES } from '../context/CreatorsContext'

const { Text, Title } = Typography

const CATEGORIES = [
  { key: 'snacks', label: 'Snacks & Noodles' },
  { key: 'beauty', label: 'K-Beauty & Skincare' },
  { key: 'tea', label: 'Tea & Beverages' },
  { key: 'sweets', label: 'Sweets & Desserts' },
  { key: 'cooking', label: 'Cooking & Pantry' },
  { key: 'home', label: 'Home & Living' },
]


const mockOrdersByCreator = {
  '1': [
    { id: 'YM-20260402-8812', product: 'Samyang Buldak Ramen x3', orderAmt: 20.97, commission: 7.17, status: 'confirmed', date: '2026-04-02' },
    { id: 'YM-20260403-9201', product: 'COSRX Snail Mucin Essence', orderAmt: 24.99, commission: 5.00, status: 'confirmed', date: '2026-04-03' },
    { id: 'YM-20260403-9305', product: 'LANEIGE Lip Mask x2', orderAmt: 48.00, commission: 9.60, status: 'confirmed', date: '2026-04-03' },
    { id: 'YM-20260409-1023', product: 'Calbee Jagariko x6', orderAmt: 83.94, commission: 2.80, status: 'pending', date: '2026-04-09' },
  ],
  '2': [
    { id: 'YM-20260404-1101', product: 'Nongshim Shin Ramyun x4', orderAmt: 39.96, commission: 8.00, status: 'confirmed', date: '2026-04-04' },
    { id: 'YM-20260405-1205', product: 'ANESSA Sunscreen', orderAmt: 29.99, commission: 6.00, status: 'confirmed', date: '2026-04-05' },
  ],
  '3': [
    { id: 'YM-20260403-2201', product: 'COSRX Snail Mucin x2', orderAmt: 49.98, commission: 10.00, status: 'confirmed', date: '2026-04-03' },
    { id: 'YM-20260406-2305', product: 'Innisfree Green Tea Serum', orderAmt: 26.50, commission: 5.30, status: 'confirmed', date: '2026-04-06' },
  ],
  '4': [
    { id: 'YM-20260410-3301', product: 'Pocky Chocolate x3', orderAmt: 14.97, commission: 2.25, status: 'confirmed', date: '2026-04-10' },
  ],
  '5': [],
}

const orderStatusConfig = {
  confirmed: { color: 'green', text: '已确认' },
  pending: { color: 'orange', text: '待确认' },
  cancelled: { color: 'default', text: '已取消' },
}

function ActivityBadge({ creatorKey }) {
  const active = isActive(creatorKey)
  return active
    ? <Tag style={{ background: '#D8F3E0', color: '#27812B' }}>活跃</Tag>
    : <Tag style={{ background: '#EBEBEB', color: '#525252' }}>不活跃</Tag>
}

export default function CreatorsPage() {
  const { creators, updateCreator, affiliateActivityVisible, setAffiliateActivityVisible } = useCreators()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  // 逐行编辑状态：{ catKey: tempValue } 或 null 表示未在编辑
  const [editingCat, setEditingCat] = useState(null)   // { key, value }

  const filtered = creators.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || c.type === filterType
    return matchSearch && matchType
  })

  const openDrawer = (record) => {
    setSelected(record)
    setEditingCat(null)
    setDrawerOpen(true)
  }

  // 保存单个一级品类佣金
  const saveCatRate = (catKey, catLabel, newRate) => {
    const oldRate = selected.commissionRates[catKey]
    if (newRate === oldRate) { setEditingCat(null); return }
    const now = new Date().toISOString().split('T')[0]
    const newHistory = [{ date: now, category: catLabel, from: oldRate, to: newRate, by: 'Admin' }, ...selected.rateHistory]
    const newRates = { ...selected.commissionRates, [catKey]: newRate }
    updateCreator(selected.key, { commissionRates: newRates, rateHistory: newHistory })
    setSelected(prev => ({ ...prev, commissionRates: newRates, rateHistory: newHistory }))
    setEditingCat(null)
    message.success(`${catLabel} 佣金比例已更新为 ${newRate}%`)
  }


  const toggleFeature = (key, feature, val) => {
    updateCreator(key, { [feature]: val })
    if (selected?.key === key) setSelected(prev => ({ ...prev, [feature]: val }))
  }

  const affiliateCount = creators.filter(c => c.type === 'affiliate').length
  const affiliateSamplesOn = creators.filter(c => c.type === 'affiliate' && c.featureSamples).length

  const columns = [
    {
      title: '创作者',
      render: (_, r) => (
        <Space>
          <Avatar style={{ background: r.type === 'influencer' ? '#16997F' : '#5B8DEF' }}>{r.avatar}</Avatar>
          <div>
            <Space size={6}>
              <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
              <Tag style={{
                background: r.type === 'influencer' ? '#D4EDDA' : '#E8EFFE',
                color: r.type === 'influencer' ? '#16997F' : '#3B6FD4',
                fontSize: 11,
              }}>{r.type === 'influencer' ? 'Influencer' : 'Affiliate'}</Tag>
            </Space>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text></div>
          </div>
        </Space>
      ),
    },

    {
      title: '活跃状态',
      render: (_, r) => <ActivityBadge creatorKey={r.key} />,
    },
    {
      title: '样品功能',
      render: (_, r) => (
        <Switch
          size="small"
          checked={r.featureSamples}
          onChange={v => toggleFeature(r.key, 'featureSamples', v)}
          checkedChildren="开" unCheckedChildren="关"
        />
      ),
    },
    {
      title: '累计佣金',
      dataIndex: 'totalEarnings',
      render: v => <Text strong style={{ color: '#16997F' }}>{v}</Text>,
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '操作',
      render: (_, r) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => openDrawer(r)}>详情</Button>
      ),
    },
  ]

  return (
    <div>
      {/* Affiliate 批量功能开关 */}
      {affiliateCount > 0 && (
        <Card
          style={{ marginBottom: 16 }}
          title={<Space><TeamOutlined style={{ color: '#5B8DEF' }} /><Text strong>Affiliate 批量功能管理</Text></Space>}
        >
          <Row gutter={24} align="middle">
            <Col>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 12 }}>Affiliate 活跃度标签（前台展示）</Text>
                <Space>
                  <Text style={{ fontSize: 13 }}>
                    {affiliateActivityVisible ? '已开启 — 活跃 Affiliate 可在前台看到活跃标签' : '已关闭 — Affiliate 前台不显示活跃标签'}
                  </Text>
                  <Switch
                    checked={affiliateActivityVisible}
                    onChange={v => {
                      setAffiliateActivityVisible(v)
                      message.success(v ? '已开启 Affiliate 活跃度前台展示' : '已关闭 Affiliate 活跃度前台展示')
                    }}
                    checkedChildren="开启" unCheckedChildren="关闭"
                  />
                </Space>
              </Space>
            </Col>
            <Col>
              <Divider type="vertical" style={{ height: 40 }} />
            </Col>
            <Col>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 12 }}>样品功能</Text>
                <Text style={{ fontSize: 13 }}>已开启 {affiliateSamplesOn} / {affiliateCount} 人（在创作者详情中单独开启）</Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索创作者姓名或邮箱"
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部类型' },
              { value: 'influencer', label: 'Influencer' },
              { value: 'affiliate', label: 'Affiliate' },
            ]}
          />
        </Space>
      </Card>

      <Card>
        <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} rowKey="key" />
      </Card>

      {/* 详情 Drawer */}
      <Drawer
        title={selected ? (
          <Space>
            <span>{selected.name}</span>
            <Tag style={{
              background: selected.type === 'influencer' ? '#D4EDDA' : '#E8EFFE',
              color: selected.type === 'influencer' ? '#16997F' : '#3B6FD4',
            }}>{selected.type === 'influencer' ? 'Influencer' : 'Affiliate'}</Tag>
          </Space>
        ) : ''}
        width={660}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selected && (
          <Tabs
            items={[
              {
                key: 'info',
                label: '基础信息',
                children: (
                  <div>
                    <Space style={{ marginBottom: 20 }}>
                      <Avatar size={56} style={{ background: selected.type === 'influencer' ? '#16997F' : '#5B8DEF', fontSize: 22 }}>{selected.avatar}</Avatar>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>{selected.name}</Title>
                        <Text type="secondary">{selected.email}</Text>
                        <div style={{ marginTop: 6 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>注册于 {selected.registeredAt}</Text>
                        </div>
                      </div>
                    </Space>

                    <Divider orientation="left">社媒账号</Divider>
                    {selected.platforms.map((p, i) => (
                      <Card key={i} size="small" style={{ marginBottom: 8 }}>
                        <Space>
                          <Tag>{p.name}</Tag>
                          <Text>{p.url}</Text>
                          <Text type="secondary">{p.followers} followers</Text>
                        </Space>
                      </Card>
                    ))}

                    <Divider orientation="left">税表状态</Divider>
                    {selected.taxForm === 'submitted'
                      ? <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text>税表已提交</Text></Space>
                      : <Space><CloseCircleOutlined style={{ color: '#ff4d4f' }} /><Text type="danger">税表未提交，无法打款</Text></Space>
                    }
                  </div>
                ),
              },
              {
                key: 'features',
                label: <Space><ThunderboltOutlined />功能权限</Space>,
                children: (
                  <div>
                    {selected.type === 'affiliate' && (
                      <Alert
                        message="Affiliate 默认不开启活跃度和样品功能，可在此单独为该用户开启。"
                        type="info" showIcon style={{ marginBottom: 20 }}
                      />
                    )}

                    {/* 活跃度展示 */}
                    <Card size="small" style={{ marginBottom: 12 }}>
                      <Row align="middle" justify="space-between">
                        <Col>
                          <Space direction="vertical" size={2}>
                            <Space>
                              <ThunderboltOutlined style={{ color: '#16997F' }} />
                              <Text strong>活跃度前台展示</Text>
                            </Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              活跃度由系统自动计算（3个月内有效销售额 ≥ ${ACTIVE_THRESHOLD}）。
                              {selected.type === 'influencer'
                                ? 'Influencer 默认展示活跃标签。'
                                : `Affiliate 展示由全局开关控制，当前${affiliateActivityVisible ? '已开启' : '已关闭'}。`}
                            </Text>
                          </Space>
                        </Col>
                        <Col>
                          <ActivityBadge creatorKey={selected.key} />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <Row align="middle" gutter={12}>
                          <Col flex="auto">
                            <Text style={{ fontSize: 12 }} type="secondary">近3个月有效销售额</Text>
                            <Progress
                              percent={Math.min(100, Math.round(((mockSales3M[selected.key] || 0) / ACTIVE_THRESHOLD) * 100))}
                              strokeColor={isActive(selected.key) ? '#16997F' : '#B4B4B4'}
                              size="small"
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                          <Col>
                            <Text strong style={{ color: isActive(selected.key) ? '#16997F' : '#949494' }}>
                              ${mockSales3M[selected.key] || 0} / ${ACTIVE_THRESHOLD}
                            </Text>
                          </Col>
                        </Row>
                      </div>
                    </Card>

                    {/* 样品功能 */}
                    <Card size="small">
                      <Row align="middle" justify="space-between">
                        <Col>
                          <Space direction="vertical" size={2}>
                            <Space>
                              <GiftOutlined style={{ color: '#16997F' }} />
                              <Text strong>样品功能（Free Sponsored Items）</Text>
                            </Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              开启后用户可在平台申请免费样品，需同时满足活跃状态
                            </Text>
                          </Space>
                        </Col>
                        <Col>
                          <Switch
                            checked={selected.featureSamples}
                            onChange={v => toggleFeature(selected.key, 'featureSamples', v)}
                            checkedChildren="已开启" unCheckedChildren="已关闭"
                          />
                        </Col>
                      </Row>
                      {selected.featureSamples && !isActive(selected.key) && (
                        <Alert
                          style={{ marginTop: 10 }}
                          message="该用户当前不活跃，样品功能已开启但用户暂无法领取"
                          type="warning" showIcon
                        />
                      )}
                    </Card>
                  </div>
                ),
              },
              {
                key: 'commission',
                label: '佣金比例',
                children: (
                  <div>
                    {/* 一级品类佣金 */}
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>一级品类佣金</Text>
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={CATEGORIES.map(cat => ({ ...cat }))}
                      rowKey="key"
                      style={{ marginBottom: 24 }}
                      columns={[
                        {
                          title: '品类',
                          dataIndex: 'label',
                          render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
                        },
                        {
                          title: '默认佣金',
                          render: (_, cat) => (
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {CATEGORY_DEFAULT_RATES[cat.key]}%
                            </Text>
                          ),
                          width: 90,
                        },
                        {
                          title: '当前比例',
                          render: (_, cat) => {
                            const current = selected.commissionRates[cat.key]
                            const isCustom = current !== CATEGORY_DEFAULT_RATES[cat.key]
                            return (
                              <Space size={4}>
                                <Text strong style={{ color: isCustom ? '#16997F' : undefined }}>
                                  {current}%
                                </Text>
                                {isCustom && <Tag color="green" style={{ fontSize: 11, padding: '0 5px' }}>已调整</Tag>}
                              </Space>
                            )
                          },
                          width: 130,
                        },
                        {
                          title: '操作',
                          width: 200,
                          render: (_, cat) => {
                            const isEditing = editingCat?.key === cat.key
                            if (isEditing) {
                              return (
                                <Space size={4}>
                                  <InputNumber
                                    size="small"
                                    min={0} max={100}
                                    value={editingCat.value}
                                    onChange={val => setEditingCat(prev => ({ ...prev, value: val }))}
                                    formatter={v => `${v}%`}
                                    parser={v => v.replace('%', '')}
                                    style={{ width: 80 }}
                                    autoFocus
                                  />
                                  <Button
                                    size="small" type="primary"
                                    style={{ background: '#16997F', borderColor: '#16997F' }}
                                    onClick={() => saveCatRate(cat.key, cat.label, editingCat.value)}
                                  >确认</Button>
                                  <Button size="small" onClick={() => setEditingCat(null)}>取消</Button>
                                </Space>
                              )
                            }
                            return (
                              <Button
                                size="small" icon={<EditOutlined />}
                                onClick={() => setEditingCat({ key: cat.key, value: selected.commissionRates[cat.key] })}
                              >编辑</Button>
                            )
                          },
                        },
                      ]}
                    />

                    {/* 修改记录（一级品类 + 活动佣金合并，按日期倒序） */}
                    {(() => {
                      const catHistory = (selected.rateHistory || []).map(h => ({ ...h, isBoost: false }))
                      const boostHistory = (selected.boostOverrideHistory || []).map(h => ({ ...h, isBoost: true }))
                      const allHistory = [...catHistory, ...boostHistory].sort((a, b) => b.date.localeCompare(a.date))
                      if (allHistory.length === 0) return null
                      return (
                        <>
                          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>修改记录</Text>
                          <Timeline items={allHistory.map((h, i) => ({
                            key: i,
                            color: h.isBoost ? '#fa8c16' : '#16997F',
                            children: (
                              <div>
                                <Space size={4}>
                                  <Text strong style={{ fontSize: 13 }}>{h.isBoost ? h.label : h.category}</Text>
                                  {h.isBoost && <Tag style={{ fontSize: 11 }}>活动佣金</Tag>}
                                </Space>
                                <div>
                                  <Text type="secondary" style={{ fontSize: 12 }}>{h.from}% → </Text>
                                  <Text strong style={{ color: h.isBoost ? '#fa8c16' : '#16997F', fontSize: 12 }}>{h.to}%</Text>
                                </div>
                                <div><Text type="secondary" style={{ fontSize: 11 }}>{h.date} · 由 {h.by} 修改</Text></div>
                              </div>
                            ),
                          }))} />
                        </>
                      )
                    })()}
                  </div>
                ),
              },
              {
                key: 'stats',
                label: <Space><BarChartOutlined />推广数据</Space>,
                children: (() => {
                  // 月度账单数据
                  const monthlyBills = [
                    { key: '1', month: 'April 2026', orders: 4, commission: 24.57, sales: 177.90, status: 'pending' },
                    { key: '2', month: 'March 2026', orders: 8, commission: 52.30, sales: 348.60, status: 'confirmed' },
                    { key: '3', month: 'February 2026', orders: 6, commission: 38.45, sales: 256.30, status: 'confirmed' },
                    { key: '4', month: 'January 2026', orders: 5, commission: 31.20, sales: 208.00, status: 'confirmed' },
                  ]
                  const totalOrders = monthlyBills.reduce((s, b) => s + b.orders, 0)
                  const totalCommission = monthlyBills.reduce((s, b) => s + b.commission, 0)
                  const totalSales = monthlyBills.reduce((s, b) => s + b.sales, 0)
                  
                  const billColumns = [
                    { title: '月份', dataIndex: 'month', render: v => <Text strong style={{ fontSize: 13 }}>{v}</Text> },
                    { title: '订单数', dataIndex: 'orders', render: v => <Text>{v} 单</Text> },
                    { title: '佣金', dataIndex: 'commission', render: v => <Text strong style={{ color: '#16997F' }}>${v.toFixed(2)}</Text> },
                    { title: '销售额', dataIndex: 'sales', render: v => <Text>${v.toFixed(2)}</Text> },
                    { 
                      title: '账期状态', 
                      dataIndex: 'status', 
                      render: s => s === 'confirmed' 
                        ? <Tag color="green">已确认</Tag> 
                        : <Tag color="orange">待确认</Tag> 
                    },
                  ]
                  return (
                    <div>
                      <Row gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={8}>
                          <Card size="small"><Statistic title="总订单数" value={totalOrders} suffix="单" valueStyle={{ fontSize: 22 }} /></Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small"><Statistic title="总佣金" value={totalCommission} prefix="$" precision={2} valueStyle={{ fontSize: 22, color: '#16997F' }} /></Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small"><Statistic title="总销售额" value={totalSales} prefix="$" precision={2} valueStyle={{ fontSize: 22 }} /></Card>
                        </Col>
                      </Row>
                      <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>月度账单明细</Text>
                      <Table
                        columns={billColumns}
                        dataSource={monthlyBills}
                        size="small" pagination={false}
                        locale={{ emptyText: '暂无账单记录' }}
                        summary={() => monthlyBills.length > 0 ? (
                          <Table.Summary.Row>
                            <Table.Summary.Cell><Text strong>合计</Text></Table.Summary.Cell>
                            <Table.Summary.Cell><Text strong>{totalOrders} 单</Text></Table.Summary.Cell>
                            <Table.Summary.Cell><Text strong style={{ color: '#16997F' }}>${totalCommission.toFixed(2)}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell><Text strong>${totalSales.toFixed(2)}</Text></Table.Summary.Cell>
                            <Table.Summary.Cell />
                          </Table.Summary.Row>
                        ) : null}
                      />
                    </div>
                  )
                })(),
              },
            ]}
          />
        )}
      </Drawer>
    </div>
  )
}
