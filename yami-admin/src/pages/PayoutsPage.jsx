import React, { useState } from 'react'
import {
  Table, Button, Tag, Space, Card, Typography, Tabs,
  Badge, Row, Col, Statistic, Drawer, Avatar, Select,
  Tooltip, Modal, message
} from 'antd'
import {
  DownloadOutlined, EyeOutlined, CheckCircleOutlined,
  ClockCircleOutlined, SyncOutlined, FilterOutlined
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { Text } = Typography
const { Option } = Select

// 账期状态配置
// requested → 用户发起提现申请
// exported  → 已导出（线下打款进行中）
// paid      → 已打款（运营手动确认完成）
// rejected  → 申请被拒（异常情况）
const payoutStatusConfig = {
  requested: { color: 'orange',   icon: <ClockCircleOutlined />,  text: '待处理' },
  exported:  { color: 'blue',     icon: <SyncOutlined />,         text: '已导出' },
  paid:      { color: 'green',    icon: <CheckCircleOutlined />,  text: '已打款' },
  rejected:  { color: 'red',      icon: <ClockCircleOutlined />,  text: '已拒绝' },
}

const orderStatusConfig = {
  confirmed: { color: 'green',   text: '已确认' },
  pending:   { color: 'orange',  text: '待确认' },
  cancelled: { color: 'default', text: '已取消' },
}

// Mock 数据：每条记录 = 一个创作者 × 一个月度账期
const initialRecords = [
  {
    key: '1', name: 'Amy Chen', avatar: 'A', email: 'amy@email.com',
    period: 'April 2026', amount: 386.20, taxForm: 'submitted',
    payoutStatus: 'requested', exportedAt: null, exportedBy: null, paidAt: null,
    orders: [
      { id: 'YM-20260402-8812', product: 'Samyang Buldak Ramen x3',    orderAmt: 20.97, commission: 7.17,  status: 'confirmed' },
      { id: 'YM-20260403-9201', product: 'COSRX Snail Mucin Essence',  orderAmt: 24.99, commission: 5.00,  status: 'confirmed' },
      { id: 'YM-20260403-9305', product: 'LANEIGE Lip Mask x2',        orderAmt: 48.00, commission: 9.60,  status: 'confirmed' },
      { id: 'YM-20260409-1023', product: 'Calbee Jagariko x6',         orderAmt: 83.94, commission: 2.80,  status: 'pending'   },
    ],
  },
  {
    key: '2', name: 'Jason Liu', avatar: 'J', email: 'jason@email.com',
    period: 'April 2026', amount: 248.60, taxForm: 'not_submitted',
    payoutStatus: 'requested', exportedAt: null, exportedBy: null, paidAt: null,
    orders: [
      { id: 'YM-20260404-1101', product: 'Nongshim Shin Ramyun x4',    orderAmt: 39.96, commission: 8.00,  status: 'confirmed' },
      { id: 'YM-20260405-1205', product: 'ANESSA Sunscreen',           orderAmt: 29.99, commission: 6.00,  status: 'confirmed' },
    ],
  },
  {
    key: '3', name: 'Mia Wang', avatar: 'M', email: 'mia@email.com',
    period: 'April 2026', amount: 412.80, taxForm: 'submitted',
    payoutStatus: 'exported', exportedAt: '2026-05-03 14:22', exportedBy: 'admin', paidAt: null,
    orders: [
      { id: 'YM-20260403-2201', product: 'COSRX Snail Mucin x2',       orderAmt: 49.98, commission: 10.00, status: 'confirmed' },
      { id: 'YM-20260406-2305', product: 'Innisfree Green Tea Serum',  orderAmt: 26.50, commission: 5.30,  status: 'confirmed' },
    ],
  },
  {
    key: '4', name: 'Kevin Park', avatar: 'K', email: 'kevin@email.com',
    period: 'March 2026', amount: 198.40, taxForm: 'submitted',
    payoutStatus: 'paid', exportedAt: '2026-04-10 09:15', exportedBy: 'admin', paidAt: '2026-04-15',
    orders: [
      { id: 'YM-20260310-8801', product: 'Shin Ramyun x3',             orderAmt: 29.97, commission: 6.00,  status: 'confirmed' },
      { id: 'YM-20260315-8902', product: 'Pocky Matcha x4',            orderAmt: 19.96, commission: 4.00,  status: 'confirmed' },
    ],
  },
  {
    key: '5', name: 'Amy Chen', avatar: 'A', email: 'amy@email.com',
    period: 'March 2026', amount: 412.80, taxForm: 'submitted',
    payoutStatus: 'paid', exportedAt: '2026-04-10 09:15', exportedBy: 'admin', paidAt: '2026-04-15',
    orders: [
      { id: 'YM-20260302-7701', product: 'Buldak Ramen x2',            orderAmt: 13.98, commission: 4.19,  status: 'confirmed' },
      { id: 'YM-20260305-7802', product: 'COSRX Essence',              orderAmt: 24.99, commission: 5.00,  status: 'confirmed' },
    ],
  },
]

// Excel 导出：单条记录
function exportSingleExcel(record) {
  const confirmedOrders = record.orders.filter(o => o.status === 'confirmed')
  const total = confirmedOrders.reduce((s, o) => s + o.commission, 0)
  const rows = [
    ['创作者姓名', record.name],
    ['邮箱', record.email],
    ['账期', record.period],
    ['佣金金额', `$${record.amount.toFixed(2)}`],
    ['税表状态', record.taxForm === 'submitted' ? '已提交' : '未提交'],
    [],
    ['订单号', '商品', '订单金额', '佣金金额', '状态'],
    ...record.orders.map(o => [
      o.id, o.product,
      `$${o.orderAmt.toFixed(2)}`,
      `$${o.commission.toFixed(2)}`,
      o.status === 'confirmed' ? '已确认' : o.status === 'pending' ? '待确认' : '已取消',
    ]),
    [],
    ['已确认佣金合计', `$${total.toFixed(2)}`],
  ]
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{ wch: 20 }, { wch: 36 }, { wch: 14 }, { wch: 14 }, { wch: 10 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '打款明细')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `打款明细_${record.name}_${record.period}.xlsx`)
}

