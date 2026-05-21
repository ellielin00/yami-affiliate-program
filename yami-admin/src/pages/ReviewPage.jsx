import React, { useState } from 'react'
import {
  Table, Button, Tag, Space, Input, Select, Modal, Form,
  Radio, Typography, Avatar, Tooltip, Badge, Popconfirm, message, Row, Col, Card, Statistic, Alert
} from 'antd'
import {
  SearchOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons'
import { useCreators } from '../context/CreatorsContext'

const { Text } = Typography
const { TextArea } = Input

const REJECT_REASONS = [
  '粉丝量不足（低于 500）',
  '内容与亚米品类不相关',
  '账号真实性存疑',
  '地区限制（暂不支持该地区）',
  '账号近期无活跃内容',
  '自定义原因',
]

// 审核页独立维护申请列表（仅 Influencer）
const mockApplications = [
  {
    key: 'app1', name: 'Amy Chen', email: 'amy@email.com', avatar: 'A',
    type: 'influencer',
    appliedAt: '2026-04-10', status: 'pending',
    platforms: [{ name: 'Instagram', followers: '2.4K' }, { name: 'TikTok', followers: '5.1K' }],
    categories: ['K-Beauty', 'Snacks'],
  },
  {
    key: 'app2', name: 'Jason Liu', email: 'jason@email.com', avatar: 'J',
    type: 'influencer',
    appliedAt: '2026-04-09', status: 'pending',
    platforms: [{ name: 'YouTube', followers: '12K' }, { name: 'Instagram', followers: '3.2K' }],
    categories: ['Cooking', 'Tea'],
  },
  {
    key: 'app3', name: 'Mia Wang', email: 'mia@email.com', avatar: 'M',
    type: 'influencer',
    appliedAt: '2026-04-08', status: 'pending',
    platforms: [{ name: '小红书', followers: '8.9K' }],
    categories: ['K-Beauty', 'Home'],
  },
  {
    key: 'app4', name: 'Kevin Zhang', email: 'kevin@email.com', avatar: 'K',
    type: 'influencer',
    appliedAt: '2026-04-07', status: 'approved',
    platforms: [{ name: 'TikTok', followers: '22K' }],
    categories: ['Snacks', 'Sweets'],
  },
  {
    key: 'app5', name: 'Sarah Park', email: 'sarah@email.com', avatar: 'S',
    type: 'influencer',
    appliedAt: '2026-04-06', status: 'rejected',
    rejectReason: '粉丝量不足（低于 500）',
    platforms: [{ name: 'Instagram', followers: '320' }],
    categories: ['K-Beauty'],
  },
]

const statusConfig = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已拒绝' },
}

