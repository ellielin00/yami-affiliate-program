import React, { useState } from 'react'
import {
  Card, Table, Button, Tag, Space, Typography, Tabs,
  Modal, Form, Input, InputNumber, DatePicker, Select,
  Popconfirm, message, Row, Col, Statistic, Divider
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  CheckCircleFilled, ClockCircleFilled, StopOutlined,
  FireFilled
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography
const { RangePicker } = DatePicker
const { TextArea } = Input

// ─── 一级品类默认佣金 ─────────────────────────────────────────────────────────

const L1_CATEGORIES = [
  { key: 'snacks',  label: 'Snacks & Noodles',    defaultRate: 5 },
  { key: 'beauty',  label: 'K-Beauty & Skincare',  defaultRate: 8 },
  { key: 'tea',     label: 'Tea & Beverages',       defaultRate: 5 },
  { key: 'sweets',  label: 'Sweets & Desserts',     defaultRate: 5 },
  { key: 'cooking', label: 'Cooking & Pantry',      defaultRate: 6 },
  { key: 'home',    label: 'Home & Living',          defaultRate: 6 },
]

// ─── 三级品类 ─────────────────────────────────────────────────────────────────

const L3_CATEGORIES = [
  { value: 'snacks_ramen',   label: 'Snacks & Noodles › Instant Ramen' },
  { value: 'snacks_chips',   label: 'Snacks & Noodles › Chips & Crackers' },
  { value: 'beauty_skincare',label: 'K-Beauty & Skincare › Skincare' },
  { value: 'beauty_makeup',  label: 'K-Beauty & Skincare › Makeup' },
  { value: 'tea_green',      label: 'Tea & Beverages › Green Tea' },
  { value: 'tea_milk',       label: 'Tea & Beverages › Milk Tea' },
  { value: 'sweets_candy',   label: 'Sweets & Desserts › Candy' },
  { value: 'sweets_biscuit', label: 'Sweets & Desserts › Biscuits' },
  { value: 'cooking_sauce',  label: 'Cooking & Pantry › Sauces' },
  { value: 'home_kitchen',   label: 'Home & Living › Kitchen' },
]

// ─── Mock 初始数据 ────────────────────────────────────────────────────────────

const initialL1Rates = L1_CATEGORIES.map(c => ({ ...c, editingRate: null }))

const initialCategoryBoosts = [
  {
    key: 'cb1',
    categories: ['snacks_ramen'],
    categoryLabels: ['Snacks & Noodles › Instant Ramen'],
    boostRate: 12,
    startDate: '2026-05-01', endDate: '2026-05-31',
    remark: '店庆活动',
    createdBy: 'admin', createdAt: '2026-04-28',
  },
  {
    key: 'cb2',
    categories: ['beauty_skincare', 'beauty_makeup'],
    categoryLabels: ['K-Beauty & Skincare › Skincare', 'K-Beauty & Skincare › Makeup'],
    boostRate: 14,
    startDate: '2026-05-15', endDate: '2026-06-15',
    remark: '美妆季活动',
    createdBy: 'admin', createdAt: '2026-04-28',
  },
]

const initialSkuBoosts = [
  {
    key: 'sb1',
    skus: ['YM-SKU-88821'],
    productNames: ['COSRX Advanced Snail 96 Mucin Power Essence 100ml'],
    boostRate: 15,
    startDate: '2026-05-10', endDate: '2026-05-20',
    remark: '爆款单品活动',
    createdBy: 'admin', createdAt: '2026-04-28',
  },
  {
    key: 'sb2',
    skus: ['YM-SKU-44312', 'YM-SKU-55123'],
    productNames: ['Samyang Buldak Hot Chicken Ramen 5-Pack', 'Nongshim Shin Ramyun 4-Pack'],
    boostRate: 13,
    startDate: '2026-05-01', endDate: '2026-05-31',
    remark: '泡面专场',
    createdBy: 'admin', createdAt: '2026-04-28',
  },
]

// ─── 状态计算 ─────────────────────────────────────────────────────────────────

function getBoostStatus(startDate, endDate) {
  const today = dayjs()
  if (today.isBefore(dayjs(startDate))) return 'upcoming'
  if (today.isAfter(dayjs(endDate))) return 'expired'
  return 'active'
}

const statusConfig = {
  active:   { color: 'success', icon: <CheckCircleFilled />, text: '生效中' },
  upcoming: { color: 'warning', icon: <ClockCircleFilled />, text: '待生效' },
  expired:  { color: 'default', icon: <StopOutlined />,      text: '已过期' },
}

function StatusCell({ startDate, endDate }) {
  const s = getBoostStatus(startDate, endDate)
  const cfg = statusConfig[s]
  return <Tag icon={cfg.icon} color={cfg.color}>{cfg.text}</Tag>
}

// ─── 一级品类佣金管理 ─────────────────────────────────────────────────────────

function L1CommissionTab() {
  const [rates, setRates] = useState(initialL1Rates)
  const [editing, setEditing] = useState(null) // { key, value }

  const saveRate = (catKey, catLabel, newRate) => {
    const old = rates.find(r => r.key === catKey)?.defaultRate
    if (newRate === old) { setEditing(null); return }
    setRates(prev => prev.map(r => r.key === catKey ? { ...r, defaultRate: newRate } : r))
    setEditing(null)
    message.success(`${catLabel} 默认佣金已更新为 ${newRate}%`)
  }

  const columns = [
    {
      title: '一级品类',
      dataIndex: 'label',
      render: v => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: '默认佣金比例',
      render: (_, r) => (
        <Text style={{ fontSize: 14 }}>{r.defaultRate}%</Text>
      ),
      width: 140,
    },
    {
      title: '操作',
      width: 220,
      render: (_, r) => {
        const isEditing = editing?.key === r.key
        if (isEditing) {
          return (
            <Space size={4}>
              <InputNumber
                size="small" min={0} max={100}
                value={editing.value}
                onChange={val => setEditing(prev => ({ ...prev, value: val }))}
                formatter={v => `${v}%`} parser={v => v.replace('%', '')}
                style={{ width: 80 }} autoFocus
              />
              <Button
                size="small" type="primary"
                style={{ background: '#16997F', borderColor: '#16997F' }}
                onClick={() => saveRate(r.key, r.label, editing.value)}
              >确认</Button>
              <Button size="small" onClick={() => setEditing(null)}>取消</Button>
            </Space>
          )
        }
        return (
          <Button
            size="small" icon={<EditOutlined />}
            onClick={() => setEditing({ key: r.key, value: r.defaultRate })}
          >编辑</Button>
        )
      },
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6 }}>
        <Text style={{ fontSize: 13 }}>
          一级品类默认佣金比例是所有创作者的基准佣金。修改后对所有未单独配置的创作者立即生效。
        </Text>
      </div>
      <Table
        columns={columns}
        dataSource={rates}
        rowKey="key"
        pagination={false}
      />
    </Card>
  )
}

