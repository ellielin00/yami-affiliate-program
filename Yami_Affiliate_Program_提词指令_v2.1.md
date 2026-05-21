# Yami Affiliate Program — UX/UI 设计提词指令 v2.1

---

## Role & Context 角色与项目背景

你现在是一位资深的 UX/UI 设计专家，精通响应式 Web 设计（**PC Web 优先，同时支持 Mobile Web 适配**）的电商裂变和创作者变现工具设计。你的任务是为北美最大的亚洲商品购物平台 Yami (亚米) 设计一套「全民 Affiliate Program (联盟营销项目)」的前端交互流程和高保真线框图。

**平台优先级：** 所有页面以 **PC Web (Desktop)** 为主要设计基准，同时确保在 Mobile Web 上有良好的响应式适配体验。布局需考虑桌面端的宽屏优势（如多栏布局、侧边栏导航），在移动端自动回落为单栏堆叠。

**项目基调：** 这是一个面向北美社交媒体网红 (Influencers & Creators) 的 Affiliate 项目。设计风格需要：年轻、活力、极简、极具社交属性、激励感强。

---

## Target Audience 目标用户画像

- **用户是谁：** 在北美主流社交媒体平台（Instagram、TikTok、YouTube）上拥有一定粉丝量的内容创作者和网红 (Influencers & Creators)，涵盖美食开箱、零食评测、美妆护肤、生活方式等垂类。用户以北美华人留学生、年轻白领为主，也包括对亚洲商品感兴趣的非华裔创作者。
- **用户诉求：** "我在社交平台上有自己的粉丝群体，想通过推荐我喜欢的亚米商品来赚取佣金，同时给粉丝提供专属折扣。"
- **核心痛点：** 看不懂复杂的专业网盟数据图表；希望获取方便分享的素材（短链、折扣码）；提现和收益追踪流程太繁琐。

---

## User Flow 核心用户体验路径 (Desktop-First, Mobile-Responsive)

请为以下 4 个阶段设计流畅的交互路径：

1. **轻量级入驻 (Easy Onboarding)：** 访问落地页 ➔ 绑定或输入社媒主页 URL（如小红书/IG ID） ➔ 提交申请 ➔ 等待审核（约 7 个工作日）。
2. **社媒友好型分享 (Social Sharing)：** 在创作者工作台「分享」页 ➔ 浏览推荐分享商品 ➔ 获取专属折扣码 (Promo Code) 和专属短链 ➔ 一键复制/分享至社交 App。也可将商品加入自定义集合页，批量管理分享内容。
3. **收益看板 (Dashboard)：** 打开创作者工作台首页 ➔ 直观看到"佣金总额"、"本月佣金"和专属折扣码 ➔ 通过折线图查看多维度业绩趋势。
4. **账单与明细 (Billing)：** 在钱包页查看每月账单明细 ➔ 了解订单级佣金归属和状态。

---

## Page-by-Page Specifications 核心页面模块要求

请详细输出以下核心页面的线框图结构 (Wireframe Structure) 和关键模块。**以 PC Web 桌面端为主要设计基准**，充分利用宽屏布局（如左右分栏、侧边导航），同时说明在 Mobile Web 下的响应式适配方案。

---

### 页面 1：招募落地页 (Creator Landing Page) — PC Web 优先，Mobile 适配

> **注意：** Landing Page 面向所有未加入项目的用户，不展示任何折扣码信息。折扣码仅在用户通过审核、进入创作者工作台后才可见。

- **Hero Section：** 年轻化、带生活气息的标题（如：Share Your Yami Haul & Earn Cash! / 分享你的亚米好物，赚取现金奖励），配合醒目的 **[Join for Free]** 按钮，点击跳转到页面 1.5，开始注册。
  - **微交互：** [Join for Free] 按钮 Hover 时有轻微放大 (scale 1.03) + 阴影加深效果；点击时有按下回弹 (press bounce) 反馈。
- **How it Works (极简三步走)：** 用三个可爱 Icon 表示：
  1. Apply & Get Your Code（申请并获取你的专属码）
  2. Post on IG / TikTok / YouTube（在社交平台发布内容）
  3. Get Paid（获得佣金收益）
  - **微交互：** 三个步骤卡片在 PC 端 Hover 时，Icon 有轻微上浮 (translateY -4px) + 卡片底部阴影扩散的效果，引导用户视线逐步移动。
