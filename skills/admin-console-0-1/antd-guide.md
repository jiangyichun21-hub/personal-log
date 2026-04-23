# Ant Design 使用指南

本文件规定了项目中 Ant Design 组件的使用规范。所有生成的 UI 代码必须遵守。

> **版本要求：Ant Design 5.x（`antd@^5`）**
> 如果同时使用 ProComponents，版本要求 `@ant-design/pro-components@^2`

---

## 1. 全局配置

### ConfigProvider

**规范主题名：`ant-design-pro-light`**（Ant Design Pro 风格浅色后台：清爽蓝色 + 低饱和中性色）。完整色板以本节 JSON 为准；实现时通过 `ConfigProvider` 将 JSON 映射到 antd 5 的 `theme.token` 与 `theme.components`，不要在页面里硬编码与 JSON 不一致的色值。

#### 主题 JSON（唯一来源）

```json
{
  "themeName": "ant-design-pro-light",
  "mode": "light",
  "description": "基于 Ant Design Pro 风格的浅色后台主题，主打清爽蓝色与低饱和中性色。",
  "colors": {
    "primary": {
      "base": "#1677FF",
      "hover": "#4096FF",
      "active": "#0958D9",
      "disabled": "#91Caff",
      "textOnPrimary": "#FFFFFF"
    },
    "success": {
      "base": "#52C41A",
      "hover": "#73D13D",
      "active": "#389E0D"
    },
    "warning": {
      "base": "#FAAD14",
      "hover": "#FFC53D",
      "active": "#D48806"
    },
    "error": {
      "base": "#FF4D4F",
      "hover": "#FF7875",
      "active": "#D9363E"
    },
    "info": {
      "base": "#1677FF",
      "hover": "#4096FF",
      "active": "#0958D9"
    },
    "secondary": {
      "purple": "#B37FEB",
      "cyan": "#13C2C2",
      "green": "#95DE64",
      "orange": "#FFA940"
    }
  },
  "background": {
    "page": "#F5F7FA",
    "layout": "#F0F2F5",
    "container": "#FFFFFF",
    "sidebar": "#FFFFFF",
    "card": "#FFFFFF",
    "elevated": "#FFFFFF",
    "spotlight": "#E6F4FF"
  },
  "text": {
    "primary": "#262626",
    "secondary": "#595959",
    "tertiary": "#8C8C8C",
    "quaternary": "#BFBFBF",
    "disabled": "#BFBFBF",
    "inverse": "#FFFFFF",
    "link": "#1677FF"
  },
  "border": {
    "base": "#F0F0F0",
    "secondary": "#E5E6EB",
    "strong": "#D9D9D9",
    "focus": "#91CAFF"
  },
  "icon": {
    "primary": "#595959",
    "secondary": "#8C8C8C",
    "active": "#1677FF",
    "inverse": "#FFFFFF"
  },
  "state": {
    "hoverBg": "#F5F5F5",
    "activeBg": "#E6F4FF",
    "selectedBg": "#E6F4FF",
    "disabledBg": "#F5F5F5"
  },
  "menu": {
    "itemText": "#595959",
    "itemHoverText": "#1677FF",
    "itemSelectedText": "#1677FF",
    "itemHoverBg": "#F5F7FA",
    "itemSelectedBg": "#E6F4FF",
    "groupTitle": "#8C8C8C"
  },
  "card": {
    "bg": "#FFFFFF",
    "border": "#F0F0F0",
    "shadow": "0 1px 2px rgba(0, 0, 0, 0.04)",
    "radius": "8px"
  },
  "chart": {
    "palette": [
      "#1677FF",
      "#69B1FF",
      "#95DE64",
      "#5CDBD3",
      "#B37FEB",
      "#FFA940",
      "#FF7875",
      "#D3ADF7"
    ],
    "axis": "#BFBFBF",
    "grid": "#F0F0F0",
    "tooltipBg": "#FFFFFF",
    "tooltipBorder": "#E5E6EB"
  },
  "components": {
    "button": {
      "primaryBg": "#1677FF",
      "primaryHoverBg": "#4096FF",
      "primaryActiveBg": "#0958D9",
      "defaultBg": "#FFFFFF",
      "defaultBorder": "#D9D9D9",
      "defaultText": "#262626"
    },
    "input": {
      "bg": "#FFFFFF",
      "border": "#D9D9D9",
      "hoverBorder": "#4096FF",
      "focusBorder": "#1677FF",
      "placeholder": "#BFBFBF"
    },
    "table": {
      "headerBg": "#FAFAFA",
      "rowHoverBg": "#F5F7FA",
      "border": "#F0F0F0"
    },
    "tag": {
      "blueBg": "#E6F4FF",
      "blueText": "#1677FF",
      "greenBg": "#F6FFED",
      "greenText": "#52C41A",
      "redBg": "#FFF1F0",
      "redText": "#FF4D4F",
      "orangeBg": "#FFF7E6",
      "orangeText": "#FA8C16"
    }
  }
}
```