// ─── 三级品类佣金配置弹窗 ─────────────────────────────────────────────────────

function CategoryBoostModal({ open, onClose, onSave, initial }) {
  const [form] = Form.useForm()
  const isEdit = !!initial

  React.useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue({
          categories: initial.categories,
          boostRate: initial.boostRate,
          dateRange: [dayjs(initial.startDate), dayjs(initial.endDate)],
          remark: initial.remark || '',
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initial])

  const handleOk = () => {
    form.validateFields().then(values => {
      const cats = values.categories || []
      const labels = cats.map(v => L3_CATEGORIES.find(c => c.value === v)?.label || v)
      onSave({
        categories: cats,
        categoryLabels: labels,
        boostRate: values.boostRate,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        remark: values.remark || '',
        createdBy: 'admin',
        createdAt: dayjs().format('YYYY-MM-DD'),
      })
      onClose()
    })
  }

  return (
    <Modal
      title={isEdit ? '编辑三级品类佣金配置' : '新增三级品类佣金配置'}
      open={open} onCancel={onClose} onOk={handleOk}
      okText={isEdit ? '保存' : '添加'} cancelText="取消"
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="categories"
          label="三级品类（可多选）"
          rules={[{ required: true, message: '请至少选择一个品类' }]}
        >
          <Select
            mode="multiple"
            placeholder="选择一个或多个三级品类"
            options={L3_CATEGORIES}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            tagRender={({ label, closable, onClose: onTagClose }) => (
              <Tag
                closable={closable}
                onClose={onTagClose}
                style={{ marginRight: 4, marginBottom: 2 }}
              >
                {label}
              </Tag>
            )}
          />
        </Form.Item>
        <Form.Item
          name="boostRate"
          label="活动佣金比例"
          rules={[{ required: true, message: '请输入活动佣金比例' }]}
        >
          <InputNumber
            min={0} max={100} style={{ width: '100%' }}
            formatter={v => `${v}%`} parser={v => v.replace('%', '')}
          />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="生效时间"
          rules={[{ required: true, message: '请选择生效时间' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="remark" label="备注（如：返校季佣金活动）">
          <TextArea rows={2} placeholder="填写活动名称或备注说明" maxLength={100} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── 单品佣金配置弹窗 ─────────────────────────────────────────────────────────

function SkuBoostModal({ open, onClose, onSave, initial }) {
  const [form] = Form.useForm()
  const isEdit = !!initial

  React.useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue({
          skusInput: initial.skus.join(', '),
          boostRate: initial.boostRate,
          dateRange: [dayjs(initial.startDate), dayjs(initial.endDate)],
          remark: initial.remark || '',
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initial])

  const handleOk = () => {
    form.validateFields().then(values => {
      // 解析逗号分隔的 SKU
      const skus = values.skusInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      if (skus.length === 0) {
        message.error('请输入至少一个 Item Number')
        return
      }
      onSave({
        skus,
        productNames: skus.map(s => `商品 ${s}`), // 实际应从后端查询
        boostRate: values.boostRate,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        remark: values.remark || '',
        createdBy: 'admin',
        createdAt: dayjs().format('YYYY-MM-DD'),
      })
      onClose()
    })
  }

  return (
    <Modal
      title={isEdit ? '编辑单品佣金配置' : '新增单品佣金配置'}
      open={open} onCancel={onClose} onOk={handleOk}
      okText={isEdit ? '保存' : '添加'} cancelText="取消"
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="skusInput"
          label="Item Number（多个用逗号隔开）"
          rules={[{ required: true, message: '请输入 Item Number' }]}
          extra="例：YM-SKU-88821, YM-SKU-44312, YM-SKU-55123"
        >
          <TextArea
            rows={3}
            placeholder="YM-SKU-88821, YM-SKU-44312"
          />
        </Form.Item>
        <Form.Item
          name="boostRate"
          label="活动佣金比例"
          rules={[{ required: true, message: '请输入活动佣金比例' }]}
        >
          <InputNumber
            min={0} max={100} style={{ width: '100%' }}
            formatter={v => `${v}%`} parser={v => v.replace('%', '')}
          />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="生效时间"
          rules={[{ required: true, message: '请选择生效时间' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="remark" label="备注（如：返校季佣金活动）">
          <TextArea rows={2} placeholder="填写活动名称或备注说明" maxLength={100} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function CommissionPage() {
  const [categoryBoosts, setCategoryBoosts] = useState(initialCategoryBoosts)
  const [skuBoosts, setSkuBoosts] = useState(initialSkuBoosts)
  const [catModal, setCatModal] = useState({ open: false, initial: null })
  const [skuModal, setSkuModal] = useState({ open: false, initial: null })

  const activeCount = [
    ...categoryBoosts.filter(r => getBoostStatus(r.startDate, r.endDate) === 'active'),
    ...skuBoosts.filter(r => getBoostStatus(r.startDate, r.endDate) === 'active'),
  ].length
  const upcomingCount = [
    ...categoryBoosts.filter(r => getBoostStatus(r.startDate, r.endDate) === 'upcoming'),
    ...skuBoosts.filter(r => getBoostStatus(r.startDate, r.endDate) === 'upcoming'),
  ].length

  const saveCategoryBoost = (data) => {
    if (catModal.initial) {
      setCategoryBoosts(prev => prev.map(r => r.key === catModal.initial.key ? { ...r, ...data } : r))
      message.success('品类佣金配置已更新')
    } else {
      setCategoryBoosts(prev => [...prev, { ...data, key: `cb${Date.now()}` }])
      message.success('品类佣金配置已添加')
    }
  }

  const saveSkuBoost = (data) => {
    if (skuModal.initial) {
      setSkuBoosts(prev => prev.map(r => r.key === skuModal.initial.key ? { ...r, ...data } : r))
      message.success('单品佣金配置已更新')
    } else {
      setSkuBoosts(prev => [...prev, { ...data, key: `sb${Date.now()}` }])
      message.success('单品佣金配置已添加')
    }
  }

  // 三级品类表格列
  const categoryColumns = [
    {
      title: '三级品类',
      render: (_, r) => (
        <Space size={[4, 4]} wrap>
          {r.categoryLabels.map((lbl, i) => (
            <Tag key={i} style={{ fontSize: 12 }}>{lbl}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '活动佣金',
      render: (_, r) => (
        <Text strong style={{ color: '#16997F', fontSize: 15 }}>{r.boostRate}%</Text>
      ),
      width: 100,
    },
    {
      title: '生效时间',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.startDate} ~ {r.endDate}</Text>,
      width: 200,
    },
    {
      title: '状态',
      render: (_, r) => <StatusCell startDate={r.startDate} endDate={r.endDate} />,
      width: 90,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v || '—'}</Text>,
      width: 140,
    },
    {
      title: '操作人',
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12 }}>{r.createdBy} · {r.createdAt}</Text>,
      width: 140,
    },
    {
      title: '操作',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setCatModal({ open: true, initial: r })}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => setCategoryBoosts(prev => prev.filter(x => x.key !== r.key))} okText="删除" cancelText="取消">
            <Button size="small" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 单品表格列
  const skuColumns = [
    {
      title: 'Item Number',
      render: (_, r) => (
        <Space size={[4, 4]} wrap>
          {r.skus.map((sku, i) => (
            <Tag key={i} style={{ fontSize: 12, fontFamily: 'monospace' }}>{sku}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '活动佣金',
      render: (_, r) => (
        <Text strong style={{ color: '#16997F', fontSize: 15 }}>{r.boostRate}%</Text>
      ),
      width: 100,
    },
    {
      title: '生效时间',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.startDate} ~ {r.endDate}</Text>,
      width: 200,
    },
    {
      title: '状态',
      render: (_, r) => <StatusCell startDate={r.startDate} endDate={r.endDate} />,
      width: 90,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v || '—'}</Text>,
      width: 140,
    },
    {
      title: '操作人',
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12 }}>{r.createdBy} · {r.createdAt}</Text>,
      width: 140,
    },
    {
      title: '操作',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setSkuModal({ open: true, initial: r })}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => setSkuBoosts(prev => prev.filter(x => x.key !== r.key))} okText="删除" cancelText="取消">
            <Button size="small" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
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
            <Statistic title="生效中配置" value={activeCount} suffix="条"
              valueStyle={{ color: '#16997F' }} prefix={<CheckCircleFilled style={{ color: '#16997F' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待生效配置" value={upcomingCount} suffix="条"
              valueStyle={{ color: '#fa8c16' }} prefix={<ClockCircleFilled style={{ color: '#fa8c16' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="三级品类佣金配置" value={categoryBoosts.length} suffix="条" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="单品佣金配置" value={skuBoosts.length} suffix="条" />
          </Card>
        </Col>
      </Row>

      {/* 规则说明 */}
      <Card style={{ marginBottom: 24, background: '#f6ffed', border: '1px solid #b7eb8f' }} size="small">
        <Space>
          <FireFilled style={{ color: '#52c41a' }} />
          <Text style={{ fontSize: 13 }}>
            <Text strong>佣金优先级规则：</Text>
            同一商品同时命中单品配置和品类配置时，取较高值生效。生效期结束后自动恢复一级品类默认佣金比例。
            创作者手动调整的佣金比例在活动期间同样以较高值为准。
          </Text>
        </Space>
      </Card>

      {/* Tabs */}
      <Tabs
        items={[
          {
            key: 'l1',
            label: '一级品类默认佣金',
            children: <L1CommissionTab />,
          },
          {
            key: 'category',
            label: `三级品类佣金配置（${categoryBoosts.length}）`,
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="primary" icon={<PlusOutlined />}
                    style={{ background: '#16997F', borderColor: '#16997F' }}
                    onClick={() => setCatModal({ open: true, initial: null })}
                  >新增品类佣金配置</Button>
                </div>
                <Table
                  columns={categoryColumns}
                  dataSource={categoryBoosts}
                  rowKey="key"
                  pagination={false}
                  rowClassName={r => getBoostStatus(r.startDate, r.endDate) === 'expired' ? 'row-expired' : ''}
                />
              </Card>
            ),
          },
          {
            key: 'sku',
            label: `单品佣金配置（${skuBoosts.length}）`,
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="primary" icon={<PlusOutlined />}
                    style={{ background: '#16997F', borderColor: '#16997F' }}
                    onClick={() => setSkuModal({ open: true, initial: null })}
                  >新增单品佣金配置</Button>
                </div>
                <Table
                  columns={skuColumns}
                  dataSource={skuBoosts}
                  rowKey="key"
                  pagination={false}
                  rowClassName={r => getBoostStatus(r.startDate, r.endDate) === 'expired' ? 'row-expired' : ''}
                />
              </Card>
            ),
          },
        ]}
      />

      <CategoryBoostModal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, initial: null })}
        onSave={saveCategoryBoost}
        initial={catModal.initial}
      />
      <SkuBoostModal
        open={skuModal.open}
        onClose={() => setSkuModal({ open: false, initial: null })}
        onSave={saveSkuBoost}
        initial={skuModal.initial}
      />

      <style>{`.row-expired td { opacity: 0.5; }`}</style>
    </div>
  )
}
