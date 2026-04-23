# 中后台项目工程规范

本文件定义了中后台项目的代码规范，所有生成和修改的代码必须严格遵守。

---

## 1. 文件规模控制

### 硬性限制
- **单文件不超过 200 行**（不含空行和 import）
- 超过 150 行时应主动考虑拆分
- 组件文件（.tsx）不超过 150 行

### 拆分策略
- 一个组件文件只包含一个导出组件
- 复杂逻辑提取为自定义 Hook
- 工具函数提取到 utils
- 类型定义独立为 types.ts
- 常量定义独立为 constants.ts
- 表格列配置、表单字段配置提取为独立的 config 文件

---

## 2. 目录结构

### 页面级模块化

每个业务实体对应一个模块目录，内部按职责分层：

```
src/pages/
├── dashboard/                  # Dashboard 页面
│   ├── index.tsx              # 页面入口（路由组件）
│   ├── components/            # 页面级组件
│   │   ├── StatCards.tsx
│   │   └── TrendChart.tsx
│   ├── hooks/                 # 页面级 Hooks
│   │   └── useDashboardData.ts
│   └── services/              # 页面级数据请求
│       └── dashboardService.ts
│
├── products/                   # 商品管理模块
│   ├── list/                  # 列表页
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductActions.tsx
│   │   └── hooks/
│   │       └── useProductList.ts
│   ├── form/                  # 新增/编辑页
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── BasicInfoSection.tsx
│   │   │   └── PriceSection.tsx
│   │   └── hooks/
│   │       └── useProductForm.ts
│   ├── detail/                # 详情页
│   │   └── index.tsx
│   ├── services/              # 模块级数据请求（共享）
│   │   └── productService.ts
│   ├── types.ts               # 模块级类型定义
│   └── constants.ts           # 模块级常量
│
└── layout/                    # 布局
    ├── index.tsx              # 主布局组件
    ├── components/
    │   ├── Sidebar.tsx
    │   └── Header.tsx
    └── menuConfig.ts          # 菜单配置
```

### 公共目录

```
src/
├── components/                # 全局公共组件（跨模块复用）
│   └── PageContainer.tsx      # 页面容器（面包屑 + 标题 + 内容区）
├── hooks/                     # 全局公共 Hooks
│   └── useRequest.ts          # 请求 Hook（loading/error 封装）
├── services/                  # 全局服务层
│   └── request.ts             # 请求基础封装
├── types/                     # 全局类型定义
│   └── common.ts              # 通用类型（分页、响应格式等）
├── utils/                     # 全局工具函数
│   └── format.ts              # 格式化工具
└── constants/                 # 全局常量
    └── index.ts
```

### 目录规则
- 组件目录下的文件按功能命名，不用 index.tsx（除页面入口外）
- 只被一个页面使用的组件放在页面级 `components/` 下
- 被 2 个以上页面使用的组件提升到 `src/components/`
- 同理适用于 hooks、utils、types

---

## 3. 命名规范

### 文件命名
- 组件文件：PascalCase（`ProductTable.tsx`）
- Hook 文件：camelCase，use 前缀（`useProductList.ts`）
- Service 文件：camelCase，Service 后缀（`productService.ts`）
- 类型文件：camelCase（`types.ts`）
- 常量文件：camelCase（`constants.ts`）
- 工具文件：camelCase（`format.ts`）
- 配置文件：camelCase，Config 后缀（`menuConfig.ts`、`tableColumns.ts`）

### 代码命名
- 组件：PascalCase（`ProductTable`）
- Hook：camelCase，use 前缀（`useProductList`）
- 函数：camelCase，动词开头（`fetchProducts`、`formatPrice`）
- 常量：UPPER_SNAKE_CASE（`PAGE_SIZE`、`STATUS_MAP`）
- 类型/接口：PascalCase（`Product`、`ProductListParams`）
- 枚举值：UPPER_SNAKE_CASE
- 布尔变量：is/has/should 前缀（`isLoading`、`hasPermission`）

### 导出规范
- 组件使用命名导出（`export const ProductTable = ...`），不用 default export
- 文件名与主导出名一致
- 一个文件只有一个主导出（可以有辅助导出如类型）