- **权益亮点卡片：** 突出 Affiliate 项目的核心价值：
  - 你的粉丝用你的专属码下单享受折扣
  - 你获得高额佣金
  - 双赢 (Win-Win)
  - ⚠️ 此处只说明机制，不展示实际的折扣码示例。
  - **微交互：** 权益卡片 Hover 时边框高亮 (border-color 切换为品牌色) + 背景色微调。
- **响应式说明：** PC 端 Hero 采用左文右图布局，三步走横向排列；Mobile 端回落为单栏垂直堆叠。

---

### 页面 1.5：极简入驻与注册流程 (Frictionless Onboarding Flow) — PC 端居中卡片式弹窗，Mobile 端全屏页面

本流程的核心目标是：**极速、低阻力、让用户在 30 秒内完成申请提交。**

- **进度指示器 (Progress Bar)：** 顶部提供极简的进度条（如：Step 1 of 2），让用户有明确的预期。进度条在步骤切换时带有平滑的填充动画 (smooth fill transition)。

#### Step 1：身份绑定 (Social Identity)

- **标题：** "Where will you share your Yami favorites?" (你打算在哪里分享亚米好物？)
- **社媒平台卡片列表 (Platform Cards)：** 采用**独立卡片式设计**，每个平台是一张完整的卡片，**卡片内部自包含**平台图标、平台名称、输入框和粉丝量选择器。具体交互如下：
  - **默认折叠态：** 所有平台以一组横向排列（PC 端）或纵向堆叠（Mobile 端）的卡片展示，每张卡片仅显示平台 Icon + 平台名称 + 右侧勾选框。卡片呈未选中的灰色/浅色状态。
  - **选中展开态：** 用户点击某张平台卡片后，该卡片被选中（边框高亮为品牌色，背景色变浅），卡片**原地向下展开** (expand in-place)，在**卡片内部**露出两个输入区域：
    - 输入框："Paste your profile link or ID here"（粘贴你的主页链接或 ID）
    - 粉丝量下拉选择器：500~1,000 / 1,000~3,000 / 3,000~5,000 / 5,000+
  - **支持多选：** 用户可同时选中多个平台卡片，每个被选中的卡片独立展开、独立填写，互不干扰。
  - **再次点击取消：** 点击已选中的卡片可取消选择，卡片收起并恢复灰色状态。
  - **可选平台：** Instagram、TikTok、YouTube、小红书 RED、微信 WeChat。
  - **微交互：** 卡片 Hover 时有轻微边框亮色过渡 (border highlight)；选中/展开时有 smooth expand 动画 (max-height transition, ~200ms ease-out)；取消选中时平滑收起。
- **关键设计原则：** 输入框始终紧贴其所属的平台卡片内部，不会因为多选而出现"输入框与平台 Icon 距离过远"的体验割裂问题。每个平台的信息填写是自包含的。

#### Step 2：偏好与协议 (Preferences & Terms)

- **带货偏好标签 (Category Tags)：** "What do you love buying?" 提供可多选的视觉化标签（如 🍜零食泡面、💄美妆护肤、🏠家居百货），方便系统后续在 Dashboard 为他们推荐高佣爆款。
  - **微交互：** 标签 Hover 时背景色加深；选中时带有弹性缩放动画 (scale bounce) + 品牌色填充 + 对勾 Icon 出现。
- **极简默认同意的用户协议 (Simplified T&C)：** 抛弃长篇大论，一句话概括："I agree to the Affiliate Terms (No self-purchasing, keep it authentic!)"（我同意联盟协议：禁止自我购买，保持真实分享！）。
- **主按钮：[Submit Application]**
  - **微交互：** 按钮在表单未完整填写时为 disabled 灰色态；填写完成后按钮变为品牌色 + 轻微脉冲动画 (subtle pulse) 引导点击。Hover 时放大 + 阴影加深。

---

### 页面 1.6：申请状态页 (Application Status Page)

> 用户提交申请后、以及后续再次访问 Affiliate Program 页面链接时，都会来到此状态页。根据审核进度展示不同的内容。

#### 状态 A：审核中 (Under Review)

- **视觉：** 友好的等待状态插画或 Icon（如沙漏、时钟）。
- **标题：** "Your application is under review"（你的申请正在审核中）
- **正文说明：** 预计审核时间约 7 个工作日。审核结果会通过邮件通知到你的注册邮箱 `u***r@email.com`（脱敏展示用户邮箱），请注意查收邮件。
- **辅助提示：** "Stay tuned! We'll notify you as soon as there's an update."

