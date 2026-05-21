import React, { useState } from 'react'
import {
  Table, Button, Input, Select, Space, Card, Tag, Modal, Form,
  DatePicker, Typography, Row, Col, Tabs, Switch, Badge,
  Popconfirm, message, Tooltip, Alert, Divider
} from 'antd'
import {
  SearchOutlined, PlusOutlined, DeleteOutlined,
  ArrowUpOutlined, StarOutlined, RobotOutlined,
  UpOutlined, DownOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { RangePicker } = DatePicker

const BRANDS = ['COSRX', 'LANEIGE', 'SAMYANG', 'NONGSHIM', 'ANESSA', 'INNISFREE', 'MEIJI', 'GLICO', 'CALBEE', 'LOTTE']
const CATEGORIES = ['K-Beauty & Skincare', 'Snacks & Noodles', 'Tea & Beverages', 'Sweets & Desserts', 'Cooking & Pantry', 'Home & Living']
const SELLER_TYPES = ['自营', '代销', 'FBY', '直邮', '预售']

const mockProducts = [
  { id: 'P001', itemNo: 'YM-10012345', goodsId: 'G-88821', name: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml', brand: 'COSRX', category: 'K-Beauty & Skincare', sellerType: '自营', price: 24.99, stock: 342, status: 'in_stock', gmv: 12480, convRate: '8.2%' },
  { id: 'P002', itemNo: 'YM-10023456', goodsId: 'G-88822', name: 'LANEIGE Lip Sleeping Mask Berry 20g', brand: 'LANEIGE', category: 'K-Beauty & Skincare', sellerType: 'FBY', price: 24.00, stock: 156, status: 'in_stock', gmv: 9840, convRate: '7.1%' },
  { id: 'P003', itemNo: 'YM-10034567', goodsId: 'G-88823', name: 'Samyang Buldak Hot Chicken Ramen 5 Pack', brand: 'SAMYANG', category: 'Snacks & Noodles', sellerType: '自营', price: 11.99, stock: 892, status: 'in_stock', gmv: 18920, convRate: '12.4%' },
  { id: 'P005', itemNo: 'YM-10056789', goodsId: 'G-88825', name: 'Meiji Hello Panda Chocolate Biscuits 260g', brand: 'MEIJI', category: 'Sweets & Desserts', sellerType: '直邮', price: 5.49, stock: 234, status: 'in_stock', gmv: 4320, convRate: '9.8%' },
  { id: 'P006', itemNo: 'YM-10067890', goodsId: 'G-88826', name: 'Innisfree Green Tea Seed Hyaluronic Serum 80ml', brand: 'INNISFREE', category: 'K-Beauty & Skincare', sellerType: '自营', price: 26.50, stock: 178, status: 'in_stock', gmv: 8920, convRate: '6.5%' },
  { id: 'P007', itemNo: 'YM-10078901', goodsId: 'G-88827', name: 'Nongshim Premium Shin Black Ramyun 4 Pack', brand: 'NONGSHIM', category: 'Snacks & Noodles', sellerType: 'FBY', price: 9.99, stock: 445, status: 'in_stock', gmv: 14200, convRate: '11.2%' },
  { id: 'P008', itemNo: 'YM-10089012', goodsId: 'G-88828', name: 'Pocky Chocolate Cream Biscuit Sticks 9 Pack', brand: 'GLICO', category: 'Sweets & Desserts', sellerType: '代销', price: 4.99, stock: 612, status: 'in_stock', gmv: 6780, convRate: '10.1%' },
]

const mockPinned = [
  { key: 'pin1', productId: 'P003', name: 'Samyang Buldak Hot Chicken Ramen 5 Pack', brand: 'SAMYANG', category: 'Snacks & Noodles', price: 11.99, validStart: '2026-04-01', validEnd: '2026-04-30', pinnedBy: 'erin.lin', pinnedAt: '2026-04-01' },
  { key: 'pin2', productId: 'P001', name: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml', brand: 'COSRX', category: 'K-Beauty & Skincare', price: 24.99, validStart: '2026-04-10', validEnd: '2026-05-10', pinnedBy: 'erin.lin', pinnedAt: '2026-04-10' },
]

const autoCategories = [
  { key: 'ac1', category: 'K-Beauty & Skincare', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
  { key: 'ac2', category: 'Snacks & Noodles', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
  { key: 'ac3', category: 'Tea & Beverages', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
  { key: 'ac4', category: 'Sweets & Desserts', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
  { key: 'ac5', category: 'Cooking & Pantry', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
  { key: 'ac6', category: 'Home & Living', topN: 100, lastUpdated: '2026-04-17 06:00', productCount: 100 },
]

export default function RecommendedPage() {
  const [pinned, setPinned] = useState(mockPinned)
  const [searchText, setSearchText] = useState('')
  const [filterBrand, setFilterBrand] = useState(null)
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterSellerType, setFilterSellerType] = useState(null)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [autoEnabled, setAutoEnabled] = useState(true)
  const [form] = Form.useForm()

  const filteredProducts = mockProducts.filter(p => {
    const alreadyPinned = pinned.some(pin => pin.productId === p.id)
    const matchSearch = !searchText ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.itemNo.toLowerCase().includes(searchText.toLowerCase()) ||
      p.goodsId.toLowerCase().includes(searchText.toLowerCase())
    const matchBrand = !filterBrand || p.brand === filterBrand
    const matchCat = !filterCategory || p.category === filterCategory
    const matchSeller = !filterSellerType || p.sellerType === filterSellerType
    const matchStock = !onlyInStock || p.status === 'in_stock'
    return !alreadyPinned && matchSearch && matchBrand && matchCat && matchSeller && matchStock
  })

  const handlePin = () => {
    form.validateFields().then(values => {
      const newPinned = selectedProducts.map(pid => {
        const product = mockProducts.find(p => p.id === pid)
        return {
          key: `pin${Date.now()}_${pid}`,
          productId: pid,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          validStart: values.validPeriod[0].format('YYYY-MM-DD'),
          validEnd: values.validPeriod[1].format('YYYY-MM-DD'),
          pinnedBy: 'erin.lin',
          pinnedAt: dayjs().format('YYYY-MM-DD'),
        }
      })
      setPinned(prev => [...newPinned, ...prev])
      setPinModalOpen(false)
      setSelectedProducts([])
      form.resetFields()
      setSearchText('')
      message.success(`已置顶 ${newPinned.length} 个商品`)
    })
  }

  const handleUnpin = (key) => {
    setPinned(prev => prev.filter(p => p.key !== key))
    message.success('已取消置顶')
  }

  const isExpired = (validEnd) => dayjs(validEnd).isBefore(dayjs(), 'day')

  const moveUp = (idx) => {
    if (idx === 0) return
    const newPinned = [...pinned]
    ;[newPinned[idx - 1], newPinned[idx]] = [newPinned[idx], newPinned[idx - 1]]
    setPinned(newPinned)
  }

  const moveDown = (idx) => {
    if (idx === pinned.length - 1) return
    const newPinned = [...pinned]
    ;[newPinned[idx], newPinned[idx + 1]] = [newPinned[idx + 1], newPinned[idx]]
    setPinned(newPinned)
  }

  const pinnedColumns = [
    {
      title: '排序',
      width: 90,
      render: (_, __, idx) => (
        <Space size={4}>
          <Text type="secondary" style={{ fontSize: 13, width: 24 }}>#{idx + 1}</Text>
          <Button size="small" icon={<UpOutlined />} disabled={idx === 0} onClick={() => moveUp(idx)} style={{ border: 'none', background: 'none', boxShadow: 'none' }} />
          <Button size="small" icon={<DownOutlined />} disabled={idx === pinned.length - 1} onClick={() => moveDown(idx)} style={{ border: 'none', background: 'none', boxShadow: 'none' }} />
        </Space>
      ),
    },
    {
      title: '商品信息',
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
          <Space size={6}>
            <Tag>{r.brand}</Tag>
            <Tag color="blue">{r.category}</Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>${r.price}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '有效期',
      render: (_, r) => (
        <Space direction="vertical" size={1}>
          <Text style={{ fontSize: 13 }}>{r.validStart} ~ {r.validEnd}</Text>
          {isExpired(r.validEnd)
            ? <Tag color="red">已过期</Tag>
            : <Tag color="green">生效中</Tag>}
        </Space>
      ),
    },
    { title: '置顶人', dataIndex: 'pinnedBy', width: 100, render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text> },
    {
      title: '操作',
      width: 100,
      render: (_, r) => (
        <Popconfirm title="确认取消置顶？" onConfirm={() => handleUnpin(r.key)}>
          <Button size="small" danger icon={<DeleteOutlined />}>取消置顶</Button>
        </Popconfirm>
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
    { title: '日GMV', dataIndex: 'gmv', width: 90, render: v => <Text style={{ color: '#16997F' }}>${v.toLocaleString()}</Text>, sorter: (a, b) => a.gmv - b.gmv },
    { title: '转化率', dataIndex: 'convRate', width: 80 },
    { title: '库存', dataIndex: 'status', width: 70, render: (v, r) => v === 'in_stock' ? <Badge status="success" text={r.stock} /> : <Badge status="error" text="缺货" /> },
  ]

  const autoColumns = [
    { title: '一级分类', dataIndex: 'category', render: v => <Tag color="blue">{v}</Tag> },
    { title: '推荐逻辑', render: () => <Text type="secondary">每日更新 Top {100} 商品（按 GMV 排序）</Text> },
    { title: '商品数量', dataIndex: 'productCount', width: 100, render: v => <Text strong>{v} 个</Text> },
    { title: '最后更新', dataIndex: 'lastUpdated', width: 160, render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text> },
  ]

  return (
    <div>
      <Tabs
        defaultActiveKey="manual"
        items={[
          {
            key: 'manual',
            label: <Space><StarOutlined />手动置顶</Space>,
            children: (
              <div>
                <Card
                  title={`已置顶商品 (${pinned.length})`}
                  extra={<Button type="primary" icon={<ArrowUpOutlined />} onClick={() => setPinModalOpen(true)}>添加置顶商品</Button>}
                  style={{ marginBottom: 16 }}
                >
                  <Alert
                    message="置顶商品将优先展示给创作者，排在自动推荐商品之前。置顶有效期到期后自动失效。"
                    type="info" showIcon style={{ marginBottom: 16 }}
                  />
                  <Table
                    columns={pinnedColumns}
                    dataSource={pinned}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: '暂无置顶商品' }}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: 'auto',
            label: <Space><RobotOutlined />自动推荐</Space>,
            children: (
              <Card
                title="自动推荐配置"
                extra={
                  <Space>
                    <Text type="secondary">自动推荐</Text>
                    <Switch
                      checked={autoEnabled}
                      onChange={v => { setAutoEnabled(v); message.success(v ? '自动推荐已开启' : '自动推荐已关闭') }}
                      checkedChildren="开启" unCheckedChildren="关闭"
                    />
                  </Space>
                }
              >
                <Alert
                  message="自动推荐逻辑：每日 06:00 自动更新，按各一级分类的 GMV Top 100 商品推荐给创作者。手动置顶商品优先级高于自动推荐。"
                  type="info" showIcon style={{ marginBottom: 16 }}
                />
                <Table
                  columns={autoColumns}
                  dataSource={autoEnabled ? autoCategories : []}
                  pagination={false}
                  locale={{ emptyText: '自动推荐已关闭' }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Pin Modal */}
      <Modal
        title={<Space><ArrowUpOutlined style={{ color: '#16997F' }} />添加置顶商品</Space>}
        open={pinModalOpen}
        onOk={handlePin}
        onCancel={() => { setPinModalOpen(false); setSelectedProducts([]); form.resetFields(); setSearchText('') }}
        okText="确认置顶"
        cancelText="取消"
        width={960}
        okButtonProps={{ disabled: selectedProducts.length === 0 }}
      >
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
            <Select placeholder="品牌" allowClear showSearch style={{ width: 130 }}
              value={filterBrand} onChange={setFilterBrand}
              options={BRANDS.map(b => ({ value: b, label: b }))} />
          </Col>
          <Col>
            <Select placeholder="品类" allowClear style={{ width: 160 }}
              value={filterCategory} onChange={setFilterCategory}
              options={CATEGORIES.map(c => ({ value: c, label: c }))} />
          </Col>
          <Col>
            <Select placeholder="卖家类型" allowClear style={{ width: 120 }}
              value={filterSellerType} onChange={setFilterSellerType}
              options={SELLER_TYPES.map(s => ({ value: s, label: s }))} />
          </Col>
          <Col>
            <Button type={onlyInStock ? 'primary' : 'default'} onClick={() => setOnlyInStock(v => !v)}>
              只看有货
            </Button>
          </Col>
        </Row>

        <Table
          rowSelection={{ selectedRowKeys: selectedProducts, onChange: setSelectedProducts }}
          columns={productColumns}
          dataSource={filteredProducts.map(p => ({ ...p, key: p.id }))}
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 240 }}
        />

        {selectedProducts.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#fff7e6', borderRadius: 4 }}>
            <Text>已选 <Text strong style={{ color: '#16997F' }}>{selectedProducts.length}</Text> 个商品，请设置置顶有效期：</Text>
            <Form form={form} layout="inline" style={{ marginTop: 12 }}>
              <Form.Item name="validPeriod" label="有效期" rules={[{ required: true, message: '请选择有效期' }]}>
                <RangePicker />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}
