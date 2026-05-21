import React, { useState } from 'react'
import {
  Table, Button, Input, Select, Space, Card, Tag, Modal, Form,
  DatePicker, InputNumber, Typography, Row, Col, message,
  Popconfirm, Badge, Alert, Tooltip
} from 'antd'
import {
  SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined,
  GiftOutlined, LockOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useCreators, isActive } from '../context/CreatorsContext'

const { Text } = Typography
const { RangePicker } = DatePicker

const BRANDS = ['COSRX', 'LANEIGE', 'SAMYANG', 'NONGSHIM', 'ANESSA', 'INNISFREE', 'MEIJI', 'GLICO', 'CALBEE', 'LOTTE']
const CATEGORIES = ['K-Beauty & Skincare', 'Snacks & Noodles', 'Tea & Beverages', 'Sweets & Desserts', 'Cooking & Pantry', 'Home & Living']
const SELLER_TYPES = ['自营', '代销', 'FBY', '直邮', '预售']

const mockProducts = [
  { id: 'P001', itemNo: 'YM-10012345', goodsId: 'G-88821', name: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml', brand: 'COSRX', category: 'K-Beauty & Skincare', sellerType: '自营', price: 24.99, stock: 342, status: 'in_stock' },
  { id: 'P002', itemNo: 'YM-10023456', goodsId: 'G-88822', name: 'LANEIGE Lip Sleeping Mask Berry 20g', brand: 'LANEIGE', category: 'K-Beauty & Skincare', sellerType: 'FBY', price: 24.00, stock: 156, status: 'in_stock' },
  { id: 'P003', itemNo: 'YM-10034567', goodsId: 'G-88823', name: 'Samyang Buldak Hot Chicken Ramen 5 Pack', brand: 'SAMYANG', category: 'Snacks & Noodles', sellerType: '自营', price: 11.99, stock: 892, status: 'in_stock' },
  { id: 'P004', itemNo: 'YM-10045678', goodsId: 'G-88824', name: 'ANESSA Perfect UV Sunscreen Milk SPF50+ 60ml', brand: 'ANESSA', category: 'K-Beauty & Skincare', sellerType: '代销', price: 29.99, stock: 0, status: 'out_of_stock' },
  { id: 'P005', itemNo: 'YM-10056789', goodsId: 'G-88825', name: 'Meiji Hello Panda Chocolate Biscuits 260g', brand: 'MEIJI', category: 'Sweets & Desserts', sellerType: '直邮', price: 5.49, stock: 234, status: 'in_stock' },
  { id: 'P006', itemNo: 'YM-10067890', goodsId: 'G-88826', name: 'Innisfree Green Tea Seed Hyaluronic Serum 80ml', brand: 'INNISFREE', category: 'K-Beauty & Skincare', sellerType: '自营', price: 26.50, stock: 178, status: 'in_stock' },
  { id: 'P007', itemNo: 'YM-10078901', goodsId: 'G-88827', name: 'Nongshim Premium Shin Black Ramyun 4 Pack', brand: 'NONGSHIM', category: 'Snacks & Noodles', sellerType: 'FBY', price: 9.99, stock: 445, status: 'in_stock' },
  { id: 'P008', itemNo: 'YM-10089012', goodsId: 'G-88828', name: 'Pocky Chocolate Cream Biscuit Sticks 9 Pack', brand: 'GLICO', category: 'Sweets & Desserts', sellerType: '代销', price: 4.99, stock: 0, status: 'out_of_stock' },
]

const mockSamples = [
  { key: 's1', productId: 'P001', name: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml', brand: 'COSRX', category: 'K-Beauty & Skincare', claimStart: '2026-04-01', claimEnd: '2026-04-30', totalQty: 100, claimedQty: 72 },
  { key: 's2', productId: 'P002', name: 'LANEIGE Lip Sleeping Mask Berry 20g', brand: 'LANEIGE', category: 'K-Beauty & Skincare', claimStart: '2026-04-01', claimEnd: '2026-04-30', totalQty: 100, claimedQty: 45 },
  { key: 's3', productId: 'P003', name: 'Samyang Buldak Hot Chicken Ramen 5 Pack', brand: 'SAMYANG', category: 'Snacks & Noodles', claimStart: '2026-04-01', claimEnd: '2026-04-30', totalQty: 100, claimedQty: 100 },
  { key: 's4', productId: 'P005', name: 'Meiji Hello Panda Chocolate Biscuits 260g', brand: 'MEIJI', category: 'Sweets & Desserts', claimStart: '2026-04-15', claimEnd: '2026-05-15', totalQty: 50, claimedQty: 10 },
]

export default function SamplesPage() {
  const { creators } = useCreators()
  const [samples, setSamples] = useState(mockSamples)
  const [searchText, setSearchText] = useState('')
  const [filterBrand, setFilterBrand] = useState(null)
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterSellerType, setFilterSellerType] = useState(null)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  // Filter products for the add modal
  const filteredProducts = mockProducts.filter(p => {
    const matchSearch = !searchText ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.itemNo.toLowerCase().includes(searchText.toLowerCase()) ||
      p.goodsId.toLowerCase().includes(searchText.toLowerCase())
    const matchBrand = !filterBrand || p.brand === filterBrand
    const matchCat = !filterCategory || p.category === filterCategory
    const matchSeller = !filterSellerType || p.sellerType === filterSellerType
    const matchStock = !onlyInStock || p.status === 'in_stock'
    return matchSearch && matchBrand && matchCat && matchSeller && matchStock
  })

  const handleAddSamples = () => {
    form.validateFields().then(values => {
      const newSamples = selectedProducts.map(pid => {
        const product = mockProducts.find(p => p.id === pid)
        return {
          key: `s${Date.now()}_${pid}`,
          productId: pid,
          name: product.name,
          brand: product.brand,
          category: product.category,
          claimStart: values.claimPeriod[0].format('YYYY-MM-DD'),
          claimEnd: values.claimPeriod[1].format('YYYY-MM-DD'),
          totalQty: values.totalQty,
          claimedQty: 0,
        }
      })
      setSamples(prev => [...prev, ...newSamples])
      setAddModalOpen(false)
      setSelectedProducts([])
      form.resetFields()
      setSearchText('')
      message.success(`已添加 ${newSamples.length} 个样品`)
    })
  }

  const handleEdit = (record) => {
    setEditRecord(record)
    editForm.setFieldsValue({
      claimPeriod: [dayjs(record.claimStart), dayjs(record.claimEnd)],
      totalQty: record.totalQty,
    })
    setEditModalOpen(true)
  }

  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      setSamples(prev => prev.map(s => s.key === editRecord.key ? {
        ...s,
        claimStart: values.claimPeriod[0].format('YYYY-MM-DD'),
        claimEnd: values.claimPeriod[1].format('YYYY-MM-DD'),
        totalQty: values.totalQty,
      } : s))
      setEditModalOpen(false)
      message.success('样品设置已更新')
    })
  }

  const handleDelete = (key) => {
    setSamples(prev => prev.filter(s => s.key !== key))
    message.success('已移除样品')
  }

  const sampleColumns = [
    {
      title: '商品信息',
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
          <Space size={8}>
            <Tag>{r.brand}</Tag>
            <Tag color="blue">{r.category}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: '领取时间',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.claimStart} ~ {r.claimEnd}</Text>,
    },
    {
      title: '最大领取件数',
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Text>{r.claimedQty} / {r.totalQty} 已领取</Text>
          {r.claimedQty >= r.totalQty && <Tag color="red">已售罄</Tag>}
        </Space>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确认移除此样品？" onConfirm={() => handleDelete(r.key)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const productColumns = [
    { title: 'Item No.', dataIndex: 'itemNo', width: 130, render: v => <Text code style={{ fontSize: 11 }}>{v}</Text> },
    {
      title: '商品名称',
      render: (_, r) => (
        <Space direction="vertical" size={1}>
          <Text style={{ fontSize: 13 }}>{r.name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Goods ID: {r.goodsId}</Text>
        </Space>
      ),
    },
    { title: '品牌', dataIndex: 'brand', width: 100, render: v => <Tag>{v}</Tag> },
    { title: '品类', dataIndex: 'category', width: 160, render: v => <Tag color="blue">{v}</Tag> },
    { title: '类型', dataIndex: 'sellerType', width: 80, render: v => <Tag color="purple">{v}</Tag> },
    { title: '价格', dataIndex: 'price', width: 80, render: v => `$${v}` },
    {
      title: '库存',
      dataIndex: 'status',
      width: 80,
      render: (v, r) => v === 'in_stock'
        ? <Badge status="success" text={`${r.stock}`} />
        : <Badge status="error" text="缺货" />,
    },
  ]

  // 可领取样品的创作者：featureSamples=true 且 活跃
  const eligibleCount = creators.filter(c => c.featureSamples && isActive(c.key)).length
  const samplesEnabledCount = creators.filter(c => c.featureSamples).length

  return (
    <div>
      <Alert
        message={`当前共 ${samplesEnabledCount} 位创作者开启了样品功能，其中 ${eligibleCount} 位处于活跃状态（可实际领取）。`}
        type="info" showIcon style={{ marginBottom: 16 }}
      />
      <Card
        title={<Space><GiftOutlined style={{ color: '#16997F' }} /><span>样品管理</span></Space>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>添加样品</Button>}
        style={{ marginBottom: 16 }}
      >
        <Table
          columns={sampleColumns}
          dataSource={samples}
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }}
          locale={{ emptyText: '暂无样品，点击右上角添加' }}
        />
      </Card>

      {/* Add Sample Modal */}
      <Modal
        title="添加样品"
        open={addModalOpen}
        onOk={handleAddSamples}
        onCancel={() => { setAddModalOpen(false); setSelectedProducts([]); form.resetFields(); setSearchText('') }}
        okText="确认添加"
        cancelText="取消"
        width={900}
        okButtonProps={{ disabled: selectedProducts.length === 0 }}
      >
        {/* Search & Filter */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="搜索商品名称 / Item No. / Goods ID"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder="品牌" allowClear showSearch style={{ width: 130 }}
              value={filterBrand} onChange={setFilterBrand}
              options={BRANDS.map(b => ({ value: b, label: b }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="品类" allowClear style={{ width: 160 }}
              value={filterCategory} onChange={setFilterCategory}
              options={CATEGORIES.map(c => ({ value: c, label: c }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="卖家类型" allowClear style={{ width: 120 }}
              value={filterSellerType} onChange={setFilterSellerType}
              options={SELLER_TYPES.map(s => ({ value: s, label: s }))}
            />
          </Col>
          <Col>
            <Button
              type={onlyInStock ? 'primary' : 'default'}
              onClick={() => setOnlyInStock(v => !v)}
            >只看有货</Button>
          </Col>
        </Row>

        <Table
          rowSelection={{
            selectedRowKeys: selectedProducts,
            onChange: setSelectedProducts,
            getCheckboxProps: r => ({ disabled: r.status === 'out_of_stock' }),
          }}
          columns={productColumns}
          dataSource={filteredProducts.map(p => ({ ...p, key: p.id }))}
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 240 }}
        />

        {selectedProducts.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#fff7e6', borderRadius: 4 }}>
            <Text>已选 <Text strong style={{ color: '#16997F' }}>{selectedProducts.length}</Text> 个商品，请设置领取时间和发放件数：</Text>
            <Form form={form} layout="inline" style={{ marginTop: 12 }}>
              <Form.Item name="claimPeriod" label="领取时间" rules={[{ required: true, message: '请选择领取时间' }]}>
                <RangePicker />
              </Form.Item>
              <Form.Item name="totalQty" label="最大领取件数" rules={[{ required: true, message: '请输入件数' }]}>
                <InputNumber min={1} max={9999} placeholder="如：100" style={{ width: 100 }} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="编辑样品设置"
        open={editModalOpen}
        onOk={handleEditSave}
        onCancel={() => setEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        {editRecord && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>{editRecord.name}</Text>
          </div>
        )}
        <Form form={editForm} layout="vertical">
          <Form.Item name="claimPeriod" label="领取时间" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="totalQty" label="最大领取件数" rules={[{ required: true }]}>
            <InputNumber min={1} max={9999} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