#### 状态 B：审核未通过 (Application Declined)

- **视觉：** 柔和的未通过状态 Icon（避免强烈的错误/失败感）。
- **标题：** "We're sorry, your application wasn't approved this time"（很遗憾，你的申请本次未通过审核）
- **正文说明：** 如需帮助或想了解更多，请联系我们：**help@yami.com**
- **CTA 按钮：** [Contact Us]（点击可打开邮件客户端发送邮件）
  - **微交互：** Hover 时按钮颜色加深 + 下划线出现。

#### 状态 C：审核通过 (Approved) — 首次进入

- **直接跳转至创作者工作台首页（页面 2）。**
- **中间弹窗 (Modal)：**
  - **标题：** "Welcome to the Yami Creator Program! 🎉"（恭喜你正式成为 Yami 创作者！）
  - **正文：** 欢迎加入！为了确保你能顺利收到佣金支付，建议你完善税表信息 (Tax Form)。
  - **双按钮：**
    - **主按钮：** [Complete Tax Form]（去完善税表）➔ 跳转到个人中心的税表填写页
    - **次按钮 / 文字链：** [Skip for Now]（稍后再说）➔ 关闭弹窗，留在工作台首页
  - **注意：** 税表不是强制填写的。若用户跳过，在**工作台首页**和**钱包页**的顶部，都需要展示一条持续性的提醒横幅 (Persistent Banner)："Complete your tax form to receive commission payouts → [Complete Now]"

---

### 页面 2：创作者工作台首页 (Creator Dashboard — Home Tab)

> 这是创作者日常打开最多的页面，承载数据概览 + 关键信息展示 + 运营推荐。

#### 全局导航 (Navigation)

- **PC 端：** 采用**左侧固定侧边栏 (Sidebar)** 导航，宽度约 220px，包含 Yami 品牌 Logo、用户头像/昵称，以及 4 个导航项。侧边栏背景为深色或品牌色。
- **Mobile 端：** 回落为固定底部 Tab Bar。

| 导航项 | Icon | 对应页面 |
|---|---|---|
| Home | 🏠 | 页面 2（本页） |
| Share | 🔗 | 页面 3 |
| Wallet | 💰 | 页面 4 |
| Profile | 👤 | 页面 5 |

- **微交互 (Sidebar)：** 当前选中项有品牌色左边框高亮 (active indicator)；Hover 其他项时背景色微亮 + 文字颜色渐变过渡；Icon 在 Hover 时有轻微缩放 (scale 1.1)。

#### 税表提醒横幅 (Tax Form Reminder — 条件显示)

- **显示条件：** 用户尚未完善税表时显示。
- **样式：** 页面顶部的醒目提醒条（黄色/橙色警告风格），可关闭但下次访问仍出现，直到用户完成填写。
- **文案：** "Complete your tax form to receive commission payouts → [Complete Now]"
- **微交互：** [Complete Now] 链接 Hover 时有下划线 + 颜色加深效果；关闭按钮 (×) Hover 时旋转 90°。

#### 核心数据卡片区 (Key Metrics Area)

设计成一组醒目的信息卡片，**PC 端横向三栏并排**，**Mobile 端堆叠或横向滚动**，优先展示以下 3 个核心数据：

| 数据项 | 说明 | 视觉建议 |
|---|---|---|
| **Total Earnings** (佣金总额) | 用户累计已确认获得的佣金总金额 | 大字号，品牌色强调 |
| **This Month** (本月佣金) | 当前自然月的已确认佣金 | 次要字号 |
| **Your Code** (专属折扣码) | 用户的专属 Promo Code（如 YAMI-AMY20） | 醒目展示 + 一键 [Copy] 按钮 |

- **微交互：** 卡片 Hover 时有轻微上浮 (translateY -2px) + 阴影扩散效果。[Copy] 按钮点击后文案短暂变为 "Copied ✓"（持续 1.5 秒后恢复），同时触发一个小型 confetti 或 checkmark 动画反馈。

#### 业绩趋势图 (Performance Trend Chart)

这是本页的核心视觉焦点，需要设计得**极简且具有鼓励感**。

