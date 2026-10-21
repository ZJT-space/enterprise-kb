# @kb/config

仓库内部共享工程配置包，不包含业务类型或运行时代码。

## TypeScript

- `@kb/config/tsconfig/base.json`：严格模式基础配置。
- `@kb/config/tsconfig/web.json`：Web/DOM 编译环境。
- `@kb/config/tsconfig/node.json`：Node.js 编译环境。

## ESLint 与 Prettier

- `@kb/config/eslint/base`：ESLint Flat Config 的 JavaScript 基础规则。
- `@kb/config/eslint/web`：通过 Vue 官方 TypeScript ESLint 适配器，为 Web 应用组合 TypeScript 与 Vue 单文件组件推荐规则。
- `@kb/config/prettier`：Prettier 规则；缩进为 4 个空格，与仓库 `.editorconfig` 一致。

Web 应用的 Vue 与 TypeScript lint 使用 TypeScript 6；当前 `typescript-eslint` 版本要求 TypeScript `>=4.8.4 <6.1.0`。根目录仍保留既定的 TypeScript 7 配置基线。
