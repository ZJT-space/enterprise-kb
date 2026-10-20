# @kb/config

仓库内部共享工程配置包，不包含业务类型或运行时代码。

## TypeScript

- `@kb/config/tsconfig/base.json`：严格模式基础配置。
- `@kb/config/tsconfig/web.json`：Web/DOM 编译环境。
- `@kb/config/tsconfig/node.json`：Node.js 编译环境。

## ESLint 与 Prettier

- `@kb/config/eslint/base`：ESLint Flat Config 的 JavaScript 基础规则。
- `@kb/config/prettier`：Prettier 规则；缩进为 4 个空格，与仓库 `.editorconfig` 一致。

TypeScript 和 Vue 单文件组件的 ESLint 解析器配置将在应用骨架阶段接入，避免在当前项目 TypeScript 版本尚未获得 typescript-eslint 官方支持时引入不兼容配置。