- **数据维度切换 (Metric Toggle)：** 图表上方提供一组 Toggle 按钮，用户可切换查看不同维度的数据：
  - **[Earnings]** 收益金额（默认选中）
  - **[Clicks]** 点击量
  - **[Orders]** 订单数量
  - **微交互：** Toggle 按钮切换时有平滑的滑块动画 (sliding indicator)；切换数据维度时，折线图以淡入淡出 (fade + morph) 的方式过渡到新数据，而不是硬切。
- **时间维度筛选 (Time Range Filter)：** 提供以下时间颗粒度选项：
  - **[7 Days]** 最近 7 天（默认选中）
  - **[30 Days]** 最近 30 天
  - **[This Month]** 本月
  - **[Last Month]** 上月
  - **微交互：** 选中项有品牌色填充背景；Hover 未选中项时有浅色背景过渡。
- **视觉表现 (Visual Design)：**
  - 抛弃复杂的 X/Y 轴网格线。
  - 使用平滑的贝塞尔曲线 (Smooth Curve)，并在折线下方带有与主题色一致的半透明渐变填充 (Gradient Fill)，让数据看起来更饱满。
- **高亮触点 (Hover / Touch Interactions)：**
  - 自动高亮显示最高峰值的那个点（如标注 "Best Day!"）。
  - **PC 端：** 鼠标 Hover 折线上的数据点时，数据点放大 (scale 1.5) + 出现吸附式悬浮提示框 (Tooltip)，显示具体日期和对应金额/点击量/订单数。鼠标移开后 Tooltip 平滑淡出。
  - **Mobile 端：** 手指在折线上滑动时触发同样的吸附式 Tooltip。

#### 极简数据摘要 (At a Glance)

在折线图下方，用两到三个并排的小卡片展示关键累计数据：

- **Total Orders** (总出单数)
- **Conversion Rate** (转化率)
- **Total Clicks** (总点击量)

- **微交互：** 每张小卡片 Hover 时有轻微上浮 (translateY -2px) + 阴影加深；数字在首次加载时有从 0 到实际值的递增动画 (count-up animation)。

#### 领取小样模块 (Free Sample Section)

- **标题：** "Try & Share: Free Samples"（试用分享：免费小样）
- **展示形式：** 横向滚动卡片列表（PC 端可展示一排 3-4 张卡片，Mobile 端横向滑动），每张卡片展示一个可领取的小样商品（商品图 + 商品名 + "FREE" 标签）。
- **交互规则：**
  - 每次仅能领取 **1 个** 小样。
  - 点击 [Claim Sample] 按钮后，**不进入加购流程**，直接跳转到结算页，0 元下单。
  - 如果用户已有未完成的小样订单，提示 "You already have a pending sample order"（你已有一个待处理的小样订单）。
- **微交互：** 商品卡片 Hover 时有轻微放大 (scale 1.02) + 阴影扩散。[Claim Sample] 按钮 Hover 时背景色加深；点击后按钮短暂变为加载态 (spinner)，成功后文案变为 "Claimed ✓"。

#### 近期爆款推荐 (Trending to Share)

- 列出目前亚米平台上转化率最高、佣金比例最高的商品（如某款爆款螺蛳粉、面膜）。
- 每个商品卡片旁带有 **[Share]** 按钮（点击跳转到分享页的分享流程）。
- **微交互：** 商品卡片 Hover 时有品牌色左边框出现 (border-left highlight) + 背景色微亮。[Share] 按钮 Hover 时有图标右移箭头动画暗示跳转。

---

### 页面 3：分享页 (Share Tab)

> 创作者获取分享素材、管理推广内容的核心工具页。PC 端利用宽屏可将专属码区固定在页面顶部或左侧，右侧展示商品列表和集合页管理。

#### 3.1 专属 Code 展示区 (Your Code — 固定顶部)

- 醒目展示用户的专属折扣码（如 **YAMI-AMY20**），配合 **[Copy Code]** 按钮。
- 下方展示专属短链（如 `yami.com/x/abcd`），配合 **[Copy Link]** 按钮。
- **微交互：** [Copy Code] / [Copy Link] 按钮点击后文案短暂变为 "Copied ✓" + 轻微的弹性缩放反馈 (scale bounce)。Hover 时按钮边框高亮。

#### 3.2 领取小样 (Free Samples)

- 与首页小样模块功能一致，但此处可展示更完整的小样列表。
- **交互规则同首页：** 每次仅能领取 1 个小样，点击直接进入结算页，0 元下单。