// Excel 导出：批量
function exportBatchExcel(records) {
  const rows = [
    ['创作者姓名', '邮箱', '账期', '佣金金额', '税表状态', '订单号', '商品', '订单金额', '佣金', '订单状态'],
  ]
  records.forEach(r => {
    r.orders.forEach((o, i) => {
      rows.push([
        i === 0 ? r.name : '',
        i === 0 ? r.email : '',
        i === 0 ? r.period : '',
        i === 0 ? `$${r.amount.toFixed(2)}` : '',
        i === 0 ? (r.taxForm === 'submitted' ? '已提交' : '未提交') : '',
        o.id, o.product,
        `$${o.orderAmt.toFixed(2)}`,
        `$${o.commission.toFixed(2)}`,
        o.status === 'confirmed' ? '已确认' : o.status === 'pending' ? '待确认' : '已取消',
      ])
    })
    rows.push(new Array(10).fill(''))
  })
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{ wch: 16 }, { wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 32 }, { wch: 12 }, { wch: 12 }, { wch: 10 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '打款明细')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const date = new Date().toISOString().split('T')[0]
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `打款明细_批量_${date}.xlsx`)
}

// 订单明细抽屉
function OrderDetailDrawer({ open, onClose, record }) {
  if (!record) return null
  const columns = [
    { title: '订单号', dataIndex: 'id', render: id => <Text code style={{ fontSize: 12 }}>{id}</Text> },
    { title: '商品', dataIndex: 'product' },
    { title: '订单金额', dataIndex: 'orderAmt', render: v => `$${v.toFixed(2)}` },
    { title: '佣金', dataIndex: 'commission', render: v => <Text strong style={{ color: '#16997F' }}>${v.toFixed(2)}</Text> },
    { title: '状态', dataIndex: 'status', render: s => <Tag color={orderStatusConfig[s].color}>{orderStatusConfig[s].text}</Tag> },
  ]
  const total = record.orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.commission, 0)

  return (
    <Drawer
      title={
        <Space>
          <Avatar style={{ background: '#16997F' }}>{record.avatar}</Avatar>
          <div>
            <div><Text strong>{record.name}</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.period}</Text>
          </div>
        </Space>
      }
      width={680} open={open} onClose={onClose}
    >
      <Table
        columns={columns}
        dataSource={record.orders.map((o, i) => ({ ...o, key: i }))}
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3}><Text strong>已确认佣金合计</Text></Table.Summary.Cell>
            <Table.Summary.Cell>
              <Text strong style={{ color: '#16997F' }}>${total.toFixed(2)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell />
          </Table.Summary.Row>
        )}
      />
    </Drawer>
  )
}

