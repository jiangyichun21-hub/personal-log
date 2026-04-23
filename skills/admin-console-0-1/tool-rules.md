# 工具使用规则

本文件定义了中后台 Skill 中所有内置工具的使用规范和调用约束。

---

## 1. 必须使用内置工具的场景

| 场景 | 工具 | 备注 |
|------|------|------|
| 接入 HSF 服务 | `HSFImport` | 不要自己写 HSF 调用代码 |
| 接入 HTTP/API | `HTTPImport` | 不要自己写 fetch/axios |
| 导入 ODPS 表 | `ODPSImport` | 通过弹窗完成 |
| 关联 ODPS 表到项目 | `ODPSResource` | 关联后调用 ODPSCodePlan |
| 查询 ODPS 数据 | `ODPSQuery` | 仅查询，SQL 必须只读 |
| ODPS 代码接入规划 | `ODPSCodePlan` | 写代码前必须先调用 |
| 启用云数据库 | `OneDayCloudEnable` | 需要数据持久化时首先调用 |
| 建表/改表 | `OneDayCloudApplyMigration` | DDL 操作，需用户确认 |
| 查看表结构 | `OneDayCloudListTables` | 了解数据库现状 |
| 执行 SQL | `OneDayCloudExecuteSql` | DML 操作（增删改查） |
| 生成 Plan | `EnterPlanMode` / `ExitPlanMode` | 方案确认 |

---

## 2. 严禁行为

- 严禁在询问用户获取接口文档并收到「现在粘贴文档」等回复后，不等待用户粘贴内容就自行推进流程
- 严禁自行编写 HSF/HTTP/ODPS 的对接代码
- 严禁跳过内置工具直接写 fetch/axios 请求来对接已有服务
- 严禁在用户未确认 Spec 前开始生成代码
- 严禁在未调用 `ODPSCodePlan` 前编写 ODPS 相关代码
- 严禁在未调用 `OneDayCloudApplyMigration` 前编写依赖数据库表结构的代码

---

## 3. 调用顺序约束

### Cloud DB 路径

```
OneDayCloudEnable（启用数据库）
    ↓
OneDayCloudApplyMigration（建表，不能与其他工具并行，需等用户确认）
    ↓
读取生成的 TypeScript 类型定义
    ↓
编写 service 层
```

### ODPS 路径

```
ODPSImport（导入表）
    ↓
ODPSResource（关联到项目）
    ↓
ODPSCodePlan（生成代码计划）
    ↓
按计划编写 service 层（复用 src/api/odps.ts）
```

### HSF / HTTP 路径

```
HSFImport 或 HTTPImport（引导用户完成接入）
    ↓
根据返回的接口信息编写 service 层
```

### 通用约束

- `OneDayCloudEnable` 必须在分析需求后、编写计划前调用
- `OneDayCloudApplyMigration` 必须在写代码前调用，且**不能与其他工具并行**
- `ODPSCodePlan` 必须在写 ODPS 相关代码前调用
- 数据源对接工具返回的信息要**完整传递**给后续的代码生成步骤