#### 3.3 推荐分享商品 (Recommended Products to Share)

- 展示平台推荐的高佣金/高转化率商品列表。
- 每个商品卡片包含：商品图、商品名、价格、预估佣金金额。
- **每个商品提供两个操作：**
  - **[Share]** — 直接分享：
    - 点击后弹出分享底部弹窗 (Bottom Sheet / PC 端为居中 Modal)，包含：
      - 专属短链（自动携带该商品信息） + [Copy Link]
      - 专属折扣码 + [Copy Code]
      - 底部一排社交平台 Icon（Instagram、TikTok、YouTube 等），点击可唤起对应 App 或打开新标签页
    - **微交互：** 弹窗弹出时有 slide-up (Mobile) 或 fade-in + scale (PC) 动画；社交平台 Icon Hover 时有轻微放大 (scale 1.15) + 该平台品牌色背景出现。
  - **[+ Collection]** — 加入集合页：
    - 点击后弹出选择弹窗：
      - 展示用户已创建的集合页列表，点击即可将商品加入
      - 底部提供 **[+ Create New Collection]** 按钮，点击后输入集合页名称即可新建
    - **微交互：** 商品成功加入集合页后，按钮短暂变为 "Added ✓" + 绿色反馈。
- **微交互 (商品卡片通用)：** 卡片 Hover 时有轻微上浮 + 阴影扩散；预估佣金金额区域以品牌色高亮显示。

#### 3.4 商品集合页管理 (My Collections)

- **标题：** "My Collections"
- **展示形式：** 卡片列表，每张卡片展示一个集合页的名称、商品数量、缩略图预览。
- **支持创建多个集合页。**
- **操作：**
  - **[View & Manage]** — 点击进入集合页详情：
    - 查看集合内所有商品
    - 可移除某个商品
    - 可继续添加商品
    - 可编辑集合页名称
    - 可获取集合页的专属分享链接 **[Copy Collection Link]**
    - 可删除整个集合页
  - **[+ Create New Collection]** — 新建集合页
- **微交互：** 集合卡片 Hover 时有边框品牌色高亮 + 缩略图微放大 (scale 1.03)。[View & Manage] Hover 时有右箭头微动效。删除集合页时弹出确认弹窗，确认按钮需 Hover 0.5 秒后才可点击（防误删）。

---

### 页面 4：钱包页 (Wallet Tab)

> 用户查看佣金收入总览和月度账单明细的页面。
> **注意：** 现阶段不支持线上提现功能，也不做佣金兑换积分的功能。佣金没有"已提现/未提现"的状态区分。

#### 税表提醒横幅 (Tax Form Reminder — 条件显示)

- 与首页一致，尚未完善税表时在页面顶部展示提醒横幅。

#### 佣金总览卡片 (Earnings Overview Card)

- 设计成一张视觉突出的卡片（类似"银行卡"质感，品牌色渐变背景）。
- **展示内容：**
  - **Total Confirmed Earnings** (已确认佣金总额) — 大字号主数据
  - **This Month Earnings** (本月已确认佣金) — 次要数据
- **微交互：** 卡片 Hover 时有微妙的渐变色位移 (gradient shift) + 阴影加深效果。金额数字首次加载时有递增动画 (count-up)。

#### 月度账单列表 (Monthly Billing History)

- **标题：** "Billing History"
- **展示形式：** 按月份降序排列的列表，每一行展示：
  - **月份** (如 "March 2026")
  - **月度佣金合计** (如 "$128.50")
  - **右侧箭头** ➔ 点击进入月度账单详情页
- **微交互：** 列表行 Hover 时整行背景色微亮 + 右侧箭头向右微移 (translateX 4px)。

#### 月度账单详情页 (Monthly Bill Detail)

- **顶部：** 当月佣金合计金额
- **订单明细列表 (Order Detail List)：** 列出该月所有产生佣金的订单，每条订单包含：
  - 购买商品缩略图
  - 商品名称
  - 订单金额
  - 佣金金额
  - **订单状态标签** (Status Tag)，使用口语化、易理解的表述：
  - **微交互：** 状态标签 Hover 时弹出 Tooltip，显示该状态的详细说明文字。订单行 Hover 时整行背景色微亮。