export default function PayoutsPage() {
  const [records, setRecords] = useState(initialRecords)
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedKeys, setSelectedKeys] = useState([])
  const [detailDrawer, setDetailDrawer] = useState({ open: false, record: null })

  // 获取所有账期选项
  const periods = [...new Set(records.map(r => r.period))]

  // 过滤后的数据
  const filtered = records.filter(r => {
    if (filterPeriod !== 'all' && r.period !== filterPeriod) return false
    if (filterStatus !== 'all' && r.payoutStatus !== filterStatus) return false
    return true
  })

  // 统计卡片数据
  const pendingCount  = records.filter(r => r.payoutStatus === 'requested').length
  const exportedCount = records.filter(r => r.payoutStatus === 'exported').length
  const paidCount     = records.filter(r => r.payoutStatus === 'paid').length
  const pendingAmount = records.filter(r => r.payoutStatus !== 'paid' && r.payoutStatus !== 'rejected').reduce((s, r) => s + r.amount, 0)

  // 导出单条 → 若状态为 requested，升级为 exported，记录时间
  const handleExportSingle = (record) => {
    exportSingleExcel(record)
    if (record.payoutStatus === 'requested') {
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      setRecords(prev => prev.map(r =>
        r.key === record.key
          ? { ...r, payoutStatus: 'exported', exportedAt: now, exportedBy: 'admin' }
          : r
      ))
    }
    message.success('明细已导出')
  }

  // 标记已打款（单条）
  const handleMarkPaid = (record) => {
    Modal.confirm({
      title: `确认标记「${record.name} · ${record.period}」已打款？`,
      content: '此操作表示线下打款已完成，状态将更新为「已打款」。',
      okText: '确认已打款',
      cancelText: '取消',
      onOk: () => {
        const today = new Date().toISOString().split('T')[0]
        setRecords(prev => prev.map(r =>
          r.key === record.key
            ? { ...r, payoutStatus: 'paid', paidAt: today }
            : r
        ))
        message.success('已标记为打款完成')
      },
    })
  }

  // 批量标记已打款
  const handleBatchMarkPaid = () => {
    const targets = records.filter(r => selectedKeys.includes(r.key))
    Modal.confirm({
      title: `批量标记 ${targets.length} 笔已打款？`,
      content: (
        <div>
          <p style={{ marginBottom: 8 }}>以下账期将被标记为「已打款」：</p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {targets.map(r => (
              <li key={r.key} style={{ fontSize: 13 }}>{r.name} · {r.period} · <strong>${r.amount.toFixed(2)}</strong></li>
            ))}
          </ul>
          <p style={{ marginTop: 12, color: '#8c8c8c', fontSize: 12 }}>合计：${targets.reduce((s, r) => s + r.amount, 0).toFixed(2)}</p>
        </div>
      ),
      okText: `确认标记 ${targets.length} 笔已打款`,
      cancelText: '取消',
      okButtonProps: { style: { background: '#16997F', borderColor: '#16997F' } },
      onOk: () => {
        const today = new Date().toISOString().split('T')[0]
        setRecords(prev => prev.map(r =>
          selectedKeys.includes(r.key)
            ? { ...r, payoutStatus: 'paid', paidAt: today }
            : r
        ))
        setSelectedKeys([])
        message.success(`已将 ${targets.length} 笔标记为打款完成`)
      },
    })
  }

  const columns = [
    {
      title: '创作者',
      render: (_, r) => (
        <Space>
          <Avatar style={{ background: '#16997F' }}>{r.avatar}</Avatar>
          <div>
            <Text strong>{r.name}</Text>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text></div>
          </div>
        </Space>
      ),
    },
    {
      title: '账期',
      dataIndex: 'period',
    },
    {
      title: '佣金金额',
      dataIndex: 'amount',
      render: v => <Text strong style={{ color: '#16997F', fontSize: 15 }}>${v.toFixed(2)}</Text>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '税表',
      dataIndex: 'taxForm',
      render: v => v === 'submitted'
        ? <Badge status="success" text="已提交" />
        : <Badge status="error" text="未提交" />,
    },
    {
      title: '处理状态',
      dataIndex: 'payoutStatus',
      render: (status, r) => {
        const cfg = payoutStatusConfig[status]
        const tag = (
          <Tag icon={cfg.icon} color={cfg.color} style={{ marginRight: 0, ...(status === 'paid' ? { color: '#389e0d' } : {}) }}>
            {cfg.text}
          </Tag>
        )
        if (status === 'exported') {
          return (
            <Tooltip title={`首次导出：${r.exportedAt}  操作人：${r.exportedBy}`}>
              {tag}
            </Tooltip>
          )
        }
        if (status === 'paid') {
          return (
            <Tooltip title={`打款完成：${r.paidAt}`}>
              {tag}
            </Tooltip>
          )
        }
        return tag
      },
    },
    {
      title: '导出记录',
      render: (_, r) => r.exportedAt
        ? <Text type="secondary" style={{ fontSize: 12 }}>{r.exportedAt}</Text>
        : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
    },
    {
      title: '操作',
      render: (_, r) => (
        <Space>
          <Button
            icon={<EyeOutlined />} size="small"
            onClick={() => setDetailDrawer({ open: true, record: r })}
          >
            查看明细
          </Button>
          <Tooltip title={r.exportedAt ? `上次导出：${r.exportedAt}` : ''}>
            <Button
              icon={<DownloadOutlined />} size="small"
              onClick={() => handleExportSingle(r)}
            >
              {r.exportedAt ? '再次导出' : '导出明细'}
            </Button>
          </Tooltip>
          {r.payoutStatus === 'exported' && (
            <Button
              icon={<CheckCircleOutlined />} size="small" type="primary"
              style={{ background: '#16997F', borderColor: '#16997F' }}
              onClick={() => handleMarkPaid(r)}
            >
              标记已打款
            </Button>
          )}
          {r.payoutStatus === 'requested' && (
            <Button
              size="small" danger
              onClick={() => {
                Modal.confirm({
                  title: `确认拒绝「${r.name}」的提现申请？`,
                  content: '拒绝后用户可在下月重新申请。',
                  okText: '确认拒绝',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk: () => {
                    setRecords(prev => prev.map(rec =>
                      rec.key === r.key ? { ...rec, payoutStatus: 'rejected' } : rec
                    ))
                  }
                })
              }}
            >
              拒绝
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理账期"
              value={pendingCount}
              suffix="笔"
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已导出（待确认）"
              value={exportedCount}
              suffix="笔"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已打款"
              value={paidCount}
              suffix="笔"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未完成打款总额"
              value={pendingAmount}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#222' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 + 批量导出 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <FilterOutlined style={{ color: '#8c8c8c' }} />
          <Select
            value={filterPeriod}
            onChange={setFilterPeriod}
            style={{ width: 160 }}
            placeholder="选择账期"
          >
            <Option value="all">全部账期</Option>
            {periods.map(p => <Option key={p} value={p}>{p}</Option>)}
          </Select>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 140 }}
            placeholder="处理状态"
          >
            <Option value="all">全部状态</Option>
            <Option value="pending">待处理</Option>
            <Option value="exported">已导出</Option>
            <Option value="paid">已打款</Option>
          </Select>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                if (filtered.length === 0) return message.warning('没有可导出的记录')
                exportBatchExcel(filtered)
                // 批量导出：将所有 pending 状态升级为 exported
                const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
                setRecords(prev => prev.map(r => {
                  const inFiltered = filtered.find(f => f.key === r.key)
                  if (inFiltered && r.payoutStatus === 'requested') {
                    return { ...r, payoutStatus: 'exported', exportedAt: now, exportedBy: 'admin' }
                  }
                  return r
                }))
                message.success(`已导出 ${filtered.length} 条明细`)
              }}
            >
              批量导出当前筛选
            </Button>
          </div>
        </div>
      </Card>

      {/* 主表格 */}
      <Card>
        {selectedKeys.length > 0 && (
          <div style={{
            marginBottom: 12, padding: '10px 16px',
            background: '#e6f4ff', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <Text>已选 <strong>{selectedKeys.length}</strong> 笔（均为「已导出」状态），合计 <strong style={{ color: '#16997F' }}>${records.filter(r => selectedKeys.includes(r.key)).reduce((s, r) => s + r.amount, 0).toFixed(2)}</strong></Text>
            <Button
              type="primary" icon={<CheckCircleOutlined />}
              style={{ background: '#16997F', borderColor: '#16997F' }}
              onClick={handleBatchMarkPaid}
            >
              批量标记已打款
            </Button>
            <Button size="small" type="link" onClick={() => setSelectedKeys([])}>取消选择</Button>
          </div>
        )}
        <Table
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
            // 只有 exported 状态才可勾选
            getCheckboxProps: r => ({
              disabled: r.payoutStatus !== 'exported',
              title: r.payoutStatus !== 'exported' ? '仅「已导出」状态可批量标记' : '',
            }),
          }}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 20 }}
          rowClassName={r => r.payoutStatus === 'paid' ? 'row-paid' : ''}
        />
      </Card>

      <OrderDetailDrawer
        open={detailDrawer.open}
        onClose={() => setDetailDrawer({ open: false, record: null })}
        record={detailDrawer.record}
      />

      <style>{`
        .row-paid td { opacity: 0.55; }
      `}</style>
    </div>
  )
}
