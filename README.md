# Enterprise Knowledge Base

企业知识库系统 Monorepo。当前仓库先建立工作区骨架，应用与共享包将在后续功能分支中逐步初始化。

## 工作区

- `apps/web`：Web 前端应用
- `apps/server`：后端 API 应用
- `packages/tokens`：设计 Token
- `packages/types`：前后端共享类型
- `packages/ui`：共享 UI 组件
- `packages/utils`：通用工具
- `packages/config`：共享工程配置

## 环境要求

- Node.js `>=22.13.0`（本地建议版本见 `.node-version`）
- pnpm `12.10.1`

在仓库根目录使用 pnpm 管理依赖和运行 workspace 命令。

## 本地数据库与缓存

复制环境变量示例并启动 PostgreSQL 和 Redis：

```bash
cp .env.example .env
docker compose up -d postgres redis
```

如果本地已有 `.env` 文件，将 `.env.example` 中新增的 `REDIS_*` 配置补充到 `.env` 后再启动服务。

可用 `docker compose ps` 查看服务状态，用 `docker compose down` 停止服务。PostgreSQL 和 Redis 数据分别保存在 Docker 命名卷中，停止服务时会保留。

PostgreSQL 默认连接地址为 `localhost:5432`，数据库名和账号密码见本地 `.env` 文件。Redis 默认连接地址为 `localhost:6379`，使用 `.env` 中的密码认证。示例凭据仅供本地开发使用。

服务启动时会校验环境变量：`DATABASE_URL` 必须是 PostgreSQL 连接地址，`REDIS_URL` 必须是 Redis 连接地址，`PORT` 必须是 1 到 65535 的整数，未设置时默认使用 `3000`。已有 `.env` 文件需要补充新增的 Redis 配置；校验失败时服务会在启动阶段报错。

### 服务健康检查

服务启动后可请求 `GET http://localhost:3000/health` 检查服务、数据库和 Redis 连接。依赖可用时返回 HTTP `200` 和 `{"status":"ok","database":"ok","redis":"ok"}`；数据库或 Redis 不可用时返回 HTTP `503`，错误体遵循下方统一错误响应格式。

### 服务端成功响应

正常业务接口的成功响应统一包装为 `code`、`message`、`data` 和 ISO 8601 格式的 `timestamp`：

```json
{
    "code": 20000,
    "message": "success",
    "data": {},
    "timestamp": "2026-11-04T12:00:00.000Z"
}
```

健康检查使用 `@BypassTransform()` 保留简洁响应格式。后续文件流接口也可使用此装饰器跳过 JSON 包装。

### 服务端错误响应

错误响应保留标准 HTTP 状态码，并使用相同的字段结构。服务端错误的详细信息只写入服务日志，不会返回给调用方：

```json
{
    "code": 50000,
    "message": "服务器内部错误",
    "data": null,
    "timestamp": "2026-11-04T12:00:00.000Z"
}
```

### 数据库迁移

修改 `apps/server/prisma/schema.prisma` 后，在本地创建并应用迁移：

```bash
pnpm --filter @kb/server db:migrate:dev --name add_document_table
```

迁移文件保存在 `apps/server/prisma/migrations/`，需要和代码一起提交。CI 和部署环境使用 `db:migrate:deploy` 应用已提交的迁移；`db:migrate:status` 可查看数据库迁移状态。不要在生产环境使用开发迁移命令。

## 工程命令

- `pnpm dev`：并行启动所有工作区中已配置的开发服务。
- `pnpm typecheck`：运行所有工作区中已配置的类型检查。
- `pnpm test`：运行所有工作区中已配置的测试。
- `pnpm build`：构建所有工作区中已配置的应用和共享包。
- `pnpm lint`：检查当前已配置的 JavaScript 规则。
- `pnpm format`：格式化应用、共享包和根级配置文件。
- `pnpm format:check`：检查上述文件的格式。
