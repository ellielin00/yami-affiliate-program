import React, { useState } from 'react'
import {
  Table, Button, Tag, Space, Card, Typography,
  Row, Col, Statistic, Drawer, Avatar, Select,
  Badge, message
} from 'antd'
import {
  DownloadOutlined, EyeOutlined, CheckCircleOutlined,
  ClockCircleOutlined, FilterOutlined, DollarOutlined
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { Text } = Typography
const { Option } = Select

// 账期状态配置
const billStatusConfig = {
  confirmed: { color: 'green',    icon: <CheckCircleOutlined />,  text: '已确认' },
  pending:   { color: 'orange',   icon: <ClockCircleOutlined />,  text: '待确认' },
}

const orderStatusConfig = {
  confirmed: { color: 'green',   text: '已确认' },
  pending:   { color: 'orange',  text: '待确认' },
  cancelled: { color: 'default', text: '已取消' },
}

// Mock 数据：每条记录 = 一个创作者 × 一个月度账期
// 新增字段：sales（销售额）、cancelled（取消金额）、refunded（售后金额）、exported（是否已导出）
const initialRecords = [
  {
    key: '1', name: 'Amy Chen', avatar: 'A', email: 'amy@email.com',
    period: 'April 2026', amount: 49.59, sales: 61.47, cancelled: 5.88, refunded: 6.00,
    taxForm: 'submitted', billStatus: 'pending', exported: false,
    orders: [
      { id: 'YM-20260402-8812', product: 'Samyang Buldak Ramen x3',    orderAmt: 20.97, commission: 7.17,  status: 'confirmed' },
      { id: 'YM-20260403-9201', product: 'COSRX Snail Mucin Essence',  orderAmt: 24.99, commission: 5.00,  status: 'confirmed' },
      { id: 'YM-20260403-9305', product: 'LANEIGE Lip Mask x2',        orderAmt: 48.00, commission: 9.60,  status: 'confirmed' },
      { id: 'YM-20260409-1023', product: 'Calbee Jagariko x6',         orderAmt: 83.94, commission: 2.80,  status: 'pending'   },
    ],
  },
  {
    key: '2', name: 'Jason Liu', avatar: 'J', email: 'jason@email.com',
    period: 'April 2026', amount: 38.50, sales: 42.00, cancelled: 2.50, refunded: 1.00,
    taxForm: 'not_submitted', billStatus: 'pending', exported: false,
    orders: [
      { id: 'YM-20260404-1101', product: 'Nongshim Shin Ramyun x4',    orderAmt: 39.96, commission: 8.00,  status: 'confirmed' },
      { id: 'YM-20260405-1205', product: 'ANESSA Sunscreen',           orderAmt: 29.99, commission: 6.00,  status: 'confirmed' },
    ],
  },
  {
    key: '3', name: 'Mia Wang', avatar: 'M', email: 'mia@email.com',
    period: 'April 2026', amount: 52.30, sales: 58.00, cancelled: 3.20, refunded: 2.50,
    taxForm: 'submitted', billStatus: 'pending', exported: false,
    orders: [
      { id: 'YM-20260403-2201', product: 'COSRX Snail Mucin x2',       orderAmt: 49.98, commission: 10.00, status: 'confirmed' },
      { id: 'YM-20260406-2305', product: 'Innisfree Green Tea Serum',  orderAmt: 26.50, commission: 5.30,  status: 'confirmed' },
    ],
  },
  {
    key: '4', name: 'Kevin Park', avatar: 'K', email: 'kevin@email.com',
    period: 'March 2026', amount: 45.20, sales: 48.00, cancelled: 1.80, refunded: 1.00,
    taxForm: 'submitted', billStatus: 'confirmed', exported: true,
    orders: [
      { id: 'YM-20260310-8801', product: 'Shin Ramyun x3',             orderAmt: 29.97, commission: 6.00,  status: 'confirmed' },
      { id: 'YM-20260315-8902', product: 'Pocky Matcha x4',            orderAmt: 19.96, commission: 4.00,  status: 'confirmed' },
    ],
  },
  {
    key: '5', name: 'Amy Chen', avatar: 'A', email: 'amy@email.com',
    period: 'March 2026', amount: 62.80, sales: 68.50, cancelled: 3.20, refunded: 2.50,
    taxForm: 'submitted', billStatus: 'confirmed', exported: true,
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
  const [detailDrawer, setDetailDrawer] = useState({ open: false, record: null })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // 获取所有账期选项
  const periods = [...new Set(records.map(r => r.period))]

  // 过滤后的数据
  const filtered = records.filter(r => {
    if (filterPeriod !== 'all' && r.period !== filterPeriod) return false
    if (filterStatus !== 'all' && r.billStatus !== filterStatus) return false
    return true
  })

  // 统计卡片数据
  const totalCommission = filtered.reduce((s, r) => s + r.amount, 0)
  const totalSales = filtered.reduce((s, r) => s + r.sales, 0)
  const totalCancelled = filtered.reduce((s, r) => s + r.cancelled, 0)
  const totalRefunded = filtered.reduce((s, r) => s + r.refunded, 0)

  // 导出单条（并标记为已导出）
  const handleExportSingle = (record) => {
    exportSingleExcel(record)
    setRecords(prev => prev.map(r => 
      r.key === record.key ? { ...r, exported: true } : r
    ))
    message.success('明细已导出')
  }

  // 单条标记为已打款
  const handleMarkSingleAsPaid = (record) => {
    if (record.taxForm !== 'submitted') {
      message.error('税表未提交，无法标记为已打款')
      return
    }
    setRecords(prev => prev.map(r => 
      r.key === record.key ? { ...r, billStatus: 'confirmed' } : r
    ))
    message.success(`已将 ${record.name} 的账单标记为已打款`)
  }

  // 批量标记为已打款
  const handleMarkAsPaid = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要标记的账单')
      return
    }
    // 检查是否有未提交税表的
    const selectedRecords = records.filter(r => selectedRowKeys.includes(r.key))
    const unpaidTax = selectedRecords.filter(r => r.taxForm !== 'submitted')
    if (unpaidTax.length > 0) {
      message.error(`${unpaidTax.map(r => r.name).join('、')} 税表未提交，无法标记为已打款`)
      return
    }
    // 更新状态
    setRecords(prev => prev.map(r => 
      selectedRowKeys.includes(r.key) ? { ...r, billStatus: 'confirmed' } : r
    ))
    message.success(`已将 ${selectedRowKeys.length} 条账单标记为已打款`)
    setSelectedRowKeys([])
  }

  // 批量导出选中（并标记为已导出）
  const handleExportSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的账单')
      return
    }
    const selectedRecords = records.filter(r => selectedRowKeys.includes(r.key))
    exportBatchExcel(selectedRecords)
    // 标记为已导出
    setRecords(prev => prev.map(r => 
      selectedRowKeys.includes(r.key) ? { ...r, exported: true } : r
    ))
    message.success(`已导出 ${selectedRecords.length} 条明细`)
  }

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
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
      title: '账期状态',
      dataIndex: 'billStatus',
      render: (status) => {
        const cfg = billStatusConfig[status]
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {cfg.text}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      width: 280,
      render: (_, r) => (
        <Space size={4} wrap>
          <Button
            icon={<EyeOutlined />} size="small"
            onClick={() => setDetailDrawer({ open: true, record: r })}
          >
            查看明细
          </Button>
          <Button
            icon={<DownloadOutlined />} size="small"
            onClick={() => handleExportSingle(r)}
          >
            {r.exported ? '再次导出' : '导出明细'}
          </Button>
          {r.billStatus !== 'confirmed' && (
            <Button
              icon={<DollarOutlined />} size="small"
              type="primary"
              style={{ background: '#16997F', borderColor: '#16997F' }}
              onClick={() => handleMarkSingleAsPaid(r)}
              disabled={r.taxForm !== 'submitted'}
              title={r.taxForm !== 'submitted' ? '税表未提交，无法标记' : ''}
            >
              标记已打款
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
              title="佣金总额"
              value={totalCommission}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#16997F' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售额"
              value={totalSales}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#222' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="取消金额"
              value={totalCancelled}
              prefix="-$"
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="售后金额"
              value={totalRefunded}
              prefix="-$"
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
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
            placeholder="账期状态"
          >
            <Option value="all">全部状态</Option>
            <Option value="confirmed">已确认</Option>
            <Option value="pending">待确认</Option>
          </Select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {selectedRowKeys.length > 0 && (
              <>
                <Button
                  icon={<DollarOutlined />}
                  type="primary"
                  style={{ background: '#16997F', borderColor: '#16997F' }}
                  onClick={handleMarkAsPaid}
                >
                  标记为已打款 ({selectedRowKeys.length})
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportSelected}
                >
                  导出选中 ({selectedRowKeys.length})
                </Button>
              </>
            )}
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                if (filtered.length === 0) return message.warning('没有可导出的记录')
                exportBatchExcel(filtered)
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
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 20 }}
          rowClassName={r => r.billStatus === 'confirmed' ? 'row-confirmed' : ''}
        />
      </Card>

      <OrderDetailDrawer
        open={detailDrawer.open}
        onClose={() => setDetailDrawer({ open: false, record: null })}
        record={detailDrawer.record}
      />

      <style>{`
        .row-confirmed td { opacity: 0.7; }
      `}</style>
    </div>
  )
}