#### 入口映射示例（与上表一致）

生成代码时按此结构配置；色值须与 JSON 一致。图表类组件使用 `chart.palette`、`chart.axis`、`chart.grid` 等，勿自造一套配色。

```tsx
import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const AppRoot = () => (
  <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677FF',
        colorPrimaryHover: '#4096FF',
        colorPrimaryActive: '#0958D9',
        colorSuccess: '#52C41A',
        colorWarning: '#FAAD14',
        colorError: '#FF4D4F',
        colorInfo: '#1677FF',
        colorLink: '#1677FF',
        colorLinkHover: '#4096FF',
        colorText: '#262626',
        colorTextSecondary: '#595959',
        colorTextTertiary: '#8C8C8C',
        colorTextQuaternary: '#BFBFBF',
        colorBgLayout: '#F0F2F5',
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#FFFFFF',
        colorBorder: '#D9D9D9',
        colorBorderSecondary: '#F0F0F0',
        borderRadius: 8,
        boxShadowSecondary: '0 1px 2px rgba(0, 0, 0, 0.04)',
        controlItemBgHover: '#F5F5F5',
        controlItemBgActive: '#E6F4FF',
        colorBgTextHover: '#F5F7FA',
        colorBgTextActive: '#E6F4FF',
      },
      components: {
        Menu: {
          itemColor: '#595959',
          itemHoverColor: '#1677FF',
          itemSelectedColor: '#1677FF',
          itemHoverBg: '#F5F7FA',
          itemSelectedBg: '#E6F4FF',
          groupTitleColor: '#8C8C8C',
        },
        Table: {
          headerBg: '#FAFAFA',
          rowHoverBg: '#F5F7FA',
          borderColor: '#F0F0F0',
        },
        Card: {
          borderRadiusLG: 8,
        },
        Button: {
          defaultBorderColor: '#D9D9D9',
          defaultColor: '#262626',
          defaultBg: '#FFFFFF',
        },
        Input: {
          hoverBorderColor: '#4096FF',
          activeBorderColor: '#1677FF',
        },
      },
    }}
  >
    <App>
      <RouterProvider />
    </App>
  </ConfigProvider>
);
```

**默认明亮主题原则：**
- 后台页面默认应呈现 **明亮、轻盈、专业** 的视觉风格，避免沉闷、厚重、压暗的默认观感
- 优先通过 `ConfigProvider.theme` 统一定义主题，不要在各页面零散覆盖颜色；**语义色以 JSON 为准**
- 主色、成功色、警告色、错误色与 JSON 中 `colors.*.base` 对齐；hover/active 与 JSON 中对应字段对齐
- `colorBgLayout` 使用 JSON `background.layout`，内容区白底使用 `background.container`，确保层次清楚
- 卡片、表格、统计区块优先使用 JSON 中 `card` / `table` / `state` 与轻阴影，不依赖厚重深色块
- 侧边栏默认浅色（`background.sidebar`）；若改为深色布局，须单独评审，且不得与 JSON 浅色规范混用同一套 token 造成割裂
- `Tag` 状态色优先使用 JSON `components.tag` 与 antd 预设色板组合，避免随意取色

### CSS-in-JS（v5 变更）

- v5 移除了 `antd/dist/antd.css`，样式随组件自动按需加载，**不需要手动引入 CSS**
- 不要写 `import 'antd/dist/antd.css'` 或 `import 'antd/dist/reset.css'`（v5.0 早期才需要 reset，5.1+ 不需要）

---

## 2. 高频组件规范

### 2.1 Table

```tsx
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<Product> = [
  { title: '商品名称', dataIndex: 'name', key: 'name' },
  { title: '价格', dataIndex: 'price', key: 'price', render: (v) => `¥${v}` },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => onEdit(record)}>编辑</Button>
        <Popconfirm title="确认删除？" onConfirm={() => onDelete(record.id)}>
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      </Space>
    ),
  },
];

<Table
  rowKey="id"
  columns={columns}
  dataSource={data}
  loading={loading}
  pagination={{
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
  onChange={(pagination) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  }}
/>
```