| 状态 | 英文标签 | 中文说明 | 视觉建议 |
|---|---|---|---|
| 已确认 | ✅ Confirmed | 佣金已确认，可计入总额 | 绿色标签 |
| 待确认 | ⏳ Pending | 买家尚未收货，佣金待确认 | 黄色/橙色标签 |
| 已取消/售后 | ❌ Cancelled / Refunded | 买家取消订单或产生售后，无法获得佣金 | 灰色标签 |

- **状态说明区 (Status Legend)：** 在列表顶部或底部，提供简短的状态说明文字：
  - ✅ **Confirmed：** Commission earned and locked in.
  - ⏳ **Pending：** Waiting for buyer to receive the order.
  - ❌ **Cancelled / Refunded：** Order was cancelled or refunded. No commission.

---

### 页面 5：个人中心 (Profile Tab)

- **用户头像与昵称**
  - **微交互：** 头像 Hover 时出现半透明遮罩 + 相机 Icon，暗示可更换头像。
- **功能入口列表：**
  - **Tax Form (税表)：** 填写/编辑税表信息（W-9 或 W-8BEN）
  - **Social Accounts (社媒账号管理)：** 查看/编辑绑定的社媒平台信息
  - **Category Preferences (带货偏好)：** 修改兴趣标签
  - **Notification Settings (通知设置)：** 管理邮件和推送通知偏好
  - **Affiliate Terms (联盟协议)：** 查看完整的协议条款
  - **Help & Support (帮助与支持)：** 常见问题 FAQ + 联系客服 (help@yami.com)
  - **Log Out (退出登录)**
  - **微交互：** 每个列表项 Hover 时背景色微亮 + 右侧箭头向右微移 (translateX 4px)。Tax Form 若未完善，该行末尾带红色小圆点 (badge dot) 提示。

---

### 页面 6：商品/活动页原生推广入口 (Native "Shop & Earn" Integration on PDP) — PC Web 优先，Mobile 适配

> 本流程的核心目标是：**场景化触发 (Contextual Trigger)**，让创作者在浏览任何商品时，只需 1 步即可获取所有分享素材，无需跳出当前购物流程。

#### 入口设计 (Entry Point — The "Earn" Trigger)

- **位置：** 在商品详情页 (PDP) 的价格旁、或者原有的"分享"按钮旁边，注入一个专属的 Affiliate 胶囊按钮 (Pill Button)。
- **视觉强化：** 带有亚米品牌色或金币/闪光 Icon，直接显示明确的预估收益（例如：带有微动效的文本 **[✨ Share to Earn $2.50]** 或 **[💰 赚 $2.50]**），而不是干巴巴的"获取推广链接"。
- **仅对已通过审核的创作者展示此入口。**
- **微交互：** 胶囊按钮有轻微的持续脉冲动画 (subtle pulse glow) 吸引注意力；Hover 时放大 (scale 1.05) + 金币 Icon 有旋转微动效。

#### 弹窗交互 (Modal / Bottom Sheet)

用户点击"赚 $X"按钮后：
- **PC 端：** 弹出居中浮层 (Modal)，带有半透明背景遮罩。
- **Mobile 端：** 从屏幕底部丝滑弹出半屏面板 (Bottom Sheet)。

面板包含以下模块：

- **模块 A：专属短链与折扣码 (Quick Link & Code)**
  - 顶部展示：Your exclusive code: **YAMI-AMY20** 配合一键 **[Copy]** 按钮。
  - 中部展示：已自动生成的极短链接（如 `yami.com/x/abcd`），配合一键 **[Copy Link]** 按钮。
  - **微交互：** [Copy] 按钮点击后文案变为 "Copied ✓" + checkmark 动画。
- **模块 B：加入集合页 (Add to Collection)**
  - 提供 **[+ Add to Collection]** 按钮，点击后弹出选择已有集合页或新建集合页的弹窗。
  - **微交互：** 按钮 Hover 时有品牌色边框出现 + Icon 轻微旋转。
- **模块 C：直达社媒分享 (Direct Social Share)**
  - 底部提供一排横向排列的社交平台 Icon（Instagram、TikTok、YouTube 等）。点击直接唤起对应 App 或打开新标签页。
  - **微交互：** 每个社交 Icon Hover 时放大 (scale 1.15) + 该平台品牌色背景浮现。

---

## Interactions & Edge Cases 交互与体验细节提示