export default function ReviewPage() {
  const [data, setData] = useState(mockApplications)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [rejectModal, setRejectModal] = useState({ open: false, keys: [] })
  const [rejectReason, setRejectReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [form] = Form.useForm()

  const filtered = data.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchSearch = !searchText ||
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.email.toLowerCase().includes(searchText.toLowerCase())
    return matchStatus && matchSearch
  })

  const stats = {
    pending: data.filter(r => r.status === 'pending').length,
    approved: data.filter(r => r.status === 'approved').length,
    rejected: data.filter(r => r.status === 'rejected').length,
  }

  const handleApprove = (keys) => {
    setData(prev => prev.map(r => keys.includes(r.key) ? { ...r, status: 'approved' } : r))
    setSelectedKeys([])
    message.success(`已通过 ${keys.length} 个申请`)
  }

  const handleReject = () => {
    const reason = rejectReason === '自定义原因' ? customReason : rejectReason
    if (!reason) { message.error('请选择或填写拒绝原因'); return }
    setData(prev => prev.map(r =>
      rejectModal.keys.includes(r.key) ? { ...r, status: 'rejected', rejectReason: reason } : r
    ))
    setSelectedKeys([])
    setRejectModal({ open: false, keys: [] })
    setRejectReason('')
    setCustomReason('')
    message.success(`已拒绝 ${rejectModal.keys.length} 个申请`)
  }

  const columns = [
    {
      title: '创作者',
      dataIndex: 'name',
      render: (name, record) => (
        <Space>
          <Avatar style={{ background: '#16997F' }}>{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '社媒平台',
      dataIndex: 'platforms',
      render: (platforms) => (
        <Space direction="vertical" size={2}>
          {platforms.map((p, i) => (
            <Space key={i} size={4}>
              <Tag style={{ margin: 0 }}>{p.name}</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>{p.followers}</Text>
            </Space>
          ))}
        </Space>
      ),
    },
    {
      title: '带货品类',
      dataIndex: 'categories',
      render: (cats) => (
        <Space size={8} wrap>
          {cats.map(c => <Tag key={c} color="blue" style={{ margin: 0 }}>{c}</Tag>)}
        </Space>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'appliedAt',
      sorter: (a, b) => a.appliedAt.localeCompare(b.appliedAt),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>
          {status === 'rejected' && record.rejectReason && (
            <Tooltip title={record.rejectReason}>
              <Text type="secondary" style={{ fontSize: 11, cursor: 'pointer' }}>查看原因</Text>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      render: (_, record) => record.status === 'pending' ? (
        <Space>
          <Popconfirm title="确认通过该申请？" onConfirm={() => handleApprove([record.key])}>
            <Button type="primary" size="small" icon={<CheckOutlined />}>通过</Button>
          </Popconfirm>
          <Button
            danger size="small" icon={<CloseOutlined />}
            onClick={() => setRejectModal({ open: true, keys: [record.key] })}
          >拒绝</Button>
        </Space>
      ) : <Text type="secondary">—</Text>,
    },
  ]

  return (
    <div>
      <Alert
        message="创作者审核仅适用于 Influencer。Affiliate 无需审核，注册后直接进入创作者管理。"
        type="info" showIcon style={{ marginBottom: 16 }}
      />
      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="待审核" value={stats.pending} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已通过" value={stats.approved} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已拒绝" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} /></Card>
        </Col>
      </Row>

      {/* Toolbar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col flex="auto">
            <Space>
              <Input
                placeholder="搜索用户名或邮箱"
                prefix={<SearchOutlined />}
                style={{ width: 240 }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部状态' },
                  { value: 'pending', label: '待审核' },
                  { value: 'approved', label: '已通过' },
                  { value: 'rejected', label: '已拒绝' },
                ]}
              />
            </Space>
          </Col>
          {selectedKeys.length > 0 && (
            <Col>
              <Space>
                <Text type="secondary">已选 {selectedKeys.length} 项</Text>
                <Popconfirm
                  title={`确认批量通过 ${selectedKeys.length} 个申请？`}
                  onConfirm={() => handleApprove(selectedKeys)}
                >
                  <Button type="primary" icon={<CheckOutlined />}>批量通过</Button>
                </Popconfirm>
                <Button
                  danger icon={<CloseOutlined />}
                  onClick={() => setRejectModal({ open: true, keys: selectedKeys })}
                >批量拒绝</Button>
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
            getCheckboxProps: record => ({ disabled: record.status !== 'pending' }),
          }}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10, showTotal: total => `共 ${total} 条` }}
        />
      </Card>

      {/* Reject Modal */}
      <Modal
        title={`拒绝申请（${rejectModal.keys.length} 个）`}
        open={rejectModal.open}
        onOk={handleReject}
        onCancel={() => { setRejectModal({ open: false, keys: [] }); setRejectReason(''); setCustomReason('') }}
        okText="确认拒绝"
        okButtonProps={{ danger: true }}
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">请选择拒绝原因，系统将自动通知创作者：</Text>
        </div>
        <Radio.Group
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {REJECT_REASONS.map(r => (
            <Radio key={r} value={r}>{r}</Radio>
          ))}
        </Radio.Group>
        {rejectReason === '自定义原因' && (
          <TextArea
            style={{ marginTop: 12 }}
            rows={3}
            placeholder="请填写自定义拒绝原因..."
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
          />
        )}
      </Modal>
    </div>
  )
}
