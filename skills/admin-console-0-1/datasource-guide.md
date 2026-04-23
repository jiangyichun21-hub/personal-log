# 数据源对接指南

本文件说明如何识别用户的数据来源，并使用正确的内置工具完成对接。

---

## 1. 数据源识别

根据用户描述判断数据来源类型：

| 用户描述关键词 | 数据源类型 | 对接工具 |
|-------------|-----------|---------|
| "已有 HSF 接口""调用 HSF 服务" | HSF | `HSFImport` |
| "已有 HTTP 接口""有 API""有 OpenAPI 文档" | HTTP/API | `HTTPImport` |
| "有 ODPS 表""MaxCompute 数据""数据仓库的数据" | ODPS | `ODPSImport` → `ODPSResource` → `ODPSCodePlan` |
| "需要建数据库""需要存数据""要做增删改查" | OneDay Cloud DB | `OneDayCloudEnable` → `OneDayCloudApplyMigration` |
| 没有明确数据源 | Mock 数据 | 先生成 Mock，后续按需对接 |

---

## 2. Cloud DB 对接流程

适用场景：用户需要从零开始建数据库，自行录入和管理数据。

### 步骤

1. **启用数据库**：调用 `OneDayCloudEnable`
2. **设计建表 SQL**：根据 Spec 中的实体定义，设计包含所有字段的 DDL
3. **执行建表**：调用 `OneDayCloudApplyMigration`（必须等用户确认）
4. **读取类型**：建表后自动生成 TypeScript 类型定义，读取并使用
5. **编写 service 层**：基于 SDK 的 `supabase.from().select()` 等方法

### service 层模式

```typescript
import { supabase } from '@/services/supabase';
import type { Product } from '@/types/database';

export const getProductList = async (params: { page: number; pageSize: number }) => {
  const { data, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range((params.page - 1) * params.pageSize, params.page * params.pageSize - 1);
  return { data: data ?? [], total: count ?? 0 };
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
};
```

### 注意事项

- 文件上传使用 `supabase.storage.upload()`，必须先将 File 转为 ArrayBuffer（参见 `lessons-learned.md`）
- 分页使用 `.range(from, to)` 方法，注意是 0-indexed

---

## 3. ODPS 对接流程

适用场景：数据已存在于 ODPS/MaxCompute 数据仓库中，后台只做读取展示。

### 步骤

1. **导入表**：调用 `ODPSImport`（如表未导入过）
2. **关联到项目**：调用 `ODPSResource`
3. **生成代码计划**：调用 `ODPSCodePlan`
4. **编写 service 层**：按 `ODPSCodePlan` 返回的计划，复用 `src/api/odps.ts`

### 注意事项

- ODPS 数据源通常只用于**读取**，不做写入
- `ODPSQuery` 的 SQL 必须是只读的 SELECT 语句

---

## 4. HSF 对接流程

适用场景：数据来自已有的 HSF 服务。

### 步骤

1. **接入服务**：调用 `HSFImport`，引导用户填写服务信息
2. **获取接口信息**：工具返回接口定义（方法名、参数、返回值）
3. **编写 service 层**：基于返回的接口信息封装

### 注意事项

- 不要自己写 HSF 调用代码，必须通过内置工具完成
- service 层只做接口封装和数据转换

---

## 5. HTTP/API 对接流程

适用场景：数据来自已有的 HTTP 接口或 OpenAPI 文档。

### 步骤

1. **接入接口**：调用 `HTTPImport`，引导用户提供接口信息
2. **获取 Prompt 信息**：工具返回接口定义和使用方法
3. **编写 service 层**：基于返回的信息封装

### 注意事项

- 不要自己写 fetch/axios 请求来对接
- 如果用户提供了 OpenAPI/Swagger 文档，传给 `HTTPImport` 处理

---

## 6. Mock 数据

适用场景：用户不确定数据来源，或希望先看效果。

### 规范

- Mock 数据放在 service 文件内部，通过标志位切换
- 函数签名必须与真实 service 一致，方便后续替换
- Mock 数据要贴近真实场景（合理的字段值、ID 格式、数据量）

```typescript
const USE_MOCK = true;

const mockProducts: Product[] = [
  { id: '1', name: '智能手表 Pro', price: 1299, status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: '无线耳机 Max', price: 599, status: 'inactive', createdAt: '2024-01-10' },
];

export const getProductList = async (
  params: ProductListParams
): Promise<{ data: Product[]; total: number }> => {
  if (USE_MOCK) {
    // 模拟筛选和分页
    let filtered = [...mockProducts];
    if (params.name) {
      filtered = filtered.filter((p) => p.name.includes(params.name!));
    }
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }
    const start = (params.page - 1) * params.pageSize;
    return {
      data: filtered.slice(start, start + params.pageSize),
      total: filtered.length,
    };
  }
  return request.get('/api/products', { params });
};
```

### 后续替换

当用户确定真实数据源后：
1. 识别数据源类型
2. 使用对应的内置工具完成接入
3. 替换 service 中的 Mock 逻辑为真实调用
4. 删除 `USE_MOCK` 标志和 Mock 数据