1. **即时正向反馈：** 当有新订单产生时，设计一个类似游戏 "掉金币" 或 "收到红包" 的微交互动画或强推送通知，极大刺激博主继续发帖的欲望。
2. **新手引导 (Tooltips)：** 用户首次进入 Dashboard 时，弹出一个气泡提示："Your Code is your secret weapon. Tell your followers to use it at checkout!"（你的折扣码是杀手锏，记得提醒粉丝结账时使用！）
3. **税表未填写提醒：** 在首页和钱包页持续展示提醒横幅，直到用户完成税表填写。
4. **小样领取限制：** 每次仅可领取 1 个小样，需在前一个小样订单完成后才能领取下一个（具体规则可后续调整）。
5. **集合页上限：** 可设定每位创作者最多创建一定数量的集合页（如 10 个），避免滥用。

---

## Output Deliverables 输出要求

请以结构化的文本形式（Markdown）或者前端组件代码，详细呈现以上每个页面的版块布局、信息层级 (H1/H2/Body)、交互动作 (Hover/Click/Tap 效果)，并说明：
- **响应式布局方案：** 每个页面需说明 PC 端（≥1024px）和 Mobile 端（<768px）的布局差异，包括栏数、导航形式、弹窗形式等。
- **微交互规范：** 所有按钮、卡片、列表项的 Hover 状态、点击反馈、过渡动画需有明确的 CSS 属性描述（如 transition duration、transform 值、easing 函数）。
- **视觉风格建议：** 大量留白、Yami 品牌红色的点缀、圆角卡片以增加亲和力、品牌色渐变用于核心数据卡片。

---

## 更新日志 (Changelog)

### v2.1 更新内容（相对 v2.0 的变更）

1. **用户画像更新：** 目标用户从"普通亚米重度用户"调整为"在北美主流社交平台（Instagram、TikTok、YouTube）上拥有一定粉丝量的内容创作者和网红"，用户诉求和痛点相应调整。
2. **全局微交互补充：** 为所有核心页面的按钮、卡片、列表项、图表等关键交互元素补充了 Hover 效果、点击反馈、过渡动画等微交互设计说明（如 Hover 上浮 + 阴影扩散、Copy 按钮点击后 "Copied ✓" 反馈、数字递增动画等）。
3. **注册流程 Step 1 交互优化：** 将社媒选择器从"选中后在远处展开统一输入框"改为**卡片式自包含设计**——每个平台是一张独立卡片，选中后卡片原地展开，输入框和粉丝量选择器始终紧贴其所属平台内部，避免体验割裂。
4. **平台优先级调整为 PC Web 优先：** 全局从 Mobile-First 切换为 Desktop-First + Mobile-Responsive。PC 端采用侧边栏导航 (Sidebar)、多栏布局等桌面端设计范式；Mobile 端回落为底部 Tab Bar 和单栏堆叠。弹窗在 PC 端使用居中 Modal，Mobile 端使用 Bottom Sheet。

### v2.0 更新内容（相对 v1.0 的变更）

1. **Landing Page 移除折扣码展示：** 折扣码仅在用户通过审核后、在创作者工作台内可见。Landing Page 只说明机制，不展示实际码。
2. **申请状态页重构：** 新增页面 1.6，用户提交申请后及再次访问时，根据审核状态展示不同内容（审核中 / 未通过 / 通过）。审核通过后以中间弹窗欢迎用户并引导完善税表。
3. **创作者工作台导航优化：** 底部 Tab Bar 调整为 4 个 Tab — Home（首页）、Share（分享）、Wallet（钱包）、Profile（个人中心）。
4. **Dashboard 数据看板增强：** 支持多维度数据切换（收益/点击/订单）和多时间维度筛选（7天/30天/本月/上月）。
5. **首页核心信息强化：** 佣金总额、本月佣金、专属折扣码在首页醒目位置展示。
6. **新增领取小样模块：** 首页和分享页均提供免费小样领取功能，每次仅可领取 1 个，直接进入结算页 0 元下单。
7. **分享页功能升级：** 新增推荐商品分享（直接分享 / 加入集合页）+ 商品集合页创建与管理功能。
8. **佣金模型简化：** 移除线上提现和积分兑换功能，仅保留已确认佣金总额累计 + 月度账单明细。
9. **订单状态细化：** 佣金订单区分三种状态 — 已确认 (Confirmed)、待确认 (Pending)、已取消/售后 (Cancelled/Refunded)。
10. **移除海报生成功能：** 不再提供一键海报生成器，分享方式聚焦于短链 + 折扣码 + 社交平台直达分享。
