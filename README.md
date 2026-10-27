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

## 工程命令

- `pnpm dev`：并行启动所有工作区中已配置的开发服务。
- `pnpm typecheck`：运行所有工作区中已配置的类型检查。
- `pnpm test`：运行所有工作区中已配置的测试。
- `pnpm build`：构建所有工作区中已配置的应用和共享包。
- `pnpm lint`：检查当前已配置的 JavaScript 规则。
- `pnpm format`：格式化应用、共享包和根级配置文件。
- `pnpm format:check`：检查上述文件的格式。