---

## 4. 组件设计

### 单一职责
- 每个组件只做一件事
- 组件名能准确描述它的职责
- 如果需要用 "and" 来描述组件功能，说明该拆分了

### 容器/展示分离
- **容器组件**（页面入口 index.tsx）：负责数据获取、状态管理、组装子组件
- **展示组件**（components/ 下）：负责 UI 渲染，通过 props 接收数据
- 展示组件不直接调用 service 或操作全局状态

### Props 设计
- Props 类型必须显式定义（interface 或 type）
- Props 接口命名：`{组件名}Props`
- 避免超过 6 个 props，超过时考虑用对象参数或拆分组件
- 回调函数 props 用 on 前缀（`onSubmit`、`onDelete`）

### 组件拆分信号
出现以下情况时必须拆分：
- 组件超过 150 行
- 组件有 3 个以上独立的 UI 区块
- 组件内有复杂的条件渲染逻辑（>2 层 if/ternary）
- 表格列配置超过 50 行

---

## 5. 自定义 Hook 设计

### 何时提取 Hook
- 组件内有超过 10 行的状态 + 副作用逻辑
- 相同的数据获取/处理逻辑在多处使用
- 组件内有复杂的表单处理逻辑

### Hook 规范
- 一个 Hook 文件一个 Hook
- 返回值使用对象解构（不用数组），便于按需取值
- 包含 loading 和 error 状态
- 清理副作用（useEffect 的 cleanup）

### 典型 Hook 模式

```typescript
// useProductList.ts
export const useProductList = (params: ProductListParams) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getList(params);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return { data, loading, total, refresh: fetchList };
};
```

---

## 6. 数据请求层（Service）

### 分层结构

```
请求基础封装（src/services/request.ts）
    ↓
模块 Service（pages/xxx/services/xxxService.ts）
    ↓
Hook 调用（pages/xxx/hooks/useXxxList.ts）
    ↓
组件使用
```

### Service 规范
- 一个模块一个 service 文件
- 每个函数对应一个 API 操作
- 函数命名：`动词 + 实体`（`getProductList`、`createProduct`、`deleteProduct`）
- 参数和返回值都有类型定义
- 不在 service 中处理 UI 逻辑（如 message 提示）

### Mock 数据规范
- Mock 数据与真实 service 使用相同的函数签名
- Mock 数据放在 service 文件内部，通过标志位切换
- 数据结构要贴近真实场景（合理的字段值、分页、ID 格式）

```typescript
// productService.ts
const USE_MOCK = true;

const mockProducts: Product[] = [
  { id: '1', name: '商品A', price: 99.9, status: 'active' },
  // ...
];

export const getProductList = async (
  params: ProductListParams
): Promise<{ data: Product[]; total: number }> => {
  if (USE_MOCK) {
    const filtered = mockProducts.filter(/* 按 params 筛选 */);
    return { data: filtered, total: filtered.length };
  }
  // 真实请求
  return request.get('/api/products', { params });
};
```

---

## 7. 状态管理

### 层级选择
1. **组件局部 state**（useState）— 只影响当前组件的状态，优先使用
2. **Hook 内聚合 state** — 通过自定义 Hook 管理一组相关状态
3. **页面级 Context** — 同一页面内多组件共享的状态
4. **全局 Store** — 跨页面共享的状态（如用户信息、权限、主题）

### 规则
- 能用局部 state 解决的不要上 Context/Store
- 不要把服务端数据缓存到全局 Store（用 Hook 管理请求状态）
- 表单状态用 Ant Design Form 自带的状态管理，不要额外 useState

---

## 8. 中后台页面模式

### 列表页标准结构

```
┌─────────────────────────────────┐
│ 页面标题              [新增按钮] │
├─────────────────────────────────┤
│ 筛选区域（收起/展开）             │
├─────────────────────────────────┤
│ 表格                            │
│  ┌──┬────┬────┬────┬─────┐     │
│  │  │列1 │列2 │列3 │操作  │     │
│  ├──┼────┼────┼────┼─────┤     │
│  │  │    │    │    │编辑  │     │
│  │  │    │    │    │删除  │     │
│  └──┴────┴────┴────┴─────┘     │
│ 分页器                          │
└─────────────────────────────────┘
```