**规则：**
- `rowKey` 必须指定，不要依赖默认的 index
- `columns` 单独定义为常量或提取到 `columns.tsx` 配置文件，不要内联在 JSX 中
- 操作列按钮超过 3 个时，使用 `Dropdown` + `items` 属性
- 分页固定使用 `showSizeChanger` + `showTotal`

### 2.2 Form

```tsx
import { Form, Input, Select, Button } from 'antd';

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (values: Product) => Promise<void>;
  loading?: boolean;
}

export const ProductForm = ({ initialValues, onSubmit, loading }: ProductFormProps) => {
  const [form] = Form.useForm<Product>();

  const handleFinish = async (values: Product) => {
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
        <Select options={STATUS_OPTIONS} placeholder="请选择" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
```

**规则：**
- 使用 `Form.useForm()` 获取 form 实例，不使用 `ref`
- 表单状态由 antd Form 内部管理，**不要额外 useState 同步表单值**
- 使用 `onFinish` 处理提交（自动通过校验后才触发），不要用 `onSubmit` + `form.validateFields()`
- 新增/编辑共用同一个 Form 组件，通过 `initialValues` 区分
- 编辑模式加载数据后，使用 `form.setFieldsValue(data)` 填充
- `layout` 统一使用 `"vertical"`，除非明确需要水平布局

### 2.3 Select

```tsx
// 推荐：使用 options 属性
<Select
  options={[
    { label: '上架', value: 'active' },
    { label: '下架', value: 'inactive' },
  ]}
  placeholder="请选择"
  allowClear
/>

// 远程搜索
<Select
  showSearch
  options={options}
  filterOption={false}
  onSearch={handleSearch}
  loading={searching}
  placeholder="搜索并选择"
/>
```

**规则：**
- **必须使用 `options` 属性**传递选项，不要用 `<Select.Option>` 子元素写法（v5 推荐方式）
- 需要自定义 label/value 字段名时用 `fieldNames` 属性
- 远程搜索场景设置 `filterOption={false}` 由服务端过滤

### 2.4 Modal / Drawer

```tsx
// 状态管理在父组件
const [open, setOpen] = useState(false);
const [editingItem, setEditingItem] = useState<Product | null>(null);

const handleEdit = (record: Product) => {
  setEditingItem(record);
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setEditingItem(null);
};

<Modal
  title={editingItem ? '编辑商品' : '新增商品'}
  open={open}
  onCancel={handleClose}
  footer={null}
  destroyOnClose
>
  <ProductForm
    initialValues={editingItem ?? undefined}
    onSubmit={async (values) => {
      await save(values);
      handleClose();
      refresh();
    }}
  />
</Modal>
```

**规则：**
- 使用 `open` 属性，不要用已废弃的 `visible`（v5 重命名）
- Modal 内嵌表单时，`footer={null}` 让 Form 自带提交按钮
- 设置 `destroyOnClose` 确保关闭后清理表单状态
- 弹窗状态（open/editingItem）管理在**父组件**，不在弹窗内部

### 2.5 message / notification

```tsx
import { App } from 'antd';

// 在组件内通过 App.useApp() 获取实例
const { message, notification } = App.useApp();

const handleDelete = async (id: string) => {
  await deleteProduct(id);
  message.success('删除成功');
};
```

**规则：**
- v5 中**必须使用 `App.useApp()` 获取 message/notification**，不要直接 `import { message } from 'antd'` 静态调用（v5 中静态方法无法获取 context 和主题）
- App 入口需要用 `<App>` 组件包裹（在 ConfigProvider 内部）：
  ```tsx
  <ConfigProvider locale={zhCN}>
    <App>
      <RouterProvider />
    </App>
  </ConfigProvider>
  ```

### 2.6 Upload

```tsx
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const uploadProps: UploadProps = {
  beforeUpload: (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片');
    }
    return isImage || Upload.LIST_IGNORE;
  },
  customRequest: async ({ file, onSuccess, onError }) => {
    try {
      const url = await uploadFile(file as File);
      onSuccess?.({ url });
    } catch (err) {
      onError?.(err as Error);
    }
  },
  maxCount: 1,
};

<Upload {...uploadProps}>
  <Button icon={<UploadOutlined />}>上传文件</Button>
</Upload>
```