- 筛选区域和表格分离为独立组件
- 表格列配置提取为 `columns.tsx` 或 `tableConfig.ts`
- 操作列的按钮超过 3 个时使用 Dropdown
- 删除操作需要二次确认（Popconfirm）

#### 列表页代码模板

**页面入口 `list/index.tsx`：**

```tsx
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/PageContainer';
import { XxxTable } from './components/XxxTable';
import { XxxFilter } from './components/XxxFilter';
import { useXxxList } from './hooks/useXxxList';
import type { XxxListParams } from '../types';

export const XxxListPage = () => {
  const navigate = useNavigate();
  const { data, loading, total, params, setParams, refresh } = useXxxList();

  return (
    <PageContainer
      title="Xxx管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/xxx/create')}>
          新增
        </Button>
      }
    >
      <XxxFilter params={params} onChange={setParams} />
      <XxxTable
        data={data}
        loading={loading}
        total={total}
        params={params}
        onChange={setParams}
        onEdit={(record) => navigate(`/xxx/edit/${record.id}`)}
        onDelete={async (id) => { await deleteXxx(id); refresh(); }}
      />
    </PageContainer>
  );
};
```

**数据 Hook `list/hooks/useXxxList.ts`：**

```tsx
import { useState, useCallback, useEffect } from 'react';

import { getXxxList } from '../../services/xxxService';
import type { Xxx, XxxListParams } from '../../types';

export const useXxxList = () => {
  const [data, setData] = useState<Xxx[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<XxxListParams>({ page: 1, pageSize: 10 });

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getXxxList(params);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return { data, loading, total, params, setParams, refresh: fetchList };
};
```

### 表单页标准结构

```
┌─────────────────────────────────┐
│ 页面标题                        │
├─────────────────────────────────┤
│ 表单区域                        │
│  ┌─ 基本信息 ──────────────┐    │
│  │ 字段1: [______]         │    │
│  │ 字段2: [______]         │    │
│  └─────────────────────────┘    │
│  ┌─ 其他信息 ──────────────┐    │
│  │ 字段3: [______]         │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│              [取消]  [提交]      │
└─────────────────────────────────┘
```

- 表单字段超过 6 个时按业务含义分组（Card 或 Divider）
- 每个分组拆为独立组件
- 新增和编辑共用同一个表单组件，通过 `mode` 或 `initialValues` 区分
- 表单验证规则定义在字段配置中，不散落在组件内

#### 表单页代码模板

**页面入口 `form/index.tsx`：**

```tsx
import { useParams, useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/PageContainer';
import { XxxForm } from './components/XxxForm';
import { useXxxForm } from './hooks/useXxxForm';

export const XxxFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { initialValues, loading, submitting, handleSubmit } = useXxxForm(id);

  if (isEdit && loading) return <PageContainer title="加载中..." />;

  return (
    <PageContainer title={isEdit ? '编辑Xxx' : '新增Xxx'}>
      <XxxForm
        initialValues={initialValues}
        loading={submitting}
        onSubmit={async (values) => {
          await handleSubmit(values);
          navigate('/xxx/list');
        }}
        onCancel={() => navigate('/xxx/list')}
      />
    </PageContainer>
  );
};
```

**表单组件 `form/components/XxxForm.tsx`：**

```tsx
import { Form, Input, Select, Button, Space, Card } from 'antd';

import type { Xxx } from '../../types';

interface XxxFormProps {
  initialValues?: Partial<Xxx>;
  onSubmit: (values: Xxx) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const XxxForm = ({ initialValues, onSubmit, onCancel, loading }: XxxFormProps) => {
  const [form] = Form.useForm<Xxx>();

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
      <Card title="基本信息">
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        {/* 更多字段... */}
      </Card>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
        </Space>
      </div>
    </Form>
  );
};
```

**数据 Hook `form/hooks/useXxxForm.ts`：**

```tsx
import { useState, useEffect } from 'react';
import { App } from 'antd';

import { getXxxDetail, createXxx, updateXxx } from '../../services/xxxService';
import type { Xxx } from '../../types';

export const useXxxForm = (id?: string) => {
  const { message } = App.useApp();
  const [initialValues, setInitialValues] = useState<Partial<Xxx>>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getXxxDetail(id).then(setInitialValues).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: Xxx) => {
    setSubmitting(true);
    try {
      if (id) {
        await updateXxx(id, values);
        message.success('编辑成功');
      } else {
        await createXxx(values);
        message.success('新增成功');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return { initialValues, loading, submitting, handleSubmit };
};
```

### Dashboard 标准结构

```
┌──────────┬──────────┬──────────┐
│ 指标卡片1 │ 指标卡片2 │ 指标卡片3 │
├──────────┴────┬─────┴──────────┤
│ 趋势图表      │  分布图表       │
├───────────────┴────────────────┤
│ 数据表格/排行榜                  │
└────────────────────────────────┘
```

- 每个图表/卡片是独立组件
- 数据获取在 Hook 中完成
- 使用 Ant Design 的 Row/Col 布局

#### Dashboard 代码模板

**页面入口 `dashboard/index.tsx`：**

```tsx
import { Row, Col } from 'antd';

import { PageContainer } from '@/components/PageContainer';
import { StatCards } from './components/StatCards';
import { TrendChart } from './components/TrendChart';
import { useDashboardData } from './hooks/useDashboardData';

export const DashboardPage = () => {
  const { stats, trend, loading } = useDashboardData();

  return (
    <PageContainer title="数据概览">
      <StatCards data={stats} loading={loading} />
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={14}>
          <TrendChart data={trend} loading={loading} />
        </Col>
        <Col span={10}>
          {/* 分布图表等 */}
        </Col>
      </Row>
    </PageContainer>
  );
};
```

**指标卡片 `dashboard/components/StatCards.tsx`：**

```tsx
import { Row, Col, Card, Statistic } from 'antd';

interface StatCardsProps {
  data: { title: string; value: number; suffix?: string }[];
  loading: boolean;
}

export const StatCards = ({ data, loading }: StatCardsProps) => (
  <Row gutter={16}>
    {data.map((item) => (
      <Col span={24 / data.length} key={item.title}>
        <Card>
          <Statistic title={item.title} value={item.value} suffix={item.suffix} loading={loading} />
        </Card>
      </Col>
    ))}
  </Row>
);
```

---

## 9. 错误处理

### 请求错误
- 统一在请求封装层处理网络错误（全局 message 提示）
- 业务错误（如权限不足、数据不存在）在调用处处理
- 列表页请求失败显示空状态，不阻塞页面
- 表单提交失败保留用户输入，显示错误信息

### 组件错误
- 页面级组件使用 Error Boundary 包裹
- 错误边界显示友好提示 + 重试按钮

### Loading 状态
- 列表页使用表格内置 loading
- 表单提交使用按钮 loading
- 页面初始化使用 Spin 居中显示

---

## 10. Import 规范

### 顺序（分组之间空一行）

```typescript
// 1. React
import { useState, useCallback } from 'react';

// 2. 第三方库
import { Table, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

// 3. 项目公共模块
import { PageContainer } from '@/components/PageContainer';
import { useRequest } from '@/hooks/useRequest';

// 4. 当前模块
import { ProductTable } from './components/ProductTable';
import { useProductList } from './hooks/useProductList';
import { Product } from './types';
```

### 规则
- 不使用通配符导入（`import * as`）
- 类型导入使用 `import type`
- 不导入未使用的模块

---

## 11. 平台约束（OneDay 特定）

- 使用 `anpm install` 安装依赖，不用 npm/yarn/pnpm
- 使用 Hash 路由（`HashRouter`），所有页面必须有唯一 hash 路由
- 使用 webpack，不用 esbuild/vite
- 不使用 scss/sass
- 不使用需要原生二进制文件的 npm 包
- 2 空格缩进
- 不使用 emoji 作为图标（用 FontAwesome 或 Ant Design Icon）
- 不使用 base64 编码的资源文件
- 优先使用 tailwindcss/unocss 写样式（如果项目已配置）
- 不添加注释，除非用户明确要求