**规则：**
- 使用 `customRequest` 对接自定义上传逻辑，不要用 `action` URL 直传
- 使用 `beforeUpload` 做文件类型和大小校验
- `beforeUpload` 返回 `Upload.LIST_IGNORE` 可以阻止不合格文件出现在列表中

### 2.7 DatePicker

```tsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

// 单个日期
<DatePicker format="YYYY-MM-DD" />

// 日期范围
<DatePicker.RangePicker format="YYYY-MM-DD" />
```

**规则：**
- v5 使用 `dayjs`，**不要使用 moment.js**（v4→v5 核心变更）
- 不要安装 moment，项目中只用 dayjs

---

## 3. 布局组件

### Layout

```tsx
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

// 菜单使用 items 属性
const menuItems: MenuProps['items'] = [
  { key: 'products', icon: <ShopOutlined />, label: '商品管理' },
  { key: 'orders', icon: <OrderedListOutlined />, label: '订单管理' },
];

<Layout style={{ minHeight: '100vh' }}>
  <Sider collapsible>
    <Menu items={menuItems} mode="inline" onClick={({ key }) => navigate(`/${key}/list`)} />
  </Sider>
  <Layout>
    <Header />
    <Content style={{ margin: 16, padding: 24, background: '#fff' }}>
      <Outlet />
    </Content>
  </Layout>
</Layout>
```

**规则：**
- **Menu 必须使用 `items` 属性**，不要用 `<Menu.Item>` / `<Menu.SubMenu>` 子元素写法（v5 推荐且 v4.20+ 已引入）
- Sider 使用 `collapsible` 支持折叠

---

## 4. v4 → v5 禁止写法速查

| 场景 | 禁止（v4 写法） | 必须（v5 写法） |
|------|-----------------|-----------------|
| Modal/Drawer 显隐 | `visible={open}` | `open={open}` |
| Select 选项 | `<Select.Option value="a">A</Select.Option>` | `<Select options={[{label:'A',value:'a'}]} />` |
| Menu 菜单项 | `<Menu.Item key="a">A</Menu.Item>` | `<Menu items={[{key:'a',label:'A'}]} />` |
| DatePicker 日期库 | `moment()` | `dayjs()` |
| message 调用 | `import { message } from 'antd'; message.success()` | `const { message } = App.useApp()` |
| CSS 引入 | `import 'antd/dist/antd.css'` | 无需引入，自动按需加载 |
| Icon 导入 | `import { SmileOutlined } from '@ant-design/icons'`（这个没变，但确认只用 `@ant-design/icons`） | 同左 |
| Dropdown 菜单 | `<Dropdown overlay={menu}>` | `<Dropdown menu={{ items }}>` |

---

## 5. ProComponents 使用指南

仅在 Plan 阶段判定需要时引入（实体 > 3 个、有 Dashboard、复杂表单）。

### 安装

```bash
anpm install @ant-design/pro-components
```

### 常用组件

| 组件 | 用途 | 替代的手动实现 |
|------|------|--------------|
| `ProTable` | 高级表格（内置筛选、分页、工具栏） | Table + Filter + Pagination 手动组合 |
| `ProForm` / `StepsForm` | 高级表单（分步表单、弹窗表单） | Form + Steps 手动组合 |
| `ProDescriptions` | 详情展示 | Descriptions 手动配置 |
| `StatisticCard` | Dashboard 指标卡片 | Card + Statistic 手动组合 |

### ProTable 基本用法

```tsx
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

const columns: ProColumns<Product>[] = [
  { title: '商品名称', dataIndex: 'name', valueType: 'text' },
  { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', hideInSearch: true },
  { title: '状态', dataIndex: 'status', valueEnum: STATUS_ENUM },
];

<ProTable<Product>
  columns={columns}
  request={async (params) => {
    const { data, total } = await getProductList(params);
    return { data, total, success: true };
  }}
  rowKey="id"
  search={{ labelWidth: 'auto' }}
  toolBarRender={() => [
    <Button key="add" type="primary" onClick={() => navigate('/products/create')}>
      新增
    </Button>,
  ]}
/>
```

**规则：**
- `request` 返回格式必须是 `{ data, total, success }`
- 筛选项通过 columns 的 `hideInSearch` / `hideInTable` 控制显隐
- 使用 `valueType` 和 `valueEnum` 让 ProTable 自动渲染和生成筛选控件
