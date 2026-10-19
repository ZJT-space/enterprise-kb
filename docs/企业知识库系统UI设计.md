# 企业知识库系统 — UI/UX 设计与交互规范（全 6 章评审定稿版）

| 项目 | 内容 | 
| ----- | ----- | 
| **文档名称** | 企业知识库系统 UI/UX 设计与交互规范 | 
| **文档版本** | v3.3（全 6 章评审定稿版） | 
| **更新日期** | 2026-10-19 | 
| **所属工程** | `apps/web` & `packages/tokens` & `packages/ui` | 
| **样式架构** | 样式单一真实源（SSOT）架构；Ant Design Vue 4.x 主题仅通过官方 `ConfigProvider theme`、Seed Token、算法及 `theme.useToken()` 接入 | 
| **应用 CSS 变量前缀** | `--kb-*`（由应用层消费 `theme.useToken()` 后映射；不是 Ant Design Vue 的 `cssVar` 配置） | 
| **组件策略** | Ant Design Vue 4.x 原生高频复用 + 核心复合业务组件 `@kb/ui` 二次封装 | 
| **动效体系** | Motion for Vue (`motion-v ^2.6.0`) + AutoAnimate (`@formkit/auto-animate ^0.10.0`) | 
| **对齐规范** | 《企业知识库系统设计与功能规范（MVP v3.3 修订定稿版）》、 《企业知识库系统技术方案与架构规范（v1.4 修订定稿版）》 | 

## 目录大纲概览

* [1. 文档说明与设计总则](#1-文档说明与设计总则)

  * [1.1 文档定位与适用范围](#11-文档定位与适用范围)

  * [1.2 核心设计原则](#12-核心设计原则)

  * [1.3 与功能规范、技术架构规范的映射与裁决机制](#13-与功能规范技术架构规范的映射与裁决机制)

* [2. 设计基础与样式单一真实源（Design Tokens & Foundations）](#2-设计基础与样式单一真实源design-tokens--foundations)

  * [2.1 样式架构：Ant Design Vue 算法驱动模型](#21-样式架构ant-design-vue-算法驱动模型)

  * [2.2 基础种子变量清单（Seed Tokens）](#22-基础种子变量清单seed-tokens)

  * [2.3 业务全生命周期状态直通映射表](#23-业务全生命周期状态直通映射表核心对齐-v33--v14)

  * [2.4 全量实战开发 CSS 变量速查字典](#24-全量实战开发-css-变量速查字典)

  * [2.5 字体与排版系统](#25-字体与排版系统)

  * [2.6 间距、页面布局骨架与响应式断点](#26-间距页面布局骨架与响应式断点)

  * [2.7 圆角、边框、阴影与卡片浮层容器规范](#27-圆角边框阴影与卡片浮层容器规范)

  * [2.8 图标系统（Lucide 统一规范）](#28-图标系统lucide-统一规范)

  * [2.9 动效体系规范](#29-动效体系规范)

* [3. 组件规范（Ant Design Vue 原生复用与 @kb/ui 二次封装）](#3-组件规范ant-design-vue-原生复用与-kbui-二次封装)

  * [3.1 Ant Design Vue 原生组件全局改造与使用规范](#31-ant-design-vue-原生组件全局改造与使用规范)

  * [3.2 基础核心组件：KbIcon 统一图标组件（二次封装）](#32-基础核心组件kbicon-统一图标组件二次封装)

  * [3.3 知识库侧边栏与多级虚拟目录树规范](#33-知识库侧边栏与多级虚拟目录树规范)

  * [3.4 全局搜索与内容展示组件](#34-全局搜索与内容展示组件)

  * [3.5 分层分享弹窗组件（KbShareModal 二次封装）](#35-分层分享弹窗组件kbsharemodal-二次封装)

  * [3.6 Markdown 编辑器与附件流水线组件（KbMarkdownEditor & KbAttachmentPanel 二次封装）](#36-markdown-编辑器与附件流水线组件kbmarkdowneditor--kbattachmentpanel-二次封装)

  * [3.7 差异比对器组件（KbDiffViewer 二次封装）](#37-差异比对器组件kbdiffviewer-二次封装)

  * [3.8 社交互动与楼中楼两级评论组件（KbCommentThread 二次封装）](#38-社交互动与楼中楼两级评论组件kbcommentthread-二次封装)

* [4. 页面布局与端到端业务流程](#4-页面布局与端到端业务流程)
  * [4.1 首页门户（系统菜单卡片与最近动态流）](#41-首页门户系统菜单卡片与最近动态流)
  * [4.2 知识库一体化工作台（四栏架构端到端交互闭环）](#42-知识库一体化工作台四栏架构端到端交互闭环)
  * [4.3 文档就地草稿编辑与发布端到端流程](#43-文档就地草稿编辑与发布端到端流程)
  * [4.4 审批中心端到端流转（两栏极简架构）](#44-审批中心端到端流转两栏极简架构)
* [4.5 统一回收站治理视图（类型图标位于三点菜单左侧）](#45-统一回收站治理视图类型图标位于三点菜单左侧)
  * [4.6 平台系统治理后台（系统管理员专属视图）](#46-平台系统治理后台系统管理员专属视图)

* [5. 关键跨页面交互与状态流转规则](#5-关键跨页面交互与状态流转规则)
  * [5.1 乐观并发控制与版本冲突流转规则（CAS 机制与 HTTP 409）](#51-乐观并发控制与版本冲突流转规则cas-机制与-http-409)
  * [5.2 发布审批全生命周期流转与反自审（No Self-Approval）硬约束](#52-发布审批全生命周期流转与反自审no-self-approval硬约束)
  * [5.3 跨区划转、所有权变更与容器业务冻结（is_frozen）](#53-跨区划转所有权变更与容器业务冻结is_frozen)
  * [5.4 资产软删除、30天保留倒计时与统一回收站流转](#54-资产软删除30天保留倒计时与统一回收站流转)
  * [5.5 分层分享权限继承与覆盖动态流转（未配置即继承，配置即覆盖）](#55-分层分享权限继承与覆盖动态流转未配置即继承配置即覆盖)
  * [5.6 离线容灾、网络波动与 5 秒草稿节流暂存时序](#56-离线容灾网络波动与-5-秒草稿节流暂存时序)

* [6. 响应式适配与设计研发交付规范](#6-响应式适配与设计研发交付规范)
  * [6.1 多端响应式视口适配方案（Responsive Viewport Adaptation）](#61-多端响应式视口适配方案responsive-viewport-adaptation)
  * [6.2 无障碍（Accessibility / WCAG 2.1 AA）与键盘导航规范](#62-无障碍accessibility--wcag-21-aa与键盘导航规范)
  * [6.3 动效降级体系（prefers-reduced-motion）](#63-动效降级体系prefers-reduced-motion)
  * [6.4 前端工程化落地与组件交付映射清单](#64-前端工程化落地与组件交付映射清单)
  * [6.5 全文档定稿交付物总结与版本演进路线](#65-全文档定稿交付物总结与版本演进路线)

# 1. 文档说明与设计总则

### 1.1 文档定位与适用范围

本文档是企业知识库系统的前端界面呈现、交互行为流转、动效体验与组件工程化落地唯一的**官方 UI/UX 视觉与交互规范**。

* **适用范围**：覆盖企业知识库系统的全栈 Web 端界面，包含登录认证、全局检索、知识库与目录树管理、Markdown 编辑与草稿隔离发布、审批中心、统一回收站、消息通知以及平台治理后台（公共库治理、账号角色与审计日志）等全部核心业务场景。

* **协同定位**：

  * **对产品经理（PM）**：作为产品原型设计与业务需求落地的交互标准，确保需求流转符合权限与状态机边界；

  * **对 UI/UX 设计师**：作为视觉设计稿绘制与设计资产（Tokens、图标、动效）输出的唯一定范；

  * **对前端工程师（FE）**：作为 Vue 3.5 + Ant Design Vue 4.2 + `@kb/tokens` 组件封装与页面切图还原的技术契约，明确原生直用与业务二次封装的边界；

  * **对测试工程师（QA）**：作为页面交互行为、错误状态反馈、权限动态显隐与极端并发冲突场景的测试验收依据。

### 1.2 核心设计原则

为兼顾企业级协同工具的严谨性与现代生产力工具的敏捷体验，UI 设计遵循以下五项核心原则：

* **1. 清晰高效（Clarity & Efficiency）**

  * 突出知识内容本身，减少无关视觉噪音；

  * 高频操作（全局检索 `⌘K`、草稿暂存 `⌘S`、分类展开、快速提审）一键直达；

  * 辅以轻量物理动效（`motion-v` 弹簧与 `v-auto-animate` 平滑展开），增强操作确定性与空间连续感。

* **2. 体系一致（System Consistency & SSOT）**

  * 坚持样式单一真实源（SSOT）设计体系：Ant Design Vue 主题通过官方 API 配置；应用层按需通过 `theme.useToken()` 消费当前主题，并映射到 `@kb/tokens`、Tailwind CSS v4 与应用 CSS 变量；

  * 全局组件样式优先复用已改造的 Ant Design Vue 原生基准，杜绝重复发明轮子，严格保持字体阶梯、间距、圆角与阴影的高度统一。

* **3. 全局卡片风格（Card-Centric Design Philosophy）**

  * **整个系统为纯正的“卡片风格（Card Style）”**，卡片不仅是主内容工作区的呈现单元，**弹框（Modal/Dialog）、模态框（Modal）、侧滑抽屉（Drawer）、气泡确认框（Popover/Popconfirm）及提示横幅全面做成精致自包含的卡片形态**；

  * 弹窗呈现为悬浮大卡片，内部各功能区块拆解为“内嵌子卡片（Card-in-Card）”；抽屉打破死板贴边做法，采用四边留白的悬浮卡片形态，保持全站空间感与卡片隐喻高度纯粹统一。

* **4. 权限显性化（Permission-Driven Visibility）**

  * 界面元素严格依据当前登录用户的全局角色（`system_admin` ⊃ `kb_admin` ⊃ `general_user`）及资源覆盖权限（`owner` / `editor` / `reader` / `none`）动态渲染；

  * 操作按钮遵循“无权隐藏或置灰引导”原则，尤其在跨区划转、发布审批及回收站恢复场景中，提供清晰的权限归属与状态提示，**坚决落实反自审（No Self-Approval）硬约束**。

* **5. 状态完备互斥（State Exclusivity & Predictability）**

  * 严谨映射底层状态机，杜绝模棱两可的状态呈现；

  * 彻底解耦**资产 4 态**（`published` 已发布、`withdrawn` 下架治理、`archived` 已归档、`trashed` 回收站）与**容器业务冻结**（`is_frozen`）；

  * 显式区分正式版本与本地修改草稿，针对并发冲突（HTTP 409）提供直观的 Diff 对比与确认覆盖机制，保证全流程视觉反馈可预期。

* **6. 多端响应与无障碍（Multi-Platform & Accessibility）**

  * 以桌面端（≥ 1024px）工作区为核心，视口足够宽时展示四栏，空间不足时收起 AI 栏；向下兼容平板端（768px ~ 1023px）与移动端（< 768px 抽屉导航与单列阅读）；

  * 全站以 WCAG AA 级色彩对比度为验收目标（普通文字至少 4.5:1，大字号至少 3:1），所有交互控件支持键盘焦点导航与屏幕阅读器无障碍（A11y）标准；实际颜色组合须逐项测量确认。

### 1.3 与功能规范、技术架构规范的映射与裁决机制

本 UI 设计规范处于三层规范架构中的承上启下位置：

```
┌────────────────────────────────────────────────────────┐
│   《企业知识库系统设计与功能规范》（MVP v3.3 修订定稿版）    │ ← 业务与规则单一真实源（SSOT）
└──────────────────────────┬─────────────────────────────┘
                           │ 驱动业务实体、权限逻辑与状态流转
┌──────────────────────────▼─────────────────────────────┐
│   《企业知识库系统 UI/UX 设计规范》（本文档 v3.3）        │ ← 用户体验、交互行为与视觉呈现契约
└──────────────────────────┬─────────────────────────────┘
                           │ 遵循工程技术边界与性能指标
┌──────────────────────────▼─────────────────────────────┐
│   《企业知识库系统技术方案与架构规范》（v1.4 修订定稿版）  │ ← 前后端工程化实现基线（Vue 3.5 / AntD / tokens）
└────────────────────────────────────────────────────────┘

```

#### 规范映射与冲突裁决矩阵

| 维度 | 规范依据与职责边界 | 冲突裁决规则 | 
| ----- | ----- | ----- | 
| **业务逻辑与权限** | 以《功能规范 v3.3》为准：定义全局三级角色继承、分层分享覆盖机制（`permission_overrides`）、5 类审批类型、反自审原则、两级回收站及 30 天保留规则。 | 当 UI 交互与业务规则冲突时，**绝对以功能规范为准**。UI 必须完整呈现业务约束，不得擅自简化或绕过安全与权限门禁。 | 
| **工程技术边界** | 以《技术规范 v1.4》为准：锁定 Monorepo 架构、Vue 3.5 + Vite 8、Ant Design Vue 4.2.6、Tailwind CSS v4、`@lucide/vue`、`motion-v`、5 位业务 Code（`20000`/`40000`/`50000`）及响应头透传。 | 当 UI 视觉设计超出前端技术实现或影响系统性能（如海量树节点卡顿）时，**必须以技术方案规范为约束**（例如强制使用 `<a-tree :virtual="true">` 承载虚拟滚动，不得采用无虚拟化的纯 DOM 平铺）。 | 
| **界面与交互表达** | 以本《UI 设计规范》为准：负责定义页面具体布局、DOM 骨架、色彩 Token、动效时长、弹窗交互流程、表单防呆提示以及错误码在界面上的 Toast/Modal 映射表达。 | 页面结构细节、交互微动效与视觉展现方式以此文档为最终验收基准。 | 

# 2. 设计基础与样式单一真实源（Design Tokens & Foundations）

### 2.1 样式架构：Ant Design Vue 算法驱动模型

主题定义遵循 [Ant Design Vue 官方定制主题文档](https://github.com/vueComponent/ant-design-vue/blob/main/site/src/vueDocs/customize-theme.zh-CN.md)：通过 `ConfigProvider` 的 `theme` 配置 `token`、`algorithm` 或 `components`；Vue 组件通过 `theme.useToken()` 消费当前主题。系统所有颜色只来自传给 Ant Design Vue 的官方 Seed Token 及其算法派生值。浅色/深色、Hover/Active、背景、边框、文字和业务图标色均从这些 Seed 派生，不另设应用业务色 Seed，不手工覆盖 Map Token 或 Alias Token。应用层 CSS 变量只映射当前 `theme.useToken()` 返回的官方 token；不宣称 Ant Design Vue 提供 `cssVar` 配置，也不另造色阶。

```
                    ┌──────────────────────────────┐
                    │    packages/tokens (SSOT)    │
                    │ 全局 Seed Tokens（唯一颜色来源）│
                    └──────────────┬───────────────┘
                                   │ 传入官方支持的 Seed Token
                    ┌──────────────▼───────────────┐
                    │  Ant Design Vue 4.x 主题算法  │
                    │  - theme.defaultAlgorithm    │ (浅色推导)
                    │  - theme.darkAlgorithm       │ (深色推导)
                    └──────────────┬───────────────┘
                                   │ theme.useToken() 获取当前主题
                    ┌──────────────▼───────────────┐
                    │ 应用层按需映射为 --kb-*      │
                    │ 供 Tailwind / @kb/ui 使用    │
                    └──────────────────────────────┘

```

#### 2.1.1 全局注入标准代码（`App.vue`）

根级 `ConfigProvider` 只配置官方支持的 `theme` 属性。`cssVar` 不属于此处所依据的 Ant Design Vue 4.x 主题 API；自定义 Vue 样式应在 `ConfigProvider` 子树内调用 `theme.useToken()` 获取当前 token。应用若需要 `--kb-*`，由应用层将返回的 token 映射成 CSS 变量，不把映射误认为 Ant Design Vue 自动生成的变量。

```
<!-- apps/web/src/App.vue -->
<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';
import { systemSeeds } from '@kb/tokens';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const themeConfig = computed(() => ({
  // 官方预设算法：浅色 defaultAlgorithm，深色 darkAlgorithm。
  algorithm: themeStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  // 仅放 Ant Design Vue 官方 Seed Token；所有值来自 packages/tokens。
  token: {
    colorPrimary: systemSeeds.colorPrimary,
    colorSuccess: systemSeeds.colorSuccess,
    colorWarning: systemSeeds.colorWarning,
    colorError: systemSeeds.colorError,
    colorInfo: systemSeeds.colorInfo,
    colorTextBase: systemSeeds.colorTextBase,
    colorBgBase: systemSeeds.colorBgBase,
    borderRadius: systemSeeds.borderRadius,
    fontSize: systemSeeds.fontSize,
    fontFamily: systemSeeds.fontFamily,
  },
}));
</script>

```

#### 2.1.2 当前主题 Token 的消费方式

Vue 组件在 `ConfigProvider` 子树内通过官方 `theme.useToken()` 获取当前主题值。应用 CSS 变量和 Tailwind 映射属于项目自己的消费层，映射值必须来自该 hook 返回的 token；不得依赖 Ant Design Vue 自动输出 `--kb-*`，也不得新增绕过官方 Seed Token 的业务颜色值。

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();
const appVars = computed(() => ({
  '--kb-color-primary': token.colorPrimary,
  '--kb-color-bg-container': token.colorBgContainer,
  '--kb-color-text': token.colorText,
  '--kb-color-border': token.colorBorder,
}));
</script>

<template>
  <div :style="appVars"><slot /></div>
</template>
```

### 2.2 基础种子变量清单（Seed Tokens）

全站只维护本表列出的 Seed Token。所有标准组件状态、背景、边框、文字及业务图标色均使用这些 Seed 经 Ant Design Vue 官方算法派生的 Token；业务分类通过复用 `colorPrimary`、`colorInfo`、`colorWarning` 等已有语义色区分，不增加额外颜色 Seed 或自定义色阶。

| Seed 属性名 | 色值配置 | 颜色预览 | 业务含义说明 | AntD 算法自动推导覆盖范围 | 
| ----- | ----- | ----- | ----- | ----- | 
| `colorPrimary` | `#15803D` | &lt;span style=&quot;display:inline-block;width:16px;height:16px;background-color:#15803D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;&quot;&gt;&lt;/span&gt; | 品牌主色（森林绿） | 自动生成 `colorPrimaryHover`、`colorPrimaryActive`、`colorPrimaryBg`、`colorPrimaryBorder` 等 | 
| `colorSuccess` | `#10B981` | &lt;span style=&quot;display:inline-block;width:16px;height:16px;background-color:#10B981;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;&quot;&gt;&lt;/span&gt; | 成功状态（安全、通过） | 自动生成审批通过标签、杀毒清洁安全、操作成功 Toast | 
| `colorWarning` | `#F59E0B` | &lt;span style=&quot;display:inline-block;width:16px;height:16px;background-color:#F59E0B;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;&quot;&gt;&lt;/span&gt; | 警告状态（草稿、下架） | 自动生成草稿提示底色、合规下架警示、待关注操作背景 | 
| `colorError` | `#EF4444` | &lt;span style=&quot;display:inline-block;width:16px;height:16px;background-color:#EF4444;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;&quot;&gt;&lt;/span&gt; | 错误状态（危险、拦截） | 自动生成审批驳回、杀毒病毒拦截、表单报错、删除二次确认 | 
| `colorInfo` | `#4E95FF` | &lt;span style=&quot;display:inline-block;width:16px;height:16px;background-color:#4E95FF;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;&quot;&gt;&lt;/span&gt; | 信息状态（私有库、待审、通知） | 自动生成私有库浅蓝底色、待审批流转、常规通知气泡、容器冻结标识 | 
| `colorTextBase` | `#1F1F1F` | - | 中性文字基础 Seed | 由 Seed 算法派生主/次/辅助文字及图标颜色 | 
| `colorBgBase` | `#FFFFFF` | - | 中性背景基础 Seed | 由 Seed 算法派生布局、容器、浮层与分层背景颜色 | 
| `borderRadius` | `6` | \- | 基础控件圆角 (px) | 自动派生 `borderRadiusSM` (4px)、`borderRadiusLG` (8px)、`borderRadiusXS` (2px) | 
| `fontSize` | `14` | \- | 基础正文字号 (px) | 自动派生 Heading 1\~5 阶梯标题字号、SM 与 LG 字号 | 

### 2.3 业务全生命周期状态直通映射表（核心对齐 v3.3 & v1.4）

状态背景与文字均使用对应 Seed Token 经统一算法生成的语义变量；文字前景由算法从同一 Seed 选择满足对比度的明暗变体，不另行指定颜色：

| 业务实体状态 | 状态枚举 | 推荐背景变量 (Bg) | 推荐文字/图标变量 (Text) | 浅色视觉效果 | 深色视觉效果 | 业务场景说明 | 
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | 
| **已发布** | `published` | `var(--kb-color-success-bg)` | `var(--kb-color-success-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#DCFCE7;border:1px solid #15803D;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅绿底深绿字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#064E3B;border:1px solid #34D399;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗绿底亮绿字 | 线上正式版本，开放浏览与检索 | 
| **下架治理** | `withdrawn` | `var(--kb-color-warning-bg)` | `var(--kb-color-warning-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#FEF3C7;border:1px solid #F59E0B;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅黄底深琥珀字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#78350F;border:1px solid #FBBF24;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗棕底金黄字 | 合规或管理员下架，不可搜不可读 | 
| **已归档** | `archived` | `var(--kb-color-fill-tertiary)` | `var(--kb-color-text-secondary)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#F3F4F6;border:1px solid #D1D5DB;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅灰底中灰字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#1F1F1F;border:1px solid #404040;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗灰底淡灰字 | 历史封存内容，只读，不参与全文搜索与向量召回 | 
| **回收站** | `trashed` | `var(--kb-color-error-bg)` | `var(--kb-color-error-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#FEE2E2;border:1px solid #EF4444;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅红底深红字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#7F1D1D;border:1px solid #F87171;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗红底淡红字 | 软删除资产，垃圾箱内 30 天保留倒计时 | 
| **容器业务冻结** | `is_frozen = true` | `var(--kb-color-info-bg)` | `var(--kb-color-info-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#EAF3FF;border:1px solid #4E95FF;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅蓝底深蓝字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#233A56;border:1px solid #A6BCD9;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗蓝灰底柔蓝字 | 跨区划转提审期间受影响子树锁定，阻断写入与移动 | 
| **草稿暂存中** | `draft` | `var(--kb-color-warning-bg)` | `var(--kb-color-warning-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#FEF3C7;border:1px solid #F59E0B;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅黄底深琥珀字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#78350F;border:1px solid #FBBF24;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗棕底金黄字 | 独立草稿箱暂存状态，每 5 秒自动节流备份 | 
| **审批流：待审批** | `pending` | `var(--kb-color-info-bg)` | `var(--kb-color-info-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#EAF3FF;border:1px solid #4E95FF;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅蓝底深蓝字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#233A56;border:1px solid #A6BCD9;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗蓝灰底柔蓝字 | 流程流转中，待管理员或所有者处理 | 
| **审批流：已驳回** | `rejected` | `var(--kb-color-error-bg)` | `var(--kb-color-error-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#FEE2E2;border:1px solid #EF4444;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 浅红底深红字 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#7F1D1D;border:1px solid #F87171;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 暗红底淡红字 | 审批未通过，附带必填驳回理由 | 
| **杀毒：安全清洁** | `clean` | `var(--kb-color-success-bg)` | `var(--kb-color-success-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#DCFCE7;border:1px solid #15803D;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 绿盾牌 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#064E3B;border:1px solid #34D399;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 亮绿盾牌 | 杀毒扫描合格，开放安全下载与预览 | 
| **杀毒：病毒拦截** | `infected` | `var(--kb-color-error-bg)` | `var(--kb-color-error-text)` | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#FEE2E2;border:1px solid #EF4444;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 红感叹号 | &lt;span style=&quot;display:inline-block;width:12px;height:12px;background:#7F1D1D;border:1px solid #F87171;vertical-align:-1px;&quot;&gt;&lt;/span&gt; 亮红感叹号 | 检测出高危病毒，强行锁定报警阻断 | 

表中的色块只用于说明状态语义，不作为 Ant Design Vue 算法输出值或实现时的硬编码值。实际组件颜色必须从当前 `theme.useToken()` 读取对应官方 token；调色时只修改 Seed。图标可使用语义主色，但图标不能替代状态文字。

### 2.4 全量实战开发 CSS 变量速查字典

本节中的 `--kb-*` 是应用层变量名，不是 Ant Design Vue 自动生成的 CSS 变量。实现时按 2.1.2 的方式映射到 `theme.useToken()` 的官方 token；表中浅色/深色数值只作视觉参考，不作为算法结果、额外 Seed 或硬编码配置。

#### 2.4.1 容器与背景类（Backgrounds & Fills）

| 开发意图 / 适用场景 | 标准 CSS 变量名 | 浅色表现说明 | 深色表现说明 | Tailwind CSS v4 使用示例 | 
| ----- | ----- | ----- | ----- | ----- | 
| **页面整体大背景**（全局大底色、左侧固定导航栏背景） | `var(--kb-color-bg-layout)` | `#F5F5F5` 浅灰底 | `#000000` 纯黑底 | `class="bg-[var(--kb-color-bg-layout)]"` | 
| **标准内容容器背景**（白底卡片、表格行、输入框背景） | `var(--kb-color-bg-container)` | `#FFFFFF` 纯白 | `#141414` 深黑灰 | `class="bg-[var(--kb-color-bg-container)]"` | 
| **高层级/浮层背景**（下拉菜单面板、模态弹窗、Popover、抽屉） | `var(--kb-color-bg-elevated)` | `#FFFFFF` 纯白 | `#1F1F1F` 凸显深灰 | `class="bg-[var(--kb-color-bg-elevated)]"` | 
| **鼠标悬停背景**（表格行 Hover、列表项 Hover） | `var(--kb-color-fill-tertiary)` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.08)` | `class="hover:bg-[var(--kb-color-fill-tertiary)]"` | 
| **斑马纹/极浅分割填充** | `var(--kb-color-fill-quaternary)` | `rgba(0,0,0,0.02)` | `rgba(255,255,255,0.04)` | `class="bg-[var(--kb-color-fill-quaternary)]"` | 
| **禁用态背景**（禁用按钮、不可点击输入框） | `var(--kb-color-bg-container-disabled)` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.08)` | `class="bg-[var(--kb-color-bg-container-disabled)]"` | 
| **弹窗遮罩背景**（Modal / Drawer 背后的半透明蒙层） | `var(--kb-color-bg-mask)` | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.65)` | `class="bg-[var(--kb-color-bg-mask)]"` | 

#### 2.4.2 文本排版与图标类（Text & Icons）

| 开发意图 / 适用场景 | 标准 CSS 变量名 | 浅色表现说明 | 深色表现说明 | Tailwind CSS v4 使用示例 | 
| ----- | ----- | ----- | ----- | ----- | 
| **主标题、重要正文**（最深文字，必须清晰可读，WCAG AA） | `var(--kb-color-text)` | `rgba(0,0,0,0.88)` | `rgba(255,255,255,0.85)` | `class="text-[var(--kb-color-text)]"` | 
| **次要文字、表单 Label**（普通段落、表格主要字段） | `var(--kb-color-text-secondary)` | `rgba(0,0,0,0.65)` | `rgba(255,255,255,0.65)` | `class="text-[var(--kb-color-text-secondary)]"` | 
| **辅助说明、元数据**（时间戳、作者名、弱提示文本） | `var(--kb-color-text-tertiary)` | `rgba(0,0,0,0.60)` | `rgba(255,255,255,0.60)` | `class="text-[var(--kb-color-text-tertiary)]"` | 
| **占位符与禁用文字**（输入框 placeholder、置灰文字） | `var(--kb-color-text-quaternary)` | `rgba(0,0,0,0.60)` | `rgba(255,255,255,0.60)` | `class="text-[var(--kb-color-text-quaternary)]"` | 
| **默认图标颜色**（未激活的线性操作图标） | `var(--kb-color-icon)` | `rgba(0,0,0,0.45)` | `rgba(255,255,255,0.45)` | `class="text-[var(--kb-color-icon)]"` | 
| **图标悬停颜色**（鼠标滑过图标） | `var(--kb-color-icon-hover)` | `rgba(0,0,0,0.88)` | `rgba(255,255,255,0.85)` | `class="hover:text-[var(--kb-color-icon-hover)]"` | 
| **纯白反色文字**（深色主按钮内部文字） | `var(--kb-color-white)` | `#FFFFFF` | `#FFFFFF` | `class="text-[var(--kb-color-white)]"` | 

#### 2.4.3 边框、分割线与描边类（Borders & Lines）

| 开发意图 / 适用场景 | 标准 CSS 变量名 | 视觉表现说明 | Tailwind CSS v4 使用示例 | 
| ----- | ----- | ----- | ----- | 
| **标准控件边框**（输入框、选择器、外卡片标准 1px 细边框） | `var(--kb-color-border)` | `#D9D9D9` 实线（深色模式自动变暗） | `class="border border-[var(--kb-color-border)]"` | 
| **次级弱分割线**（表格行底部分割线、列表项分割线） | `var(--kb-color-split)` | 极浅半透明线（深浅模式自适应） | `class="border-b border-[var(--kb-color-split)]"` | 
| **主色聚焦外圈发光**（键盘 Tab 聚焦、输入框聚焦 Ring） | `var(--kb-control-outline)` | 主色半透明发光环（半透明绿色） | `class="focus:ring-2 focus:ring-[var(--kb-control-outline)]"` | 

#### 2.4.4 品牌主色系派生类（Primary Gradient Tokens）

| 意图 / 场景 | 标准 CSS 变量名 | 浅色视觉表现 | 典型开发用途 | 
| ----- | ----- | ----- | ----- | 
| **主色高亮** | `var(--kb-color-primary)` | `colorPrimary` Seed（森林绿） | 主按钮背景、激活图标、主品牌标识 | 
| **主色悬停** | `var(--kb-color-primary-hover)` | 由主色 Seed 算法派生的悬停色 | 主按钮鼠标悬停、链接 Hover | 
| **主色按下** | `var(--kb-color-primary-active)` | 由主色 Seed 算法派生的按下色 | 按钮点击按下瞬间状态（Active / Pressed） | 
| **主色浅底** | `var(--kb-color-primary-bg)` | &lt;span style=&quot;display:inline-block;width:14px;height:14px;background-color:#DCFCE7;border-radius:2px;border:1px solid #86EFAC;vertical-align:-2px;&quot;&gt;&lt;/span&gt; 浅草绿底 `#DCFCE7` | 导航菜单选中项底色、主色轻量标签底色 | 
| **主色边框** | `var(--kb-color-primary-border)` | 主色浅边框 `#86EFAC` | 选中项外边框、主色轻提示外边框 | 
| **超链接文字** | `var(--kb-color-link)` | 由 `colorPrimary` Seed 算法生成满足对比度的链接前景 | 可点击的超链接文字 | 
| **超链接悬停** | `var(--kb-color-link-hover)` | 链接悬停颜色 | 超链接 Hover 状态 | 

### 2.5 字体与排版系统

* **字体栈标准**：

  * **界面无衬线字体栈**：`"MiSans", "MiSans L3", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`；MiSans 用于常规界面文字，MiSans L3 用于补充生僻汉字，字体未安装时浏览器按后续系统字体回退。

  * **生僻字回退**：MiSans 覆盖 GB18030-2022 实现级别 1、2；MiSans L3 提供级别 3 字符（60,340 个），不包含级别 1、2 字符，因此须与 MiSans 配合使用。MiSans L3 仅支持 Regular 字重，其他字重由 MiSans 提供。需要相应字形时，部署环境须能加载 MiSans L3 字体文件。

  * **等宽代码与哈希字体栈**：`"Fira Code", "SF Mono", Menlo, Consolas, "Courier New", monospace`（用于 Markdown 代码块、SHA-256、版本号、审计 TraceID）。

* **UI 界面字号阶梯**：

  * 大标题 H1: `28px` / 600（行高 1.3）

  * 区域标题 H2: `22px` / 600（行高 1.35）

  * 卡片标题 H3: `18px` / 600（行高 1.4）

  * 表单小节 H4: `16px` / 600（行高 1.5）

  * UI 基础正文: `14px` / 400（行高 1.5，AntD 原生统一高度）

  * 辅助说明: `13px` / 400

  * 时间/微标: `12px` / 400

* **Markdown 阅读排版专用字号**：

  * 阅读正文：`16px` / 400 / 行高 `1.8`（大行高防疲劳）

  * 阅读大标题 H1: `32px`、H2: `26px`、H3: `22px`

### 2.6 间距、页面布局骨架与响应式断点

* **4px 基础网格间距**：`4px` (微距) / `8px` (紧凑) / `16px` (标准) / `24px` (模块外边距) / `32px` (大区块) / `48px` (留白沉降)。

* **三大核心页面布局骨架**：

  * **1. 首页门户（单栏居中）**：无左侧导航栏，页面垂直居中大搜索框（最大 `640px`）+ 下方网格卡片（最大 `1200px`）。

  * **2. 审批中心（两栏布局）**：

    * 最左侧为收窄的**图标菜单栏（固定宽度 `64px`）**，纵向仅放置 3 个核心菜单图标（**首页、知识库、审批中心**）与底部用户头像；

    * 右侧为主审批工作区自适应（最大 `1200px` 水平居中）。

  * **3. 知识库（四栏一体化工作台）**：

    * **第一栏（系统主菜单栏）**：最左侧 64px 极简纯图标栏。普通用户/库管理员仅展示 3 个核心菜单（首页、知识库、审批中心图标 + 底部头像）；**系统管理员比其他角色多出用户管理（`Users`）与系统配置（`Settings`）两个系统菜单图标**；

    * **第二栏（知识库与资产栏）**：固定宽度 `240px`，纵向平铺呈现统一中性底色的无边框导航卡片，用图标和文字标签区分公共库、私有库、分享库、收藏夹、草稿箱和唯一的回收站入口，不依靠自定义色阶辨识。展开后的内容行均按“类型图标、名称、三点操作”排列，类型图标位于 `MoreHorizontal`（⋯）左侧；点击库卡片后在其内部平滑展开多级分类虚拟树，并在第三栏展现内容；

    * **第三栏（主内容工作区）**：自适应宽度。**第二栏如果选中的是库层级，第三栏首先显示对应库的卡片**（呈现该库的概览元数据与快捷管理操作），下方网格化列出其包含的一级分类卡片与直属文档卡片；**点击对应文档直接在此栏原地就地呈现 Markdown 正文阅览；点击编辑草稿与阅读完全一样，四栏保持不变，仅是将第三栏内容无缝切换为草稿编辑器**；

    * **第四栏（AI 智能对话框）**：预留右侧对话框（宽度 `360px`，支持展开/折叠），专用于未来与知识库 AI 进行实时上下文问答与总结。

* **响应式断点标准**：

  * 移动端（`< 768px`）：侧边栏折叠为抽屉；工作区折叠为单栏，TOC 变为悬浮按钮。

  * 平板端（`768px ~ 1023px`）：侧边栏支持折叠；卡片双列排布。

  * 桌面端（`>= 1024px`）：主工作区使用桌面布局；第四栏 AI 对话框在视口不足以容纳四栏时默认收起，达到四栏最小宽度后再完整展开。

### 2.7 圆角、边框、阴影与卡片浮层容器规范

全站贯彻**卡片化风格（Card-Centric Design）**，所有页面区块与浮层容器（弹框、抽屉、气泡）统一遵循卡片几何与阴影体系：

* **圆角规范**：

  * 默认控件与侧栏卡片圆角：`var(--kb-border-radius)`（`6px`，用于输入框、按钮、第二栏导航无边框微卡片）；

  * **大卡片容器与浮层圆角**：`var(--kb-border-radius-lg)`（`8px ~ 12px`，用于内容展示卡片、**模态弹窗卡片、悬浮卡片式抽屉**、Diff 比对面板）；

  * 业务小标签圆角：`var(--kb-border-radius-sm)`（`4px`，用于状态 Tag、轻量徽章）；

  * 头像圆角：`var(--kb-border-radius-full)`（`9999px`）。

* **1px 弱边框规范**：

  * 全站内容卡片与浮层大卡片（Modal/Drawer）默认统一采用精致的 `1px solid var(--kb-color-border)` 细边框勾勒，杜绝粗重线条；第二栏资产导航微卡片则特例采用 `border: none` 纯色平铺。

* **三级阴影体系（营造卡片立体空间层级）**：

  * **轻度微弱阴影**：`var(--kb-box-shadow-tertiary)`（常规卡片 Hover 时的轻微上浮物理质感）；

  * **中度标准阴影**：`var(--kb-box-shadow)`（下拉选择器面板、Popover 气泡微型卡片）；

  * **深度大阴影**：`var(--kb-box-shadow-secondary)`（**模态弹窗悬浮大卡片、侧滑悬浮卡片式抽屉**、Diff 审阅面板），形成强烈的景深与聚焦感。

* **全局 Z-index 层级规范**：

  * 普通流：`0`；下拉面板：`100`；吸顶固定栏：`200`；抽屉 Drawer：`300`；遮罩背景：`400`；模态弹窗 Modal：`500`；气泡 Popover：`600`；Tooltip 提示：`700`；全局 Toast：`800`；全屏阅读：`900`。

### 2.8 图标系统（Lucide 统一规范）

统一采用官方 `@lucide/vue ^1.57.0` 包，强制覆盖为 `1.5px` 线宽：

* **尺寸规范**：辅助 `12px`、默认 `16px`、导航/主操作 `20px`、大标题/空态 `24px` / `32px`。

* **核心映射**：公共库 `Globe`、私有库 `Lock`、分类 `Folder`、文档 `FileText`、草稿 `FileEdit`、快照 `History`、Diff 比对 `GitCompare`、冻结 `Snowflake`、杀毒清洁 `ShieldCheck`、病毒拦截 `ShieldBan`、分享 `Share2`、反自审拦截 `UserX`、回收站 `Trash2`。

### 2.9 动效体系规范

* **主力库 1：[Motion for Vue (motion-v)](https://www.google.com/search?q=https%3A%2F%2Fmotion.dev%2Fdocs%2Fvue)**：用于首页中央搜索框下展的 `layout` 共享布局过渡、右上角头像悬停弹性弹出卡片、长条卡片折叠展开、目录拖拽回弹。

* **主力库 2：[AutoAnimate (@formkit/auto-animate)](https://www.google.com/search?q=https%3A%2F%2Fauto-animate.formkit.com%2F)**：用于表格行内展开 Diff 面板、文档标签增删（上限 8 个）、附件列表动态刷新、楼中楼评论发表/删除。

* **原生组件**：弹窗与抽屉直接复用 Ant Design Vue 原生缓动。全站自动支持 `prefers-reduced-motion` 无障碍降级。

# 3. 组件规范（Ant Design Vue 原生复用与 `@kb/ui` 二次封装）

### 3.1 Ant Design Vue 原生组件全局改造与使用规范

全局 `<a-config-provider>` 按官方 `theme` API 注入主题；自定义样式所需的 `--kb-*` 由应用消费层从 `theme.useToken()` 映射。全站**通用基础组件 100% 直用 Ant Design Vue 4.x 原生组件**，无需二次包装，统一遵循以下业务约定：

#### 3.1.1 基础表单与操作组件

| 原生组件 | 标签 | 标准尺寸规范 | 状态与业务使用约束 | 
| ----- | ----- | ----- | ----- | 
| **按钮** | `<a-button>` | `middle` (`36px`) 默认；工具栏用 `small` (`28px`)；主登录/提交用 `large` (`44px`) | 主按钮 (`type="primary"`) 每个视口区块仅允许 1 个；高危操作必须配 `danger`；工具栏图标按钮统一用 `type="text"` 并显式添加 `aria-label`。 | 
| **单行输入框** | `<a-input>` | 高度 `36px`，圆角 `var(--kb-border-radius)` (`6px`) | 表单项必须配校验反馈；搜索类输入框强制开启 `:allow-clear="true"`。 | 
| **多行文本域** | `<a-textarea>` | 最小高度 `80px`，带字数统计 `:show-count="true"` | 用于文档摘要、审批驳回理由输入、评论输入框，行高锁定 `1.7`。 | 
| **下拉选择器** | `<a-select>` | 高度 `36px`，最大下拉高度 `320px` | 选项 $>10$ 项时强制开启 `:show-search="true"`；支持 `:allow-clear="true"`。 | 
| **开关组件** | `<a-switch>` | 宽度 `40px`，高度 `22px` | 用于私有库“发布审批开关 (`approval_required`)”及系统配置项。 | 
| **单选/复选框** | `<a-radio>` / `<a-checkbox>` | 尺寸 `16px × 16px` | 单选用于基础互斥选项；复选框用于批量操作、登录记住我。 | 

#### 3.1.2 导航与数据展示组件

| 原生组件 | 标签 | 核心属性配置 | 典型业务场景 | 
| ----- | ----- | ----- | ----- | 
| **数据表格** | `<a-table>` | 单元格内边距 `12px 16px`，表头背景 `var(--kb-color-bg-layout)` | 审批流单据列表、用户列表、审计日志列表 | 
| **业务标签** | `<a-tag>` | 圆角 `4px`，内边距 `2px 8px`，高度 `22px` | 资产状态展示、分类标记、文档标签（最多 8 个） | 
| **状态徽章** | `<a-badge>` | 状态点 `status="processing"` 或红点数字角标 | 首页头像未读通知徽章、审批待办条数提醒 | 
| **用户头像** | `<a-avatar>` | 默认 `32px × 32px` 圆形；多用户重叠用 `<a-avatar-group>` | 顶部导航栏、评论区用户头像、文档作者卡片 | 

#### 3.1.3 全局反馈与浮层容器（全面卡片化规范）

基于系统“**全场景卡片风格**”的基调，**所有的弹框（Modal/Dialog）、模态框（Modal）、侧滑抽屉（Drawer）以及确认气泡全面重构为卡片形态**，杜绝冷冰死板的传统对话框外观：

##### 1. 卡片式模态弹窗（`<a-modal>` / 浮动大卡片）

* **悬浮卡片外观**：

  * 弹窗整体呈现为一块**悬浮大卡片（Floating Elevated Card）**，圆角锁定为 `var(--kb-border-radius-lg)` (`8px ~ 12px`)；

  * 外圈包裹 `1px solid var(--kb-color-border)` 细边框，配合深度大阴影 `var(--kb-box-shadow-secondary)`，背景为纯净容器底色 `var(--kb-color-bg-elevated)`；

  * 弹窗背后使用柔和半透明遮罩 `var(--kb-color-bg-mask)`，突出前景卡片的悬浮感；

* **内部结构“卡片化分块”（Card-in-Card 结构）**：

  * 弹窗内部彻底摒弃大段无分割文本堆砌，将表单输入、配置项、授权名单与警示说明划分为独立的**内嵌子卡片（Sub-Cards）**；

  * 内嵌子卡片统一使用浅色背景（如 `var(--kb-color-fill-quaternary)` 或 `var(--kb-color-fill-secondary)`）、`6px` 圆角与 `12px ~ 16px` 内边距，模块感清晰立体；

* **头部与底部卡片式封装**：

  * 头部标题栏带左侧业务图标，底部操作栏采用卡片式贴底工具条设计，操作按钮分组明确。

##### 2. 悬浮卡片式抽屉（`<a-drawer>` / 侧滑悬浮大卡片）

* **留白悬浮卡片形态（Floating Card Drawer）**：

  * **打破传统贴边死板做法**：抽屉不再硬生生贴满屏幕最右侧与上下视口，而是采用**四边留白悬浮卡片式设计**——距离视口顶部、底部和右侧边缘各保持 `12px ~ 16px` 的呼吸外边距（Margin）；

  * 四角统一带卡片大圆角 `var(--kb-border-radius-lg)` (`12px`)，外圈包裹 `1px solid var(--kb-color-border)` 细边框，叠加悬浮大阴影 `var(--kb-box-shadow-secondary)`，宛如一张从右侧平滑滑出的精致悬浮大卡片；

* **抽屉内部卡片流**：

  * 抽屉内部承载的内容（如历史版本快照列表、附件管理清单、审计变更记录）全部采用卡片列表（Card List）逐项堆叠，项与项之间保持 `8px` 间隙；

* **宽度标准**：普通详情（版本快照历史）卡片宽度 `420px`，大面板（属性配置、审批单详情）卡片宽度 `660px`。

##### 3. 气泡卡片与确认对话框（`<a-popover>` / `<a-popconfirm>`）

* 悬浮微型卡片形态，圆角 `6px`，带 `1px solid var(--kb-color-border)` 与中度阴影 `var(--kb-box-shadow)`；

* 高危不可逆治理操作（下架、归档、彻底删除、转让）强制使用卡片式二次确认，危险按钮置红并加粗警示文案。

##### 4. 卡片式操作反馈横幅（`<a-alert>` / Banner）

* 所有全局警示、合规通知、冻结说明横幅均封装为独立的**自包含信息卡片**，带 `6px` 圆角、状态浅底色与对应语义浅边框，内嵌状态图标与操作动作按钮。

##### 5. 全局 Toast 提示与骨架加载

* **全局 Toast 提示**：使用 `message.success()` / `message.error()` / `message.warning()`，顶部居中悬浮卡片胶囊，停留时间锁定为 `3000ms`；

* **骨架屏与空状态**：使用 `<a-skeleton :active="true">` 承载首屏卡片骨架加载，使用 `<a-empty>` 承载列表空态卡片。

### 3.2 基础核心组件：`KbIcon` 统一图标组件（二次封装）

为确保全站图标在样式系统下严格受控，杜绝散落硬编码，在 `packages/ui` 中封装唯一的图标组件 **`KbIcon`**。

#### 3.2.1 样式系统约束规范

1. **线宽统一锁定**：全站所有线性图标线宽强制锁定为 `1.5px`（覆盖 Lucide 默认的 `2px`），严格绑定 Token `--kb-icon-stroke-width: 1.5px`；

2. **标准尺寸阶梯**：

   * `xs`: `12px`（辅助极小图标）

   * `sm`: `16px`（**默认尺寸**：表单项内、列表项、行内文字旁）

   * `md`: `20px`（侧边栏导航项、卡片主要操作按钮）

   * `lg`: `24px`（区域大标题旁、状态提醒大图标）

   * `xl`: `32px` / `48px`（空状态插图、特色功能入口）

3. **颜色严格绑定样式系统 Token**：

   * `default`: `var(--kb-color-icon)`（未激活常规图标）

   * `hover`: `var(--kb-color-icon-hover)`（悬停高亮）

   * `primary`: `var(--kb-color-primary)`（品牌主色绿）

   * `success`: `var(--kb-color-success)`（安全清洁、审批通过）

   * `warning`: `var(--kb-color-warning)`（警示、草稿、下架）

   * `error`: `var(--kb-color-error)`（驳回、病毒拦截、删除）

   * `disabled`: `var(--kb-color-text-quaternary)`（禁用置灰）

4. **无障碍集成**：默认自动挂载 `aria-hidden="true"`；当作为交互按钮时，通过组件属性强制要求传入 `ariaLabel`。

#### 3.2.2 组件封装实现（`packages/ui/src/components/icon/KbIcon.vue`）

```
<!-- packages/ui/src/components/icon/KbIcon.vue -->
<template>
  <span
    class="kb-icon"
    :class="[
      `kb-icon--${size}`,
      `kb-icon--${color}`,
      { 'kb-icon--spin': spin }
    ]"
    :style="{
      '--icon-size': sizePx,
      '--icon-stroke': '1.5px'
    }"
    :aria-hidden="!ariaLabel"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
  >
    <component
      :is="iconComponent"
      :size="sizeNumeric"
      :stroke-width="1.5"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as icons from '@lucide/vue';

interface Props {
  name: string; // Lucide 图标名称，如 'FileText', 'Folder', 'ShieldCheck'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'disabled' | 'inherit';
  spin?: boolean;      // 是否开启旋转动效（如加载、杀毒中）
  ariaLabel?: string;  // 按钮或交互图标必填
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  color: 'default',
  spin: false,
});

// 解析图标组件（支持 PascalCase）
const iconComponent = computed(() => {
  const comp = (icons as Record<string, any>)[props.name];
  return comp || icons.HelpCircle;
});

// 尺寸映射
const sizeMap = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };
const sizeNumeric = computed(() => {
  if (typeof props.size === 'number') return props.size;
  return sizeMap[props.size] || 16;
});
const sizePx = computed(() => `${sizeNumeric.value}px`);
</script>

<style scoped>
.kb-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size);
  height: var(--icon-size);
  line-height: 1;
  vertical-align: middle;
}

/* 颜色受样式系统严格约束 */
.kb-icon--default { color: var(--kb-color-icon); }
.kb-icon--primary { color: var(--kb-color-primary); }
.kb-icon--success { color: var(--kb-color-success); }
.kb-icon--warning { color: var(--kb-color-warning); }
.kb-icon--error   { color: var(--kb-color-error); }
.kb-icon--disabled{ color: var(--kb-color-text-quaternary); }
.kb-icon--inherit { color: inherit; }

/* 旋转动效 */
.kb-icon--spin {
  animation: kb-icon-spin 1s linear infinite;
}

@keyframes kb-icon-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

```

#### 3.2.3 业务实体与高频图标标准调用规范

| 业务实体 / 功能场景 | Lucide 图标名 | `KbIcon` 标准调用示例 | 渲染颜色约束 | 
| ----- | ----- | ----- | ----- | 
| **公共知识库** | `Globe` | `<KbIcon name="Globe" color="primary" />` | 品牌主色绿 | 
| **私有知识库（自己的库）** | `Lock` | `<KbIcon name="Lock" color="info" />` | 信息浅蓝 | 
| **分享知识库（他人分享）** | `Share2` | `<KbIcon name="Share2" color="info" />` | 信息色（由 `colorInfo` Seed 派生） | 
| **个人收藏夹** | `Star` | `<KbIcon name="Star" color="warning" />` | 警告色（由 `colorWarning` Seed 派生） | 
| **分类目录（折叠/展开）** | `Folder` / `FolderOpen` | `<KbIcon name="Folder" color="default" />` | 默认图标色 | 
| **正式发布文档** | `FileText` | `<KbIcon name="FileText" color="default" />` | 默认图标色 | 
| **未发布草稿** | `FileEdit` | `<KbIcon name="FileEdit" color="warning" />` | 警告黄 | 
| **历史版本快照** | `History` | `<KbIcon name="History" color="default" />` | 默认图标色 | 
| **差异比对 Diff** | `GitCompare` | `<KbIcon name="GitCompare" color="primary" />` | 品牌主色绿 | 
| **容器冻结锁定** | `Snowflake` / `LockKeyhole` | `<KbIcon name="Snowflake" color="info" />` | 信息蓝 | 
| **杀毒：扫描中** | `Loader2` | `<KbIcon name="Loader2" color="info" :spin="true" />` | 蓝色微旋转 | 
| **杀毒：清洁安全** | `ShieldCheck` | `<KbIcon name="ShieldCheck" color="success" />` | 成功绿 | 
| **杀毒：病毒拦截** | `ShieldBan` | `<KbIcon name="ShieldBan" color="error" />` | 危险红 | 
| **分层分享** | `Share2` | `<KbIcon name="Share2" color="default" />` | 悬停主色 | 
| **反自审拦截提示** | `UserX` | `<KbIcon name="UserX" color="disabled" />` | 禁用灰 | 
| **统一回收站** | `Trash2` | `<KbIcon name="Trash2" color="default" />` | 默认图标色；侧栏只保留一个回收站入口 | 

### 3.3 知识库侧边栏与多级虚拟目录树规范

在知识库四栏一体化工作台中，第一栏与第二栏共同构成了系统的导航与资产索引体系：

#### 3.3.1 第一栏：系统左侧主导航栏规范（极简三图标栏）

* **尺寸与吸顶**：**固定宽度 `64px`（仅图标宽度，恰好容纳 32px 用户圆形头像）**，`sticky top-0 h-screen`，背景色 `var(--kb-color-bg-layout)`，右侧描边 `1px solid var(--kb-color-border)`，纵向居中对齐；

* **极简纯图标菜单（当前仅三个核心图标）**：

  * **顶部品牌 Logo**：`32px × 32px` 企业品牌标识，居中吸顶展示；

  * **中部核心菜单项（自上而下排列，按角色权限动态挂载）**：

    1. **首页**：`<KbIcon name="Home" :size="20" />`（`<a-tooltip placement="right" title="首页">`）；

    2. **知识库**：`<KbIcon name="Library" :size="20" />`（`<a-tooltip placement="right" title="知识库">`）；

    3. **审批中心**：`<KbIcon name="ClipboardCheck" :size="20" />`（`<a-tooltip placement="right" title="审批中心">`，有待办时右上角附带数字角标）；

    4. **用户管理（系统管理员专属）**：`<KbIcon name="Users" :size="20" />`（`<a-tooltip placement="right" title="用户管理">`，仅 `system_admin` 角色可见）；

    5. **系统配置（系统管理员专属）**：`<KbIcon name="Settings" :size="20" />`（`<a-tooltip placement="right" title="系统配置">`，仅 `system_admin` 角色可见）；

  * **单项尺寸与交互**：图标项尺寸为 `44px × 44px` 居中圆角卡片（`var(--kb-border-radius)` 6px）；**界面仅展示图标，不展示任何汉字**，鼠标悬停时通过 AntD 原生 Tooltip 向右浮动提示文字；

  * **激活状态**：图标呈现品牌主色绿 `var(--kb-color-primary)`；

* **底部用户头像区**：固定在侧边栏最底部，展示 `32px × 32px` 用户圆形头像；点击或悬停通过 `<a-popover placement="rightBottom">` 向右展开用户操作浮卡（主题切换、个人设置、退出登录）。

#### 3.3.2 第二栏：资产结构导航卡片规范（`KbAssetNavCard` 无边框彩色卡片）

知识库第二栏（固定宽度 `240px`）承载系统全部知识库与特殊资产集合。第二栏中用于切换不同库与资产结构的卡片，遵循“**无边框、多底色、无文字标签说明**”的核心规范：

##### 1. 核心视觉特征：卡片即容器、无边框与纯色彩直觉辨识

* **卡片即自包含容器（Card as Self-Contained Container）**：第二栏卡片不仅是导航外壳，**卡片的内部就是其对应的内容项集合**。例如知识库卡片内部直接嵌套其下属的一级分类、二级分类与文档列表；草稿箱卡片内部直接嵌套草稿条目；收藏夹与回收站卡片内部直接嵌套其对应的资产项；
* **彻底免除外边框（`border: none !important;`）**：在紧凑的 240px 侧边栏内，卡片外层采用**无边框平铺微卡片设计**，与第二栏背景（`var(--kb-color-bg-layout)`）自然贴合，杜绝粗重线条产生的视觉割裂；
* **色彩即语义，彻底免除文字标签说明**：卡片头部与容器**绝不展示诸如“【公共库】”、“【私有】”、“【我的】”、“【来自他人】”、“【收藏】”等冗余文字 Tag**，用户一眼通过卡片专属底色（浅绿、浅蓝、浅紫、浅金、浅黄、浅红）配合左侧 Lucide 线性图标完成毫秒级认知区分；
* **卡片尺寸与圆角**：卡片外层宽度 `100%` 自适应 240px 容器，默认收起状态高度为 `44px`（资产集合如收藏夹用 `40px`），圆角为 `var(--kb-border-radius)` (`6px`)，内边距为 `8px 12px`。

##### 2. 第二栏六大资产结构卡片图标与内容对照表

| 资产结构类型 | 卡片底色 | 左侧图标搭配 | 卡片内呈现内容 | 点击交互行为 | 
| ----- | ----- | ----- | ----- | ----- | 
| **公共知识库**  (`entity="kb-public"`) | 当前主题的中性底色，无边框 (`border: none`) | `<KbIcon name="Globe" color="primary" />` | • 知识库名称（粗体文字）  • 右侧弱化元数据（文档数/分类数）  • 业务异常时显示冻结标识 | 点击激活选中，下方手风琴展开下属分类目录树；**第三栏主工作区同步显示对应公共库的卡片**（及其直属分类与文档列表） | 
| 私有知识库  （自己的库）  (`entity="kb-private"`) | 当前主题的中性底色，无边框 (`border: none`) | `<KbIcon name="Lock" color="info" />` | • 知识库名称（粗体文字）  • 右侧弱化元数据（文档数/分类数） | 点击激活选中，下方展开私有分类目录树；**第三栏主工作区同步显示对应私有库的卡片**（及其直属分类与文档列表） | 
| 分享知识库  （他人分享的库）  (`entity="kb-shared"`) | 使用 `var(--kb-color-bg-container)` 中性容器底色，**无边框 (`border: none`)** | `<KbIcon name="Share2" color="info" />`，使用 `colorInfo` Seed 派生色 | • 知识库名称  • 右侧以小型头像（`20px`）呈现归属者  • 通过图标标识协同分享 | 点击激活选中，下方展开授权访问的分类目录树；**第三栏主工作区同步显示对应分享库的卡片**（及其直属分类与文档列表） | 
| **收藏夹**  (`entity="favorites"`) | 使用 `var(--kb-color-bg-container)` 中性容器底色，**无边框 (`border: none`)** | `<KbIcon name="Star" color="warning" />`，使用 `colorWarning` Seed 派生色 | • 收藏项总计计数（如 `18`）  • 通过星标图标标识珍藏 | 点击直接在第三栏主工作区呈现当前用户已收藏的全部文档卡片列表 | 
| **草稿箱**  (`entity="drafts"`) | 当前主题的中性底色，无边框 (`border: none`) | `<KbIcon name="FileEdit" color="warning" />` | • 待发草稿统计数（如 `3`） | 点击直接在第三栏主工作区呈现草稿列表，点击条目就地恢复至编辑器 | 
| **回收站**  (`entity="trash"`) | 当前主题的中性底色，无边框 (`border: none`) | `<KbIcon name="Trash2" color="error" />` | • 已软删除条目数  • 只显示一个回收站入口 | 点击进入统一回收站列表；每条资产的类型图标紧邻三点菜单左侧 | 

##### 3. 第二栏卡片内部内容结构与交互规范

* **卡片内部内容项格式：图标加名字（Icon + Name）**：
  * 卡片内部所呈现的每一行内容项（分类、文档、草稿、收藏项），结构高度精简纯净，**仅包含“左侧类型图标 + 实体名字”**，无多余冗余文字或字段堆砌；
  * 左侧类型图标严格映射：分类使用 `<KbIcon name="Folder" />`（展开为 `FolderOpen`）、文档使用 `<KbIcon name="FileText" />`、草稿使用 `<KbIcon name="FileEdit" color="warning" />`、收藏使用 `<KbIcon name="Star" color="warning" />`；文字单行超出截断显示省略号；
* **右侧均配置“三点点”（MoreHorizontal ⋯）**：
  * **卡片内部每一个内容项右侧均配置“三点点”更多操作图标**（`<KbIcon name="MoreHorizontal" :size="16" />`），鼠标悬停所在行或常驻显现；
  * 点击“三点点”直接呼出浮动操作菜单，**其菜单项与在第三栏激活选中该实体后所能执行的操作完全一致**，保证第二栏侧边导航与第三栏工作区操作体验零断层；
* **初始无数据状态：呈现加号（`+`）进行快速创建**：
  * **零数据极简原则**：当某个知识库、分类或资产集合**初始没有数据**（例如新创建的私有库下暂无任何分类与文档，或草稿箱内无暂存草稿时），**界面坚决不放复杂的空态插画或冗长说明文字**；
  * **直接在卡片内部呈现一个清爽醒目的加号（`+`）创建入口**（`<KbIcon name="Plus" :size="18" />`）：
    * 视觉表现为轻量虚线圆角微按钮（`border: 1px dashed var(--kb-color-border)`，内边距 `8px`，圆角 `6px`，居中排列）；
    * 鼠标悬停时边框与加号图标变为品牌主色绿 `var(--kb-color-primary)`；
    * 用户点击“加号”后，直接就地呼出快捷新建输入框或弹窗（如库卡片内点击 `+` 呼出“新建分类 / 新建文档”，草稿箱内点击 `+` 立即在第三栏原地打开空白编辑器进入起草流程），实现“无数据即创作引导”的敏捷闭环；
* **激活与展开过渡**：
  * 当前选中的卡片或内容项左侧呈现 `3px` 宽的主色高亮指示条；
  * 展开内部内容时通过 `@formkit/auto-animate` 或 `motion-v` 平滑顺畅滑出，折叠箭头平滑旋转 `90°`。

#### 3.3.3 第二栏下属多级虚拟目录树（`KbCategoryTree` 二次封装）

挂载在第二栏当前激活选中的知识库卡片下方，基于 Ant Design Vue 原生 `<a-tree :virtual="true">` 深度封装，承载海量目录与文档秒级渲染：

```
<!-- packages/ui/src/components/tree/KbCategoryTree.vue -->
<template>
  <div class="kb-category-tree" role="tree">
    <!-- 1. 初始无数据状态：直接呈现加号 (+) 快捷创建按钮 -->
    <div v-if="treeData.length === 0" class="empty-add-container">
      <a-tooltip placement="right" :title="emptyTooltipText">
        <button
          type="button"
          class="empty-plus-btn"
          aria-label="快速创建"
          @click="$emit('quick-create')"
        >
          <KbIcon name="Plus" :size="18" color="default" class="plus-icon" />
          <span class="plus-text">新建内容</span>
        </button>
      </a-tooltip>
    </div>

    <!-- 2. 有数据时呈现虚拟目录树：内容行均为 [图标] + [名字] + [右侧三点点] -->
    <a-tree
      v-else
      :tree-data="treeData"
      :virtual="true"
      :height="treeScrollHeight"
      :draggable="canDrag"
      :block-node="true"
      @drop="handleDrop"
      @select="handleSelect"
    >
      <template #title="{ dataRef }">
        <!-- 树节点容器：极简 [图标] + [名字] + [右侧三点点] -->
        <div class="tree-node-item group">
          <!-- 左侧对应实体图标 -->
          <KbIcon
            :name="getNodeIconName(dataRef)"
            :color="getNodeIconColor(dataRef)"
            class="node-icon"
          />
          <!-- 中间实体名称 -->
          <span class="node-title truncate" :title="dataRef.title">{{ dataRef.title }}</span>


          <!-- 右侧三点点图标：点击弹出可操作项，与第三栏选中激活后的操作项完全一致 -->
          <a-dropdown :trigger="['click']">
            <span class="node-actions-trigger opacity-0 group-hover:opacity-100" @click.stop>
              <KbIcon name="MoreHorizontal" :size="16" />
            </span>
            <template #overlay>
              <a-menu @click="handleNodeAction($event, dataRef)">
                <!-- 针对不同实体类型动态渲染与第三栏完全相同的操作菜单 -->
                <component :is="renderNodeMenuItems(dataRef)" />
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-tree>
  </div>
</template>

```

##### 关键业务交互规则

1. **严格三级结构深度约束**：

   * 结构为：**知识库（顶级容器）** → **一级分类（`depth: 1`）** → **二级分类（`depth: 2`）** → **文档**；

   * 分类深度严格拦截在最多 2 层，二级分类下禁止再创建或拖入子分类，仅允许挂载文档。

2. **只读占位节点（样式不作特殊处理）**：

   * 当用户仅被单独授权某篇深层文档（或单个二级分类），而未获得其父分类或知识库的直接访问权限时，其祖先链节点在目录树上正常呈现，**不附加虚线框或灰化等特殊视觉样式，样式不做特殊处理**，保持整棵树视觉结构的一致性与整洁感；

   * **交互与权限约束**：占位节点只起层级路径引导与容器展开折叠作用，用户可以点击展开其内部具有访问权限的下属子项；但占位节点本身禁止重命名、编辑、删除、新建子分类、添加文档或拖拽移动。

3. **拖拽安全防成环与跨区拦截**：

   * 拖拽分类时，前端基于树拓扑即时检验，阻断将节点拖拽至其自身的子孙节点下方（防成环）；

   * 跨知识库移动或跨区划转时，弹出二次确认或提审弹窗；若目标容器处于 `is_frozen` 冻结状态，光标呈现禁止图标并阻断释放；

   * 拖拽失败或后端校验拦截时，利用 `motion-v` 物理弹簧平滑回弹至初始位置。

### 3.4 全局搜索与内容展示组件

#### 3.4.1 全局搜索框与建议面板

* **常规尺寸**：高度 `40px`，胶囊圆角（`9999px`），内嵌 `Search` 图标；

* **首页加大版**：首页中央加大为高度 `48px`，最大宽度 `640px`；

* **搜索建议面板**：悬浮下拉面板，阴影 `var(--kb-box-shadow)`，分层展示“最近搜索记录（带一键清除）”、“热门标签推荐”与“即时联想候选词”；

* **搜索下展动效**：在首页聚焦输入时，下方菜单卡片平滑淡出，搜索结果区利用 `motion-v` 向上无缝展出。

#### 3.4.2 第三栏主工作区业务卡片规范（`KbUnifiedCard` 内容展示卡片）

知识库第三栏（自适应主工作区）在未进入单篇文档就地阅读状态时，用于以卡片流形式展示当前选中层级的内容。**如果第二栏选中的是“库层级”（公共库、私有库或分享库）或分类级，第三栏顶部首要位置必须展示对应的卡片**，下方再平铺展示该库或分类包含的分类与文档。第三栏所有内容卡片统一带悬停微上浮动效：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [类型图标]  [知识库 / 分类 / 文档标题]                        [右侧操作 ⋯]   │
│ 描述说明文本、摘要片段或正文前 100 字纯文本节选...                            │
│ 👤 作者/所有者 · 📁 归属路径 · 🕐 更新时间 · 👁 阅读量/文档数 · [业务标签/标识] │
└─────────────────────────────────────────────────────────────────────────────┘

```

##### 1. 第三栏三大核心实体卡片差异化规范

| 卡片实体类型 | 容器背景 Token 与色块 | 边框与图标搭配 | 对应展示的元信息字段集合 | 交互行为与呈现规则 | 
| ----- | ----- | ----- | ----- | ----- | 
| **知识库卡片**  (`entity="kb"`) | 使用当前主题 `var(--kb-color-bg-container)` 中性容器底色 | 图标：公共库用 `Globe`、私有库用 `Lock`、分享库用 `Share2`；分别复用 `colorPrimary`、`colorInfo` 对应的 Seed 派生色 | • 知识库名称与简介描述  • 所有者/创建人信息（头像+昵称）  • 分类总数 & 文档总数  • 审批开关标识（`approval_required`）  • 容器冻结标识（`is_frozen`）  • 最后更新时间 | **第二栏选中库层级时，第三栏首要呈现该库卡片**，作为该库的概览看板；右上角提供快捷操作（分享、新建一级分类、库设置）；卡片下方平铺该库的一级分类与直属文档卡片 | 
| **分类卡片**  (`entity="category"`) | &lt;span style=&quot;display:inline-block;width:14px;height:14px;background-color:#F3F4F6;border-radius:2px;border:1px solid #D1D5DB;vertical-align:-2px;&quot;&gt;&lt;/span&gt; `var(--kb-color-fill-secondary)`  (中性浅灰底 `#F3F4F6`，深色 `#1F1F1F`) | 图标：`<KbIcon name="Folder" />` (默认灰色) | • 所属父级分类/知识库路径  • 下属子分类数 & 下属文档数  • 最后更新时间 | 点击向下展开进入该二级子分类，刷新第三栏文档列表；支持拖拽排序 | 
| **文档卡片**  (`entity="document"`) | &lt;span style=&quot;display:inline-block;width:14px;height:14px;background-color:#FFFFFF;border-radius:2px;border:1px solid #D9D9D9;vertical-align:-2px;&quot;&gt;&lt;/span&gt; `var(--kb-color-bg-container)`  (标准容器纯白底 `#FFFFFF`，深色 `#141414`) | 图标：`<KbIcon name="FileText" />` (草稿为 `FileEdit`) | • 文档标题与正文前 100 字摘要  • 作者头像与昵称  • 状态 Tag（已发布/草稿/待审/下架/归档）  • 版本号（如 `v3`）、阅读数、点赞数、更新时间 | **点击直接在第三栏就地渲染呈现 Markdown 正文进行原地阅读与互动，系统不存在独立的“文档阅读页”，实现无缝原地阅览**（草稿点击进入编辑页） | 

##### 2. 第三栏内容卡片通用视觉参数

* **尺寸与内边距**：内边距统一为 `var(--space-md)` (`16px`)，圆角统一为 `var(--kb-border-radius-lg)` (`8px`)；

* **边框与阴影**：统一带 `1px solid var(--kb-color-border)` 标准细边框，鼠标悬停时触发 `translateY(-2px)` 微上浮并叠加阴影 `var(--kb-box-shadow-tertiary)`；

* **右侧统一操作区**：悬停时显现快捷操作图标组（快捷分享 `<KbIcon name="Share2" />`、更多操作菜单 `<KbIcon name="MoreHorizontal" />`）。

#### 3.4.3 文档目录大纲组件（TOC）

* **宽度与定位**：固定宽度 `200px`，在知识库第三栏就地阅读文档时吸顶展示在正文左侧（`top: 16px`）；

* **滚动联动**：监听 Markdown 正文滚动，利用 IntersectionObserver 实时高亮当前可视区域标题；

* **激活高亮**：当前标题前呈现 `2px` 主色垂直指示条，文字加粗并变为 `var(--kb-color-primary)`；

* **层级缩进**：H1 无缩进，H2 缩进 `12px`，H3 缩进 `24px`，单行超出截断显示省略号。

### 3.5 分层分享弹窗组件（`KbShareModal` 二次封装）

严格贯彻全站**卡片风格（Card Style）**与功能规范 v3.3 的“未配置即继承，配置即独立覆盖”原则。整个分享弹窗本身是一张**悬浮大卡片（Floating Card Modal）**，内部结构采用内嵌子卡片（Card-in-Card）清晰组织：

```
[打开 KbShareModal 弹窗 (传入 targetType, targetId)]
                        │
                        ▼
               【异步拉取当前节点 permissions 配置】
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
    当前模式为“继承上级”           当前模式为“覆盖上级”
    - 展示父级有效权限摘要           - 回显当前配置的名单
    - 人员选择器禁用或隐藏           - 成员名单可为空（空名单=明确拒绝所有人）
            │                       │
            └───────────┬───────────┘
                        ▼
                [用户切换模式并保存]
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
      保存为“继承上级”               保存为“覆盖上级”
      DELETE /api/v1/permissions    POST /api/v1/permissions
      删除覆盖标记，恢复继承父级      保存覆盖标记（空名单明确拒绝访问）

```

#### 组件核心表单项与交互规则

1. **访问模式切换（下拉选择器 `<a-select>`）**：

   * 访问模式统一采用标准的 Ant Design Vue 下拉选择器 `<a-select>` 呈现（高度 `36px`），包含以下两个明确选项：

     * **选项 A：继承上级（`inherit`）**：默认选项，下拉框显示文案“继承上级权限”。选中后下方以只读形式回显父级有效权限摘要（例如“当前继承自父分类 \[技术架构部\] 的权限：全员可读”），同时将下方人员选择器禁用或隐藏。保存时向后端发送 `DELETE /api/v1/permissions` 请求清除当前节点覆盖标记，恢复向上继承；

     * **选项 B：覆盖上级（`override`）**：下拉框显示文案“独立覆盖配置”。选中后解除与上级的权限继承，激活下方的人员选择器与权限级别下拉框，允许针对当前节点独立配置授权名单。保存时向后端发送 `POST /api/v1/permissions` 持久化覆盖名单。

2. **授权权限级别（下拉 Select）**：

   * `reader`（可阅读：浏览正文、看历史快照、全文搜索、下载安全附件、评论、点赞收藏）；

   * `editor`（可编辑：包含 reader 全部权限，允许编辑草稿、上传附件、提交发布审批）。

3. **分享成员选择器（多选 Select）**：

   * 异步检索用户列表，支持按用户名/邮箱搜索；

   * **关键业务防呆**：**覆盖模式下，允许成员名单为空。空名单表示“除所有者与超级管理员外，拒绝所有被分享用户访问”**。界面必须展示醒目的琥珀色提示横幅：“当前覆盖名单为空，除所有者外任何被分享成员均无权访问本节点”。

### 3.6 Markdown 编辑器与附件流水线组件（`KbMarkdownEditor` & `KbAttachmentPanel`）

#### 3.6.1 编辑器核心交互（Vditor IR 模式）

* **模式锁定**：固定为即时渲染模式（Instant Rendering, IR），底层单一真实输出标准 Markdown 字符串，不再提供冗余的双模式切换。

* **防丢稿机制（5 秒节流暂存）**：

  * 前端通过带 `maxWait: 5000ms` 的节流监听用户输入，持续高频输入下每 5 秒必须向本地 IndexedDB（`idb` 库）写入一次最新草稿；

  * 右上角状态文字实时反馈：“5秒前已保存至本地” / “正在同步至服务端...”；

  * 绑定 `recovery_epoch`，异常崩溃刷新后弹出提示框：“检测到未保存的本地草稿，是否恢复？”。

#### 3.6.2 附件管理与杀毒 4 态流水线（`KbAttachmentPanel`）

* **解耦原则**：物理文件（`file_blobs`）与业务引用（`attachment_refs`）彻底分离。草稿中删除附件仅删除草稿引用，线上发布版本与历史快照零裂图。

* **三道防线预检**：

  * 客户端预检：限制文件扩展名白名单与单文件大小上限（如 50MB）；

  * 秒传去重：计算文件 SHA-256 哈希，若服务端已存在对应 Blob，直接复用创建引用，呈现“秒传成功”提示；

  * **3 秒异步杀毒轮询**：新上传文件初始呈现 `<KbIcon name="Loader2" :spin="true" color="info" />`（`pending` 扫描中，暂阻断下载）；通过定时器轮询杀毒接口，转为绿色盾牌 `<KbIcon name="ShieldCheck" color="success" />`（`clean` 安全）后方可点击下载；若检测为 `infected` 或 `failed`，呈现红标警示并强制锁定禁止下载。

#### 3.6.3 标签输入组件

* **数量上限**：单篇文档严格限制最多 8 个标签，达到 8 个后输入框置灰并提示“已达标签上限”；

* **联想隔离**：候选词联想下拉仅聚合**公共知识库已发布**的有效标签，绝对严禁刺探和展示私有库的标签词汇。

### 3.7 差异比对器组件（`KbDiffViewer`）

基于 `diff-match-patch` 算法封装的高性能双栏/行内比对器，支持以下四大业务场景：

```
┌─────────────────────────────────────────────────────────────┐
│  KbDiffViewer 差异比对面板                                   │
│  [左右双栏对比模式] [单栏行内比对模式]                        │
├──────────────────────────────┬──────────────────────────────┤
│  基准版本 (Base Version: v2)  │  待审/修改版本 (Target: v3)   │
├──────────────────────────────┼──────────────────────────────┤
│  第 1 行 原文内容             │  第 1 行 原文内容             │
│  第 2 行 [旧内容已删除]       │  第 2 行 [+新修改高亮内容]    │
│  第 3 行 ...                 │  第 3 行 ...                 │
└──────────────────────────────┴──────────────────────────────┘

```

1. **比对模式**：支持“左右双栏对比（Side-by-Side）”与“行内合并比对（Inline）”切换，左右双栏滚动轴平滑同步；

2. **差异标识规范**：

   * **新增内容**：浅绿背景（`var(--kb-color-success-bg)`），行号旁带 `+` 号；

   * **删除内容**：浅红背景（`var(--kb-color-error-bg)`），行号旁带 `−` 号；

   * **行内修改**：整行带微弱底色，针对字符级变更进行深色高亮标记。

3. **四大应用场景适配**：

   * **场景 A：审批中心单据审阅**：表格行展开呈现正文变更，底部提供“通过”及“必填驳回理由”；

   * **场景 B：乐观并发冲突覆盖（HTTP 409）**：当他人抢先发布递增线上版本后，提交发布自动弹出冲突比对卡片，审阅无误后点击“确认覆盖发布”；

   * **场景 C：历史快照版本追溯**：在知识库第三栏就地阅读文档时打开历史快照抽屉，对比任意历史版本与线上当前版本；

   * **场景 D：跨区/跨所有者划转元数据比对**：比对资产归属人、目标知识库、可见性范围变更卡片。

### 3.8 社交互动与楼中楼两级评论组件（`KbCommentThread`）

#### 3.8.1 点赞、收藏与阅读计数

* 详情页操作栏采用胶囊圆角按钮（`height: 36px`，`rounded-full`）；

* **已点赞**：图标变为实心绿；

* **已收藏**：图标变为实心绿色星标；

* **阅读量**：纯文本展示，同一用户 5 分钟内重复刷新仅计 1 次。

#### 3.8.2 楼中楼两级评论树

严格对齐功能规范附录 A `comments` 实体的楼中楼两级设计：

* **层级结构**：

  * **一级评论（Root Comment）**：针对文档本体的评论，左侧展示 32px 用户头像、昵称、发布相对时间（如“2小时前”）、评论正文，底部带“回复”按钮；

  * **二级回复（Sub Reply）**：针对一级评论的回复，在对应一级评论下方缩进 `40px`，浅色背景嵌套展示，格式为“李四 回复 张三：具体回复内容”；

  * **深度硬约束**：回复深度严格限制为 2 级，对二级评论的回复在视觉与数据上仍平铺挂载在所属一级评论下方（通过 `@用户昵称` 标识）。

* **软删除占位表现**：

  * 当评论作者或管理员删除某条评论后，如果其下存在子回复，该条评论正文变为灰色斜体占位字：“*该评论已被作者删除*”（`var(--kb-color-text-quaternary)`），保留其楼层骨架，不破坏子回复的树状上下文。

# 4. 页面布局与端到端业务流程

本章将前三章所确立的设计基础、CSS 变量、组件规范及卡片化体系全面付诸实践，详细规范企业知识库系统的各个核心业务页面、四栏一体化工作台、就地编辑与阅读交互、审批中心及统一回收站（个人/公共范围筛选）的端到端真实业务流转。

---

### 4.1 首页门户（系统菜单卡片与最近动态流）

首页门户作为用户进入知识库系统的统一引导看板，采用**单栏居中卡片化工作台架构**（页面大背景 `var(--kb-color-bg-layout)`），兼顾沉浸式搜索与核心业务入口的一触即达。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] 企业知识库门户                                    [主题切换] [🔔] [👤] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                    ┌───────────────────────────────────┐                    │
│                    │ 🔍 搜索知识库、文档或标签...  [⌘K] │                    │
│                    └───────────────────────────────────┘                    │
│                                                                             │
│  【系统核心菜单卡片】(系统管理员额外增加用户管理与系统配置卡片)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 📚 知识库     │ │ 📋 审批中心   │ │ 👥 用户管理   │ │ ⚙️ 系统配置   │        │
│  │ 进入工作台... │ │ 待审流转(3)...│ │ (管理员专属) │ │ (管理员专属) │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                             │
│  【最近查看的文档】                       【编辑中的草稿】                  │
│  ┌──────────────────────────────┐        ┌──────────────────────────────┐   │
│  │ 📄 技术方案与架构规范 (v1.4)  │        │ 📝 权限体系重构方案草案       │   │
│  │ 📁 技术架构部 · 🕐 10分钟前   │        │ 📁 技术架构部 · 🕐 5秒前已暂存 │   │
│  └──────────────────────────────┘        └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.1 顶部极简状态栏规范

* **高度与定位**：高度 `56px`，`sticky top-0 z-[200]`，背景采用半透明毛玻璃或纯净底色（`backdrop-blur-md bg-[var(--kb-color-bg-layout)]/80`），底边带 `1px solid var(--kb-color-split)`；
* **左侧品牌区**：展示 `32px × 32px` 企业品牌 Logo 与系统中文名称“企业知识库”，字号 `16px` / 加粗 600；
* **右侧操作区**：
  * **深浅色主题切换**：`<a-button type="text">` 内嵌 `<KbIcon :name="isDark ? 'Sun' : 'Moon'" />`，切换无闪烁；
  * **消息通知徽章**：`<a-badge :count="unreadCount">` 内嵌 `<KbIcon name="Bell" />`，点击滑出悬浮通知微卡片；
  * **用户头像区**：`32px` 圆形头像，悬停向右下弹出用户卡片（包含姓名、所属部门、全局角色 Tag、退出登录）。

#### 4.1.2 垂直居中搜索体验（`⌘K` 联动）

* **输入框规范**：高度 `48px`，最大宽度 `640px` 水平居中，圆角 `9999px` 胶囊卡片，内嵌搜索图标与键盘快捷键提示 `<kbd>⌘K</kbd>`；
* **聚焦下展交互动效**：
  * 当用户鼠标聚焦或敲击键盘 `⌘K` 时，输入框保持原位，下方通过 `motion-v` 顺滑展开一块**卡片式搜索建议浮层**（深度阴影 `var(--kb-box-shadow)`，圆角 `12px`）；
  * 面板内分三行呈现微卡片：“最近搜索词（带一键清空）”、“全员热门公共标签（上限 8 个）”与“即时联想关键词列表”；
  * 敲击 `Enter` 或点击结果后，平滑过渡至四栏知识库并锁定搜索目标。

#### 4.1.3 下方网格卡片区（系统菜单卡片与最近动态流）

下方内容区最大宽度锁定为 `1200px` 水平居中，采用标准响应式栅格（`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`）：

##### 1. 核心系统菜单卡片（System Menu Cards）

严格遵循用户指示，首页网格核心呈现系统菜单卡片，并根据当前用户角色动态加载：

| 系统菜单卡片 | 适用角色 | 卡片外观与底色 | 图标与核心内容 | 点击跳转目标 |
| :--- | :--- | :--- | :--- | :--- |
| **知识库** | 全员用户 | 浅草绿底 `var(--kb-color-primary-bg)`<br>带 1px 细边框与悬停微上浮 | `<KbIcon name="Library" :size="24" color="primary" />`<br>• **标题**：知识库<br>• **描述**：浏览全员公共库、个人私有库与他人共享知识资产 | 进入四栏一体化工作台，默认选中第一项知识库 |
| **审批中心** | 全员用户 | 信息浅蓝底 `var(--kb-color-info-bg)`<br>带 1px 细边框与悬停微上浮 | `<KbIcon name="ClipboardCheck" :size="24" color="info" />`<br>• **标题**：审批中心<br>• **状态**：显示待处理单据条数（如 `3 条待审`） | 跳转两栏审批中心页面 |
| **用户管理** | **系统管理员<br>(`system_admin`) 专属** | 当前主题中性容器底色 `var(--kb-color-bg-container)`<br>带 1px 细边框与悬停微上浮 | `<KbIcon name="Users" :size="24" color="info" />`（使用 `colorInfo` Seed 派生色）<br>• **标题**：用户管理<br>• **描述**：组织架构管理、全员三级角色授权与账号冻结 | 跳转平台用户治理后台 |
| **系统配置** | **系统管理员<br>(`system_admin`) 专属** | 警告浅琥珀底 `var(--kb-color-warning-bg)`<br>带 1px 细边框与悬停微上浮 | `<KbIcon name="Settings" :size="24" color="warning" />`<br>• **标题**：系统配置<br>• **描述**：全局公共库治理、审批流配置、杀毒监控与审计日志 | 跳转系统全局配置后台 |

##### 2. 紧随其后的最近动态流（最近查看与最近草稿）

系统菜单卡片后，紧密衔接用户个人的实时工作动态：
* **最近查看的文档卡片（Recently Viewed）**：
  * 标准白底卡片（`var(--kb-color-bg-container)`），带 1px 细边框；
  * 左侧展示 `<KbIcon name="FileText" />`，展示文档标题、所属分类路径、最后阅读时间戳；
  * **点击行为**：点击后直接跳转进入知识库页面，并在第三栏原地呈现 Markdown 正文进行无缝阅览；
* **最近编辑的草稿卡片（Recent Edited Drafts）**：
  * 浅琥珀底微卡片（`var(--kb-color-warning-bg)`），带浅琥珀边框；
  * 左侧展示 `<KbIcon name="FileEdit" color="warning" />`，展示草稿标题、未保存/本地暂存时间（如“3分钟前已暂存”）；
  * **点击行为**：点击后直接跳转进入知识库，并在第三栏就地恢复为 Vditor IR 草稿编辑器继续编写。

---

### 4.2 知识库一体化工作台（四栏架构端到端交互闭环）

知识库是全系统的核心生产力中枢，全站采用严谨固定的**四栏一体化工作台（Four-Column Workspace）**，实现“导航检索、资产目录、就地阅览、智能问答”同一视口内的无缝闭环：

```
┌──────┬──────────────────┬─────────────────────────────────────┬──────────────┐
│ 栏 1 │ 栏 2             │ 栏 3 (自适应主内容工作区)            │ 栏 4 (360px) │
│ 64px │ 240px 资产侧栏    │ [库卡片概览 / 内容卡片流 / 原地阅读]  │ AI 智能问答   │
├──────┼──────────────────┼─────────────────────────────────────┼──────────────┤
│ Logo │ [🌐 公共库]  │ ┌─────────────────────────────────┐ │ 🤖 AI 助手   │
│      │ [🔒 私有库]  │ │ 知识库卡片看板 (选中库层级时呈现) │ │              │
│ 首页 │ [↗ 分享库]  │ └─────────────────────────────────┘ │ 上下文：     │
│ 📚   │ [☆ 收藏夹]  │ ┌───────┐ ┌───────┐ ┌─────────────┐ │ 当前正在阅读 │
│ 📋   │ [✎ 草稿箱]  │ │分类卡片│ │分类卡片│ │已发布文档卡片│ │ 《技术规范》 │
│ (👥) │ [🗑 回收站]  │ └───────┘ └───────┘ └─────────────┘ │              │
│ (⚙️)  ├──────────────────┤ ----------------------------------- │ [输入问题...]│
│      │ 3级目录虚拟树     │ 点击文档直接就地替换为：            │              │
│ 👤   │ [📁分类] [⋯]     │ 📖 Markdown 原地正文阅读 (无跳转!)  │ [一键总结全文]│
│      │   [📄文档] [⋯]   │    + 200px 吸顶 TOC 大纲            │              │
└──────┴──────────────────┴─────────────────────────────────────┴──────────────┘
```

#### 4.2.1 第一栏：64px 极简主菜单栏规范

* **物理参数**：固定宽度 `64px`，`h-screen sticky top-0`，背景 `var(--kb-color-bg-layout)`，右侧描边 `1px solid var(--kb-color-border)`；
* **菜单图标按权限动态挂载**：
  * 普通用户与库管理员：展示 3 个核心菜单（首页 `Home`、知识库 `Library`、审批中心 `ClipboardCheck`）+ 底部头像；
  * **系统管理员（`system_admin`）比其他角色额外增加两个系统菜单**：用户管理（`<KbIcon name="Users" />`）与系统配置（`<KbIcon name="Settings" />`）；
* **交互标准**：纯图标呈现，绝无汉字；悬停通过 AntD 原生 Tooltip 向右展示菜单名，点击快速切换应用主视图。

#### 4.2.2 第二栏：240px 资产导航侧边栏交互规范

* **物理参数与卡片即容器哲学**：
  * 固定宽度 `240px`，纵向平铺 6 大资产结构无边框微卡片（收起时默认高 `44px`，`border: none`），统一使用当前主题的中性底色；通过资产图标与文字标签区分公共库、私有库、分享库、收藏夹、草稿箱和唯一的回收站入口，不以自定义底色色阶区分；
  * **卡片内部就是对应的内容**：每个资产卡片不仅是导航项，更是承载其子项内容的容器。展开后，该卡片内部直接嵌套呈现其挂载的具体内容项（分类、文档、草稿、收藏等）；
* **卡片内部内容项格式：图标加名字（Icon + Name）**：
  * 卡片内部所包含的内容条目，每一行均以极简的 **`[图标] [名字]`** 形式呈现，不添加任何多余的次要文字标签或修饰，保持侧边栏信息密度的纯粹与高可读性；
  * 图标严格对应实体语义：分类使用 `<KbIcon name="Folder" />`、文档使用 `<KbIcon name="FileText" />`、草稿使用 `<KbIcon name="FileEdit" color="warning" />`、收藏使用 `<KbIcon name="Star" color="warning" />`；业务图标色使用官方 Seed 算法派生的语义 Token，不扩展色阶；
* **右侧均配置“三点点”（MoreHorizontal ⋯）更多操作图标**：
  * **卡片内部每一个内容项右侧均配置“三点点”图标（`<KbIcon name="MoreHorizontal" />` ⋯）**，悬停或常驻可点击，呼出卡片式浮动下拉菜单；
  * **严格一致性原则**：**第二栏三点点呼出的可操作项，与在第三栏激活选中该实体后所能操作的项完全一致**：
    * **知识库节点 ⋯**：分享设置（弹出 `KbShareModal` 卡片）、新建一级分类、新建文档、编辑库信息、冻结/解冻（管理员）、转让所有权；
    * **分类节点 ⋯**：新建子分类、新建文档、重命名分类、移动分类（弹出移动卡片）、删除分类、独立权限配置；
    * **文档节点 ⋯**：编辑草稿、分享文档、移动文档、申请下架、申请归档、移入回收站；
* **初始无数据状态：直接呈现加号（`+`）进行快捷创建**：
  * **零冗余极简空态**：当某个知识库、分类或资产集合**初始没有数据**（例如新创建的知识库暂无分类/文档，或草稿箱内无草稿）时，**卡片内部坚决不放任何占位插图或冗长文本**；
  * **直接在卡片内部呈现一个加号（`+`）按钮（`<KbIcon name="Plus" />`）**：
    * 外观采用轻量虚线卡片设计（`border: 1px dashed var(--kb-color-border)`，内嵌 `Plus` 图标与“新建内容”提示）；
    * 鼠标悬停变色高亮，点击立即呼出就地快速创建输入框或新建弹窗，实现从空态到创作的一步直达。

#### 4.2.3 第三栏：自适应主工作区（层级看板与就地阅读闭环）

第三栏是用户阅读、管理与创作的核心舞台，根据第二栏选中的层级动态切换工作区模式：

##### 1. 第二栏选中“库层级”时：第三栏呈现库卡片看板与直属列表

* **顶部展示对应库卡片（`KbUnifiedCard` with `entity="kb"`）**：
  * 卡片统一采用当前主题的中性容器底色，带有工作区标准 1px 细边框；
  * 呈现库标题、描述说明、所有者头像/昵称、分类与文档总数、更新时间、审批要求与冻结标识；
  * 右上角提供与第二栏三点点完全相同的快捷管理按钮（分享设置、新建分类、库设置）；
* **卡片下方平铺直属内容**：以网格卡片流平铺展示该库直属的一级分类卡片（灰底）以及挂载的文档卡片（白底）。

##### 2. 第二栏选中“分类层级”时：呈现分类看板与子项

* 顶部呈现分类卡片及所属知识库的面包屑路径，下方平铺展示二级子分类卡片与下挂文档卡片。

##### 3. 点击文档时的就地原地阅览体验（彻底取消独立阅读页）

* **原地切换**：无论在第二栏树上点击文档，还是在第三栏卡片列表中点击文档卡片，第三栏**直接就地平滑渲染呈现 Markdown 正文，绝对不跳转独立的“阅读页”**：
  * **顶部阅读操作条**：显示文档标题、作者信息、发布版本 Tag（如 `v3`）、更新时间，右侧整合胶囊点赞、收藏星标、分享及“申请编辑”按钮；
  * **左侧 200px 吸顶 TOC 大纲**：随正文滚动利用 `IntersectionObserver` 实时高亮当前小节，点击平滑平移定位；
  * **正文底部楼中楼评论卡片（`KbCommentThread`）**：紧随文章结尾，支持发表评论、二级回复与点赞。

#### 4.2.4 第四栏：360px AI 智能对话框

* **空间定位**：固定宽度 `360px`，吸附在主内容工作区右侧，提供顶部折叠按钮（`<KbIcon name="PanelRightClose" />`）与悬浮展开入口；
* **上下文智能感知**：自动监听第三栏当前正处于阅览或编辑状态的实体：
  * 当第三栏在阅读文档时，AI 框顶部自动显示当前关联文档名胶囊标签，并提供预置快捷 Prompt：“一键提取全文摘要”、“分析核心架构决策”、“列出行动清单”；
  * 当第三栏在库看板时，AI 框自动绑定该知识库上下文，支持跨文档语义问答。

---

### 4.3 文档就地草稿编辑与发布端到端流程

#### 4.3.1 核心原则：与选择文档阅读一样，第三栏改成草稿编辑

贯彻全站极简一致的交互设计，**在线编辑不是一个割裂的“全屏弹窗”或“新开页面”，而是与选择文档阅读完全一样，四栏骨架完全保持不变，仅仅是第三栏的内容区由阅读正文就地切换为草稿编辑器**：

```
[第三栏：浏览已发布文档] ─── 点击“申请编辑 / 继续编辑” ───► [第三栏：就地切换为草稿编辑器]
(第一栏 64px、第二栏 240px、第四栏 360px 结构完全保持不动，实现毫秒级沉浸切换)
```

#### 4.3.2 草稿编辑全生命周期流程

```
[进入第三栏草稿编辑]
         │
         ▼
 【Vditor IR 即时渲染】 ◄─── 每 5 秒节流向客户端本地 IndexedDB 暂存一次
         │                    (绑定 recovery_epoch，异常崩溃即刻无损恢复)
         │
         ├───► 上传附件 ──► 计算 SHA-256 秒传 ──► 3 秒异步杀毒轮询 (未扫阻断下载/安全转绿盾/病毒红标拦截)
         │
         ├───► 选择标签 ──► 严格限制最多 8 个 (候选词仅聚合公共库已发布标签)
         │
         ▼
    [点击“发布”主按钮]
         │
         ▼
  检测所属库审批开关
         │
  ┌──────┴────────────────────────┐
  ▼                               ▼
私有库未开启审批 (`false`)        开启发布审批 (`true` 或公共库)
  │                               │
  ▼                               ▼
直接递增发布正式版本              弹出卡片式提审弹窗 (输入必填提审附言)
(POST /api/v1/documents)          │
第三栏切回原地阅读正文             ▼
Toast 提示“发布成功”             单据进入审批流，当前草稿锁定为 pending 态
```

1. **Vditor IR 编辑模式**：所见即所得即时渲染，支持 Markdown 快捷键与本地粘贴截图上传；
2. **防丢稿本地灾备**：带 `maxWait: 5000ms` 的输入节流，每 5 秒自动将正文快照存入本地 IndexedDB；若用户误关网页重新进入，自动弹出恢复卡片；
3. **服务端物理隔离暂存**：用户未点击发布前，正文仅保存在服务端独立的 `drafts` 草稿表，全员线上已发布的正式版本（`documents` 表）与历史快照完全不受任何未发布修改的影响；
4. **附件流水线卡片化面板（`KbAttachmentPanel`）**：
   * 附件作为内嵌小卡片排列在正文底部；
   * 上传后即时计算 SHA-256 哈希秒传去重；
   * **3 秒异步杀毒轮询**：上传初期显示 `Loader2` 扫描中（阻断下载），接口确认 `clean` 后转为绿盾安全标识开放下载；检测出 `infected` 强行红感叹号报警并锁定。

---

### 4.4 审批中心全流程（两栏卡片化布局与 Diff 审阅）

#### 4.4.1 两栏卡片化布局体系

审批中心专用于治理单据的合规流转，采用**两栏布局**：
* **左侧**：64px 极简图标菜单栏（审批中心图标高亮激活）；
* **右侧主工作区**：最大宽度 `1200px` 水平居中，顶部为审批分类筛选卡片（待我审批、我发起的、历史已归档），下方为审批单据表格卡片。

#### 4.4.2 五类审批单据体系

审批中心统一承载《功能规范 v3.3》定义的五类业务审批：
1. **私有库发布提审（`private_publish`）**；
2. **公共库新建贡献或已发布文档修改提审（`public_contribution` / `public_update`）**；
3. **私有资产移入公共区提审（`move_to_public`）**；
4. **私有资产重新上架提审（`private_republish`）**；
5. **跨所有者移动私有资产提审（`move_cross_owner`）**。

治理下架与垃圾箱恢复属于有权限角色执行的直接治理操作，不创建审批单。审批中心按单据类型展示对应字段，审批通过后的结果也按具体业务呈现，不统一标记为 `published`。

#### 4.4.3 行内展开 Diff 差异比对与反自审强门禁

* **卡片式行内展开比对（`KbDiffViewer`）**：
  * 点击表格任意单据行，下方利用 `@formkit/auto-animate` 顺滑展开一块**卡片式比对大面板**；
  * 面板支持“左右双栏对比”与“单栏行内比对”，浅绿高亮新增字符、浅红高亮删除字符，元数据差异以键值对卡片清晰呈现；
* **反自审强门禁（No Self-Approval）硬约束**：
  * 前端比对当前登录用户 ID 与单据提交人 ID；
  * **当审批人正是单据提交者本人时**，底部“通过”与“驳回”按钮置灰禁用，并在按钮旁显示“不能审批自己提交的单据”；后端仍须执行硬性反自审校验；
* **乐观并发冲突（HTTP 409 CAS）覆盖流程**：
  * 若审批期间基线版本已变化，审批动作返回 `409 Conflict`；
  * 前端弹出冲突比对卡片，展示最新线上版本与待审版本，并提示“待审内容已过期”。审批人不能直接强制覆盖新版本；须退回申请人基于最新版本更新并重新提交，审批人再审阅新单据。

---

### 4.5 统一回收站治理视图（类型图标位于三点菜单左侧）

#### 4.5.1 唯一回收站入口与统一内容卡片

侧栏只显示**一个回收站导航卡片**。进入后使用一个统一列表卡片呈现当前用户有权查看的个人与公共软删除资产，不为文档、容器或回收范围创建额外回收站卡片。个人/公共范围通过列表顶部的范围筛选切换；列表条目保持同级排列。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🗑️ 回收站 (共 14 项软删除资产)                 [个人 ▾] [公共 ▾] [更多操作] │
│ 提示：软删除资产将在列表中保留 30 天，到期后系统将自动进行不可逆物理销毁。         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 技术私有库       原所属: 根资产 · 删除人: 李四 · 剩 28 天       [🔒][⋯] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 核心算法分类     原所属: AI知识库 · 删除人: 王五 · 剩 19 天     [📁][⋯] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 微服务发布清单.md 原所属: 技术架构部 · 删除人: 张三 · 剩 12 天  [📄][⋯] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 架构设计草稿草案 原所属: 个人草稿 · 删除人: 张三 · 剩 5 天      [📝][⋯] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 4.5.2 回收站卡片列表视觉与交互规范

1. **一个列表容器卡片**：列表项以紧凑行展示，不再为每个资产套一张红色卡片；危险色仅用于临期提示和不可逆操作确认。
2. **类型图标紧邻三点菜单**：每行最右侧固定显示“类型图标 + 三点菜单（`MoreHorizontal`）”，图标位于三点左侧。公共知识库用 `Globe`、私有知识库用 `Lock`、分类用 `Folder`、正式文档用 `FileText`、草稿用 `FileEdit`。类型不能只依赖颜色区分。
3. **保留倒计时信息**：每行展示原所属路径、删除操作人、删除时间及剩余保留天数（如“剩余 12 天自动销毁”）。
4. **三点菜单操作**：菜单提供“还原”和“彻底删除”；彻底删除须二次确认。还原前检查原父级与同名冲突；原位置不可用时要求选择有编辑权限的新位置。恢复动作仅按业务权限直接执行，不创建审批单；关联待审单据取消，恢复后不自动复活旧审批。

---

### 4.6 平台系统治理后台（系统管理员专属视图）

通过左侧 64px 菜单栏中的专属图标，系统管理员（`system_admin`）可一键直达平台治理控制台：

#### 4.6.1 用户管理后台（Users Console）

* **卡片化用户检索列表**：支持按姓名、工号、邮箱、所属部门筛选全员账号；
* **三级全局角色授权卡片**：
  * 支持为任意用户指派全局角色：系统管理员（`system_admin`）、知识库管理员（`kb_admin`）、普通用户（`general_user`）；
  * 提供账号快速“冻结/启用”开关，冻结用户立即被后端踢出登录态并阻断 JWT 刷新。

#### 4.6.2 系统配置后台（Settings Console）

* **公共库治理卡片面板**：
  * 系统管理员可对全员公共库进行权重排序、置顶推荐、跨部门所有者转让及异常容器业务冻结（`is_frozen`）；
* **安全与杀毒引擎监控卡片**：
  * 实时呈现 ClamAV 杀毒引擎的心跳健康度、待扫描任务队列深度与历史拦截病毒统计卡片；
* **穿透式审计日志流（Audit Logs）**：
  * 全站关键操作（登录、权限变更、发布、下架、彻底删除、转让）全量记入审计表；
  * 提供 TraceID 级精准查询，表格行支持展开卡片式查看请求上下文与前后字段 JSON 变更对照。

# 5. 关键跨页面交互与状态流转规则

企业知识库系统作为一个高并发协同、多级权限隔离与严谨审计追踪的企业级生产力中枢，其核心用户体验不仅取决于单个页面的卡片布局，更取决于资产跨页面流转、并发冲突解决、审批流转与安全状态机的严密闭环。

本章严格遵循《设计与功能规范 v3.3》与《技术方案与架构规范 v1.4》，深度规范系统中六大关键跨页面交互与状态流转规则。

---

### 5.1 乐观并发控制与版本冲突流转规则（CAS 机制与 HTTP 409）

在企业多人协同编辑或多端多标签页场景下，为杜绝静默覆盖他人成果的“丢失更新（Lost Update）”灾难，系统采用基于版本号（`version`）的**比较并交换（Compare-And-Swap, CAS）乐观并发控制**机制。

```
[前端草稿提交发布 (带 base_version: 2)]
                    │
                    ▼
           【后端 CAS 版本校验】
    SELECT version FROM documents WHERE id = ?
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
当前线上版本 == 2           当前线上版本 == 3 (他人已抢先发布!)
- 版本递增至 3             - 拦截更新，生成发布快照
- 写入正式文档表           - 返回 HTTP 409 Conflict
- 发布成功 Toast           - 业务错误码 40009
                            │
                            ▼
              【前端拦截器捕获 409 并解析上下文】
                            │
                            ▼
            ┌───────────────────────────────┐
            │ 弹出 KbDiffViewer 冲突比对卡片 │
            │ 左栏: 线上最新版 (v3)          │
            │ 右栏: 本地修改草稿             │
            └───────────────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    [保留草稿，稍后处理]             [确认覆盖发布 (Force)]
    - 维持当前草稿箱状态            - 弹出二次警示确认
    - 留在编辑器继续调整            - 携带 force=true 重新提审
```

#### 5.1.1 触发场景与时序边界

1. **并发竞态场景**：用户 A 与用户 B 同时打开正式文档 `v2` 进行编辑；用户 A 抢先提交并通过发布，线上正式文档版本递增至 `v3`；用户 B 随后点击“提交发布”或“发起发布审批”；
2. **状态拦截**：后端检测到用户 B 提交的基准版本 `base_version: 2` 小于数据库当前最新版本 `3`，立即中断事务并返回：
   * HTTP 状态码：`409 Conflict`
   * 业务状态码：`40009`（`BUSINESS_ERROR`）
   * 响应体携带数据：`{ latestVersion: 3, latestContent: "...", latestUpdater: "张三", latestUpdatedAt: "2026-10-16 14:30:00" }`。

#### 5.1.2 HTTP 409 拦截与卡片式冲突比对（KbDiffViewer Modal）

前端 Axios 响应拦截器识别到 `409` 状态后，**严禁粗暴清空草稿或直接弹错误 Toast 关停**，必须自动激活全屏级**悬浮冲突比对大卡片（`KbDiffViewer` Conflict Modal）**：

1. **弹窗视觉特征**：
   * 采用标准卡片风格大浮层（宽度 `920px`，大圆角 `12px`，细边框 `1px solid var(--kb-color-border)`，深度阴影 `var(--kb-box-shadow-secondary)`）；
   * 顶部带有警告琥珀色状态横幅卡片：`<KbIcon name="AlertTriangle" color="warning" /> 当前文档已被 张三 于 14:30 抢先更新至 v3，检测到版本冲突`；
2. **左右双栏对比展示**：
   * **左栏（线上当前最新版本 v3）**：只读渲染张三发布的线上正式内容，删除内容标红（`var(--kb-color-error-bg)`）；
   * **右栏（您的待发布草稿内容）**：展示当前用户本地待提交的内容，新增内容标绿（`var(--kb-color-success-bg)`）；
   * 双栏滚动条保持垂直位移实时平滑同步。

#### 5.1.3 确认覆盖（Force Overwrite）与安全保留分支

比对卡片底部提供两个明确互斥的操作分支：

* **分支 A：保留草稿，放弃覆盖（默认安全选项）**：
  * 点击“保留草稿”，冲突弹窗关闭，编辑器工作区保持不动，最新草稿仍完好保存在用户草稿箱中；
  * 右上角状态提示：“草稿已安全保留，您可以参考线上最新版手动合并正文”；
* **分支 B：确认覆盖发布（Force Overwrite）**：
  * 若当前用户具备该知识库的管理权限或具备明确覆盖意图，点击“确认覆盖发布”；
  * 界面弹出红色警示气泡卡片进行二次防呆确认：“此操作将把您的草稿作为 v4 强制发布，并覆盖张三的更新内容，是否继续？”；
  * 确认后前端携带 `force=true` 及最新 `base_version: 3` 重新请求接口，完成合法提审或直接发布，操作全程记入审计日志。

---

### 5.2 发布审批全生命周期流转与反自审（No Self-Approval）硬约束

#### 5.2.1 五类审批单据与全生命周期状态机

系统审批工作流覆盖五类业务单据。各单据共用待审批、通过、驳回等流程状态，但审批结果按单据类型执行各自的业务动作；不得把审批记录状态与文档生命周期状态混为一谈：

```
                      ┌─────────────────────────────────────┐
                      │              草稿状态               │
                      │          (status = draft)           │
                      └──────────────────┬──────────────────┘
                                         │ 提交审批
                                         ▼
                      ┌─────────────────────────────────────┐
                      │             待审批流转              │
                      │         (status = pending)          │
                      │   - 挂起审批流，推送通知给审批人      │
                      │   - 文档原正式版保持在线正常供人阅读 │
                      └──────────┬─────────────────┬────────┘
                                 │                 │
                 [审批人点击通过] │                 │ [审批人点击驳回 (必填理由)]
                                 ▼                 ▼
          ┌────────────────────────────┐    ┌────────────────────────────┐
          │          审批通过          │    │          审批驳回          │
          │    (approval = approved)   │    │    (approval = rejected)   │
          │ - 递增版本号并生成发布快照   │    │ - 草稿完好退回申请人草稿箱   │
          │ - 正式替换线上阅读正文     │    │ - 附带驳回原因标签与通知   │
          │ - 清理草稿箱暂存记录       │    │ - 允许修改后再次提审       │
          └────────────────────────────┘    └────────────────────────────┘
```

五类单据审批人判定与前端呈现规则：

| 审批单据类型 | 触发业务场景 | 合法审批人集合 | 审批通过后的底层流转效果 |
| :--- | :--- | :--- | :--- |
| **私有库发布提审** | 私有库开启 `approval_required` | 知识库所有者 (`owner`) 或具备审批权限的知识库管理员 | 发布草稿并生成不可变快照；审批前正式版本保持不变 |
| **公共库贡献/修改提审** | 普通用户新建公共库文档或修改已发布文档 | 具备公共库审批权限的知识库管理员 | 发布新贡献，或按基线版本更新正式文档 |
| **移入公共区提审** | 私有资产申请移入公共库 | 目标公共库合法审批人 | 按目标库规则变更归属与权限 |
| **私有资产重新上架提审** | 私有资产申请重新上架 | 私有库所有者或合法审批人 | 按业务规则恢复可见/可检索状态 |
| **跨所有者移动提审** | 单篇文档或整棵分类移动到其他所有者私有库 | 目标知识库所有者（唯一审批人） | 剥离原私有名单并继承目标库规则 |

#### 5.2.2 反自审（No Self-Approval）的界面与交互强拦截

根据《功能规范 v3.3》第 8 章与《技术规范 v1.4》的安全红线：**任何用户均绝对禁止审批自己发起的单据（No Self-Approval）**。

前端在审批工作台与审批详情卡片中全面落实以下极简强约束：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 审批单号: AP-20261016-0038                   【申请人】: 张三 (技术架构师)  │
│ 业务类型: [公共库文档发布审批]                【提交时间】: 10分钟前          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📄 变更标题: 微服务架构设计治理规范 (v2 -> v3)                               │
│ 📁 目标路径: 技术架构部 / 微服务体系                                         │
│                                                                             │
│ [展开查看 KbDiffViewer 差异比对面板...]                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           [通过] (已置灰🔒)       [驳回] (已置灰🔒)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **判定逻辑**：`isSelfApproval = (currentUser.id === approvalRecord.applicant_id)`；
2. **操作按钮直接置灰**：
   * 当判定为自审（`isSelfApproval === true`）时，详情卡片底部的“通过”按钮与“驳回”按钮**直接强制设置为禁用置灰态**（`<a-button :disabled="true">`）；
   * 按钮样式呈现浅灰底色 `var(--kb-color-bg-container-disabled)` 与禁用文字 `var(--kb-color-text-quaternary)`，鼠标悬停呈现禁止光标（`cursor-not-allowed`）；
   * 在按钮禁用态旁提供可见说明或可访问的描述“不能审批自己提交的单据”，让鼠标、键盘及读屏用户都能理解禁用原因；按钮置灰仅是界面提示，后端仍须执行硬性反自审校验。

#### 5.2.3 驳回理由必填与草稿箱回退联动

1. **驳回必填弹窗卡片**：
   * 审批人点击“驳回”后，弹出居中卡片式模态框（圆角 `8px`，细边框，深度阴影）；
   * 包含必填文本域 `<a-textarea :rows="4" placeholder="请详细输入驳回原因或修改建议（必填，不少于5个字符）..." />`；
   * 若输入少于 5 个字符，输入框下方出现红色微文字报错，提交按钮保持禁用；
2. **草稿箱回退联动**：
   * 审批驳回后，草稿不会被删除，而是安全回退并保留在申请人的“第二栏草稿箱”中；
   * 草稿卡片右侧打上深红底色标签 `<a-tag color="error">已驳回</a-tag>`；
   * 申请人点击草稿重新在第三栏原地打开编辑时，正文顶部出现一条醒目的自包含提示卡片：
     * 展示驳回人昵称、驳回时间与详细驳回理由；
     * 申请人就地针对修改意见调整正文后，可再次点击“重新提交审批”。

---

### 5.3 跨区划转、所有权变更与容器业务冻结（is_frozen）

#### 5.3.1 跨区划转（私有转公共 / 跨部门转让）提审流程

跨区划转是指将个人私有知识库中的分类或文档整体迁入企业公共库，或在公共库的不同部门容器之间迁移。

1. **提审入口**：在第二栏或第三栏点击三点点，选择“划转至公共库”或“转让所有权”；
2. **选择目标容器卡片弹窗**：
   * 弹出自包含卡片式选择弹窗（`KbTransferModal`）；
   * 树状选择目标知识库与目标一级分类；
   * 自动展示划转影响评估（如“本次划转将同步迁移 3 个分类、18 篇文档、45 个附件”）；
3. **提审确认**：点击“提交划转申请”，进入跨区审批流。

#### 5.3.2 容器业务冻结（is_frozen = true）的界面全局呈现与写操作阻断

为防止在跨区划转审核期间内容被篡改产生“时序幻读”，**提审发起瞬间，后端将源节点及其整棵子树标记为 `is_frozen = true`**。

前端在全站各工作区对冻结节点及其下属所有资产实施**全局冻结感知与写操作直接置灰阻断**：

1. **第二栏资产侧栏表现**：
   * **无需蓝底“冻结中”文字标签**：第二栏目录树保持纯净的 `[图标] [名字] [⋯]` 结构，绝不放置任何破坏视觉一致性的蓝底“冻结中”文字 Tag；
   * **拖拽行为严格拦截**：该节点禁止被拖出，亦禁止任何其他节点拖入该节点下方，光标呈现 `not-allowed` 并触发物理微震动反馈；
2. **第三栏主工作区操作阻断**：
   * “新建文档”、“新建子分类”、“编辑草稿”、“删除分类”、“移动位置”等写操作按钮**全部直接置灰禁用（`:disabled="true"`）**，无需多余文字打扰，以纯粹的状态置灰保证不可写入；
3. **读操作完全豁免**：冻结状态下，原文档正文阅读、历史快照追溯、附件安全下载不受任何影响，保持业务连续性。

#### 5.3.3 审批终态处理（自动划转解冻 vs 驳回恢复）

* **审批通过（Approved）**：
  * 后端批量更新资产的归属知识库 ID（`kb_id`）与层级路径，解除 `is_frozen = false`；
  * 全局 WebSocket 广播划转完成通知；
  * 前端静默局部刷新第二栏目录树与第三栏工作区，资产平滑切换至新公共库容器下；
* **审批驳回（Rejected）**：
  * 后端直接重置 `is_frozen = false`，解除全树锁定；
  * 资产留在原私有库位置完好无损，并向申请人推送包含驳回原因的消息通知卡片。

---

### 5.4 资产软删除、30天保留倒计时与统一回收站流转

#### 5.4.1 唯一入口、统一列表与条目类型图标

侧栏只保留一个回收站导航卡片，回收站页面只使用一个列表容器卡片。个人垃圾箱与公共垃圾箱作为同一页面中的范围筛选，不拆成多个导航卡片或内容卡片；列表条目统一平铺。每行最右侧的类型图标紧挨三点菜单左侧，图标类型为公共知识库 `Globe`、私有知识库 `Lock`、分类 `Folder`、正式文档 `FileText`、未发布草稿 `FileEdit`。图标之外仍展示名称与原所属路径，避免仅靠颜色传达类型。

#### 5.4.2 30 天自动销毁倒计时与临期视觉提醒

1. **倒计时计算**：条目剩余保留天数公式：`remaining_days = 30 - floor((now() - deleted_at) / 86400)`；
2. **临期三级视觉告警**：
   * **充裕期（剩余 15 ~ 30 天）**：普通文字显示 `剩余 28 天自动销毁`；
   * **关注期（剩余 7 ~ 14 天）**：使用琥珀色文字并增加非颜色提示；
   * **高危期（剩余 ≤ 3 天）**：使用危险色加粗并增加感叹号图标与文字提示，不使用闪烁动画；
3. **自动物理清空**：达到 30 天整点后，系统定时调度任务执行物理级 Hard Delete，彻底从数据库与对象存储中抹除。

#### 5.4.3 还原时的父级容器校验与“孤儿资产”重定位卡片

用户在回收站点击“还原”时，系统依据其原有所属层级进行智能安全校验，解决经典的“孤儿节点”难题：

```
[用户在回收站点击某项资产的 "还原" 按钮]
                    │
                    ▼
          【检测其原父级容器是否存在】
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   原父级容器仍然完好在线      原父级已被物理删除或不可访问 (孤儿资产!)
        │                       │
        ▼                       ▼
  [原位无损恢复]         [弹出“选择恢复位置”卡片式弹窗]
  - 恢复至原分类路径      - 列出当前用户具有编辑权限的知识库
  - 重新挂载入目录树      - 引导用户选择新的目标分类或知识库根节点
  - 提示恢复成功          - 重新挂载并完成还原
```

1. **正常原位恢复**：若原上级知识库或父分类仍完好在线，直接恢复并在第二栏树上自动高亮闪烁展开；
2. **孤儿重定位卡片（`KbRelocateRestoreModal`）**：
   * 若原父分类已被彻底删除，界面绝不抛错崩溃，而是自动唤起卡片式“重新安置”模态框；
   * 提示文字：“原所属分类 [技术架构部] 已被物理删除，请为该文档选择新的挂载知识库或分类”；
   * 用户选择新的知识库与分类后，资产无缝恢复至新容器中。

---

### 5.5 分层分享权限继承与覆盖动态流转（未配置即继承，配置即覆盖）

#### 5.5.1 继承模式（inherit）与独立覆盖模式（override）的切换与请求时序

系统知识资产权限管理严格贯彻“未配置即继承，配置即独立覆盖”的单一真实源（SSOT）规则。

在任意节点打开 `KbShareModal` 卡片弹窗时，交互与底层数据请求时序严格解耦：

1. **初始拉取态**：
   * 前端调用 `GET /api/v1/permissions?target_type=category&target_id=123`；
   * 若接口返回空数组或 `mode: "inherit"`，弹窗顶部的 `<a-select>` 自动选中 **“继承上级权限”**，下方以浅灰只读卡片形式展示从父链计算出的有效权限摘要；
2. **切换为“独立覆盖”**：
   * 用户在下拉菜单切换为 **“独立覆盖配置”**，浅灰卡片平滑淡出，下方人员搜索器与权限级别下拉框解除禁用激活；
   * 用户添加成员（如将“李四”添加为 `editor` 可编辑）；
   * 点击保存，向后端发送 `POST /api/v1/permissions`，正式写入 `permission_overrides` 物理表，完成上级权限解耦；
3. **恢复为“继承上级”**：
   * 用户重新打开弹窗，将下拉菜单由“独立覆盖”切回“继承上级”；
   * 界面弹出提示卡片：“恢复继承将清空当前节点独立配置的所有人员名单，是否继续？”；
   * 确认保存后，前端发送 `DELETE /api/v1/permissions?target_type=category&target_id=123`，物理清除覆盖记录，重新无缝恢复向上继承。

#### 5.5.2 覆盖模式下“空名单拒绝访问”的琥珀色警示卡片

根据《功能规范 v3.3》第 2.2.1 节的重要防呆原则：**在覆盖模式下，允许授权名单为空；空名单代表除所有者和系统管理员外，明确拒绝所有被分享用户访问**。

为避免用户误解为“公开无限制”，当覆盖名单中的成员被全部删除清空时：

* 弹窗内立即通过 `motion-v` 滑出一条琥珀色自包含告警卡片（`<a-alert type="warning">`）；
* 醒目文案：“`<KbIcon name="ShieldAlert" color="warning" />` 当前覆盖名单为空。依据系统安全隔离规则，除您（所有者）与系统管理员外，其他任何成员均无权访问本节点内容。”；
* 按钮文案强化为 `确认设为仅自己可见并保存`，确保用户知晓其安全意图。

#### 5.5.3 权限变更后的客户端缓存联动与局部静默刷新

当用户保存分享权限配置后：

1. **局部失效，绝不整页重载**：前端通过 Pinia / React Query 发送 `permissionStore.invalidate(targetId)` 信号；
2. **第二栏与第三栏静默局部刷新**：
   * 第二栏目录树针对该节点重新计算其是否属于“只读占位节点”或“全功能节点”；
   * 第三栏工作区卡片右侧的快捷操作栏动态显示/隐藏“编辑草稿”与“分享”按钮；
   * 若当前登录用户的权限由 `editor` 被降级为 `reader`，正在编辑的第三栏草稿编辑器平滑回退为只读阅览态，并弹窗提示权限已变更。

---

### 5.6 离线容灾、网络波动与 5 秒草稿节流暂存时序

#### 5.6.1 客户端 5 秒节流暂存与 IndexedDB 写入时序

在第三栏就地进行 Markdown 草稿创作时，为对抗浏览器意外崩溃、断电或网络闪断，系统建立**内存缓存、IndexedDB 本地持久化与服务端异步同步**三级防线：

```
[用户在 Vditor 编辑器持续键盘敲击输入]
                    │
                    ▼
         【本地内存响应与即时渲染】
                    │
                    ▼
     【lodash.throttle (maxWait: 5000ms)】
                    │
                    ▼
    ┌───────────────────────────────┐
    │ 写入浏览器本地 IndexedDB (idb) │
    │ 存储 key: draft_{doc_id}_{uid}│
    │ 记录 epoch 与本地时间戳        │
    └───────────────┬───────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ 发送网络请求同步至服务端 │
        │ PATCH /api/v1/drafts  │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
    网络正常 (200 OK)       网络中断 / 弱网超时 (Network Error)
    - 更新服务端暂存记录     - 拦截网络报错，禁止弹打扰 Toast
    - 状态栏显示:            - 状态栏转为琥珀色警告卡片:
      "5秒前已同步至云端"      "⚠️ 云端同步失败，正文已安全暂存至本地"
```

1. **节流约束**：持续高频打字时，前端节流器保证每 5 秒（`maxWait: 5000`）至少向本地 IndexedDB 提交一次完整快照，杜绝定时器在停顿前不触发导致的文字丢失；
2. **轻量无感知状态指示**：编辑器右上角常驻极简单行文字，不占用视觉焦点（绿色打勾图标 + “5秒前已保存”）。

#### 5.6.2 断网/弱网状态下的离线卡片横幅与只读降级

1. **网络监听**：全局监听 `window.addEventListener(online | offline)` 与 Axios 网络断网错误；
2. **顶部卡片式离线横幅**：
   * 当网络断开时，工作区顶部顺滑滑出一条琥珀色离线卡片横幅；
   * 文案：“`<KbIcon name="WifiOff" color="warning" />` 当前网络已断开，您仍可继续就地打字编辑，所有内容均已完整保存在您本机的安全离线数据库中”；
3. **操作降级**：离线期间，“提交发布”、“发起审批”、“上传附件”等需要服务端处理的操作按钮自动禁用，防止无谓的网络报错；“存草稿”按钮保持可用并直接存入本地。

#### 5.6.3 异常恢复检测（recovery_epoch）与草稿找回卡片

当用户计算机异常重启、标签页被误关闭或浏览器崩溃，用户重新进入该文档时：

1. **比对时序时间戳**：前端从 IndexedDB 读取本地草稿的 `saved_at`，与服务端返回的草稿 `updated_at` 进行比对；
2. **弹出草稿找回卡片弹窗**：
   * 若本地草稿时间戳晚于服务端（本地含有未同步内容），界面居中弹出精致的**本地草稿恢复卡片（`KbDraftRecoveryModal`）**；
   * 卡片展示本地草稿暂存时间（如“本地草稿保存于 2026-10-16 15:42，包含 3,842 字” vs “云端记录保存于 15:30，包含 3,200 字”）；
   * 提供两个选项：
     * `[恢复本地未同步草稿]`：一键将本地 IndexedDB 内容灌入编辑器，恢复无损现场；
     * `[使用云端记录并丢弃本地]`：清空本地 IndexedDB 缓存，加载云端版本。

# 6. 响应式适配与设计研发交付规范

本章作为整套 UI/UX 规范的收官之章，规范全站跨设备响应式视口适配体系、无障碍（Accessibility / WCAG 2.1 AA）工程落地标准、动效降级保障，以及与前端工程 Monorepo 代码架构（`apps/web`、`packages/ui`、`packages/tokens`）的严格映射契约，确保设计资产在研发阶段实现 100% 高保真还原。

---

### 6.1 多端响应式视口适配方案（Responsive Viewport Adaptation）

为兼顾桌面端高密度知识生产协同与移动场景下的敏捷查阅需求，系统采用**流式栅格与卡片化抽屉联动**的自适应策略，将视口划分为三档标准响应式断点：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. 桌面端 (Desktop: >= 1024px；四栏建议视口 >= 1360px)                       │
│ [64px 菜单] [240px 资产卡片侧栏] [自适应主工作区 / Markdown 就地阅读] [可收起 AI]│
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. 平板端 (Tablet: 768px ~ 1023px)                                          │
│ [64px 菜单] [自适应主工作台 (宽度拉伸)] (点击顶部图标滑出 280px 卡片抽屉)     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. 移动端 (Mobile: < 768px)                                                 │
│ [顶部极简条: ☰ 搜索 👤] ──► 单列垂直卡片流 / 沉浸式阅读正文 (TOC 变为右下角悬浮球) │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 6.1.1 三档标准视口断点与布局形态对照表

| 视口档位 | 宽度断点定义 | 整体布局形态 | 栏 1 (主菜单) | 栏 2 (资产卡片栏) | 栏 3 (主工作区) | 栏 4 (AI 对话框) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **桌面端**<br>(Desktop) | ≥ 1024px（典型 1280~1920px） | 自适应桌面布局；视口宽度达到 1360px 时四栏展开 | 固定吸顶<br>宽度 `64px` | 固定常驻<br>宽度 `240px` | 弹性拉伸居中<br>`min-width: 600px` | 视口不足 `1360px` 时默认收起；展开宽度 `360px` |
| **平板端**<br>(Tablet) | $768	ext{px} \sim 1023	ext{px}$<br>(典型 iPad / 折叠屏) | **双栏/单栏弹性自适应** | 固定吸顶<br>宽度 `64px` | 默认收起为抽屉<br>点击顶部图标滑出 | 占据屏幕主要视口<br>卡片自适应两列排布 | 收起为右下角悬浮气泡<br>点击向上滑出微型卡片 |
| **移动端**<br>(Mobile) | $< 768	ext{px}$<br>(典型 iPhone / Android) | **全屏单列卡片流** | 收起隐藏<br>整合进汉堡菜单 | 收纳于全屏微距卡片抽屉<br>点击左上角 ☰ 展开 | 全屏单列卡片<br>正文 100% 沉浸阅览 | 变为底部 Sheet 对话抽屉<br>需要时滑出覆盖 |

#### 6.1.2 桌面端（Desktop ≥ 1024px）：自适应工作台与按宽度展开的四栏布局

* **按宽度展开四栏**：第一栏（64px 纯图标）、第二栏（240px 无边框资产卡片）、第三栏（最小宽度 600px）与第四栏（360px AI 对话助手）完整布局至少需要 1264px 内容宽度；加上页面间距后以 `1360px` 作为默认完整四栏断点。低于该宽度时 AI 栏默认收起，可由用户手动打开；不得压缩第三栏至低于最小可读宽度。
* **阅读与编辑零页面跳转**：点击文档直接就地替换第三栏渲染 Markdown 正文与 200px 吸顶 TOC 大纲；点击编辑直接在第三栏原地渲染 Vditor IR，保证高密度生产力环境下的极致专注。

#### 6.1.3 平板端（Tablet 768px ~ 1023px）：资产栏与 AI 对话框抽屉化收折

* **第一栏保留**：左侧 64px 极简纯图标栏继续常驻，提供首页、知识库、审批中心一键切换；
* **第二栏抽屉化（`KbAssetNavDrawer`）**：
  * 在平板视口下，第二栏不再挤占宝贵的水平空间，默认收折；
  * 顶部工作区左侧显现“资产目录”卡片图标按钮，点击后从左侧平滑滑出一张**四边留白悬浮卡片抽屉**（宽度 `280px`，圆角 `12px`，带 1px 细边框与深度阴影）；
  * 抽屉内部完整呈现无边框彩色资产卡片与目录树，选中分类或文档后抽屉自动优雅收回；
* **第三栏弹性拉伸**：卡片网格自适应调整为双列（`grid-cols-2 gap-4`），阅读正文最大宽度限制为 `768px` 居中，防视觉行宽过宽。

#### 6.1.4 移动端（Mobile < 768px）：单列卡片工作区与悬浮大纲球

* **顶部极简移动状态栏**：
  * 高度 `48px`，吸顶固定，背景为半透明模糊底（`backdrop-blur-md`）；
  * 左侧为汉堡菜单按钮（`<KbIcon name="Menu" />`），中间居中展示“企业知识库”，右侧为全局搜索图标与头像；
* **全屏微距卡片抽屉（Mobile Drawer）**：
  * 点击汉堡菜单，从左侧滑出占据屏幕宽 `85%` 的卡片式抽屉（外圈距视口边缘留白 `8px`，大圆角 `16px`）；
  * 抽屉顶部为用户信息与系统菜单卡片，下方平铺 6 大资产卡片（纯靠底色辨识），条目行高加大至 `48px` 适配手指触控；
* **移动端沉浸式阅读与悬浮 TOC 胶囊**：
  * 文档正文充满移动屏幕，字号锁定为 `16px` / 行高 `1.8`，图片与代码块自动横向自适应滚动；
  * **TOC 目录大纲悬浮卡片按钮**：正文左侧固定的 200px TOC 在移动端自动隐藏，变为右下角悬浮胶囊卡片（`<a-float-button>` 内嵌 `<KbIcon name="List" />`）；点击后自屏幕底部滑出半屏卡片抽屉（Bottom Sheet），点击任意标题平滑滚动至正文对应位置并自动收回；
* **移动端草稿编辑自适应**：
  * Vditor IR 针对软键盘弹出动态监听 `window.visualViewport`，工具栏固定在软键盘正上方；
  * 顶部保存与提审操作简化为右上角纯图标胶囊，防止占位遮挡正文。

---

### 6.2 无障碍（Accessibility / WCAG 2.1 AA）与键盘导航规范

系统严格遵循 W3C [WCAG 2.1 AA 级标准](https://www.google.com/search?q=https%3A%2F%2Fwww.w3.org%2FWAI%2FWCAG21%2Fquickref%2F)，保证全站界面的可感知性、可操作性、可理解性与高兼容度。

#### 6.2.1 全局键盘焦点流与快捷键矩阵

全站核心生产力流程均支持 100% 纯键盘导航，所有交互元素拥有清晰的键盘焦点流（Focus Flow）：

| 全局快捷键 | 物理按键触发 | 全局响应行为 | 适用视口与场景 |
| :--- | :--- | :--- | :--- |
| **全局检索** | `⌘K` (Mac) / `Ctrl+K` (Win) | 无论处于何种页面，即刻激活居中搜索胶囊框并展开联想卡片面板 | 全视口通用 |
| **草稿暂存** | `⌘S` (Mac) / `Ctrl+S` (Win) | 阻断浏览器默认“保存网页”行为，即刻强制向本地与云端暂存当前草稿 | 编辑器激活态 |
| **关闭浮层** | `Escape` (Esc) | 依次依层级关闭当前顶层的 Popover 气泡、Dropdown 菜单、Modal 弹窗与 Drawer 抽屉 | 任意打开浮层场景 |
| **焦点推进** | `Tab` / `Shift+Tab` | 按 DOM 逻辑顺序在交互控件（链接、按钮、输入框、卡片）之间前进或后退 | 全局通用 |
| **目录树导航**| `↑` / `↓` / `←` / `→` | 在第二栏多级目录树中上下选中节点、左折叠当前分支、右展开当前节点 | 第二栏聚焦时 |
| **触发操作** | `Enter` / `Space` | 激活当前聚焦的按钮、链接或展开下拉菜单 | 交互控件聚焦时 |

#### 6.2.2 聚焦外圈发光环规范（Focus Ring Token）

* **禁止全局移除聚焦轮廓**：全站坚决禁止出现 `outline: none` 而不提供替代样式的反无障碍做法；
* **统一发光环变量**：所有控件聚焦时，统一触发系统级主题发光环样式：
  ```css
  :focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 3px var(--kb-control-outline) !important;
    border-color: var(--kb-color-primary) !important;
    transition: box-shadow 0.15s ease-in-out;
  }
  ```
* **卡片聚焦态**：当使用键盘 `Tab` 遍历第三栏文档卡片列表时，当前选中的卡片整体亮起 `3px` 品牌主色发光环并轻微悬浮，敲击 `Enter` 即可原地进入阅览。

#### 6.2.3 ARIA 语义化标签与读屏器无障碍映射

全站组件规范化绑定 WAI-ARIA 属性，确保盲人读屏软件（NVDA、VoiceOver）清晰朗读：

```html
<!-- 1. 第二栏目录树树节点语义 -->
<div
  role="treeitem"
  :aria-expanded="isExpanded"
  :aria-selected="isSelected"
  :aria-level="depth"
  tabindex="0"
>
  <KbIcon :name="nodeIcon" :aria-hidden="true" />
  <span class="title">{{ title }}</span>
  <button
    type="button"
    aria-label="更多操作"
    class="more-btn"
  >
    <KbIcon name="MoreHorizontal" :aria-hidden="true" />
  </button>
</div>

<!-- 2. 卡片式弹窗语义 -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  class="kb-card-modal"
>
  ...
</div>
```

1. **装饰性图标**：纯装饰性图标强制挂载 `aria-hidden="true"`，避免读屏器冗余朗读图标文件名；
2. **交互性图标按钮**：纯图标操作按钮（如关闭、三点点菜单、全屏）必须通过 `aria-label` 显式注明语义；
3. **状态变化即时广播**：通过 `<div role="status" aria-live="polite">` 宣告草稿“已保存至本地”及“网络已断开”通知。

#### 6.2.4 色彩对比度检测标准（WCAG AA）

所有文字与其实际背景组合须达到 WCAG 2.1 AA 对比度：普通文字至少 **4.5:1**，大字号文字至少 **3:1**。不得仅凭颜色名称或设计稿推定合规；浅色/深色主题、链接、禁用态、状态标签与悬停态均须逐组测量。未达到阈值时应调整前景/背景配对，不能以增加字重或只添加图标替代。
* **支持大字号缩放**：页面整体采用 `rem` 与 `px` 弹性网格，浏览器缩放至 `200%` 时布局自适应折叠，文字绝不发生重叠、遮挡或溢出截断。

---

### 6.3 动效降级体系（`prefers-reduced-motion`）

为保障前庭神经敏感、易晕眩或使用低性能设备用户的浏览体验，系统设立**系统级动效静音降级机制**：

```css
/* apps/web/src/styles/motion.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* 彻底禁用 motion-v 的弹簧物理震颤与 layout 缩放过渡 */
  .motion-spring-transition,
  .kb-card-hover-effect {
    transform: none !important;
    transition: none !important;
  }
}
```

* **弹窗与抽屉瞬间显隐**：在开启降级模式时，模态弹窗与侧滑抽屉取消平滑滑入缓动，改为瞬间直接呈现；
* **目录树展开**：手风琴展开与收起取消物理弹簧动画，直接由 `v-show` 瞬时切换；
* **平滑滚动降级**：TOC 锚点点击从平滑平移（`smooth`）自动转为瞬间定位（`auto`）。

---

### 6.4 前端工程化落地与组件交付映射清单

为确保研发团队在遵循 Monorepo 架构开发时“有法可依、严丝合缝”，在此系统化输出工程组件交付清单：

#### 6.4.1 `@kb/tokens` 种子变量与 CSS 变量消费范式

在 Vue SFC 或 CSS 模块中，统一采用以下标准范式进行设计变量消费：

```vue
<template>
  <div class="kb-custom-card">
    <span class="status-indicator"></span>
    <h4 class="title">自定义模块标题</h4>
  </div>
</template>

<style scoped>
.kb-custom-card {
  background-color: var(--kb-color-bg-container);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-border-radius-lg);
  padding: 16px;
  box-shadow: var(--kb-box-shadow-tertiary);
  transition: all 0.2s ease;
}

.kb-custom-card:hover {
  border-color: var(--kb-color-primary-border);
  box-shadow: var(--kb-box-shadow);
  transform: translateY(-2px);
}

.title {
  color: var(--kb-color-text);
  font-size: 16px;
  font-weight: 600;
}
</style>
```

#### 6.4.2 `@kb/ui` 二次封装组件库调用与属性契约清单

| 组件名称 | 引入路径 | 核心 Props 属性 | 核心 Emits 事件 / Slots 插槽 | 典型使用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **`KbIcon`** | `@kb/ui/icon/KbIcon.vue` | `name: string`<br>`size?: xs\|sm\|md\|lg\|xl`<br>`color?: default\|primary\|success\|warning\|error\|disabled`<br>`spin?: boolean`<br>`ariaLabel?: string` | - | 全站所有线性图标唯一入口 |
| **`KbAssetNavCard`** | `@kb/ui/nav/KbAssetNavCard.vue` | `entity: kb-public\|kb-private\|kb-shared\|favorites\|drafts\|trash`<br>`title: string`<br>`count?: number`<br>`isActive?: boolean` | `#icon`<br>`#actions`（三点点插槽）<br>`@click`, `@action-select` | 第二栏资产无边框微卡片 |
| **`KbCategoryTree`** | `@kb/ui/tree/KbCategoryTree.vue` | `treeData: TreeNode[]`<br>`draggable?: boolean`<br>`emptyTooltipText?: string` | `@select`<br>`@drop`<br>`@quick-create`（无数据加号点击）<br>`@node-action` | 第二栏挂载的多级分类虚拟树 |
| **`KbUnifiedCard`** | `@kb/ui/card/KbUnifiedCard.vue` | `entity: kb\|category\|document`<br>`data: Record<string, any>`<br>`bordered?: boolean` | `#header`<br>`#meta`<br>`#actions`<br>`@click` | 第三栏内容卡片流（库/分类/文档） |
| **`KbShareModal`** | `@kb/ui/modal/KbShareModal.vue` | `open: boolean`<br>`targetType: kb\|category\|document`<br>`targetId: string\|number` | `@update:open`<br>`@save-success` | 分层分享独立覆盖与继承弹窗卡片 |
| **`KbMarkdownEditor`** | `@kb/ui/editor/KbMarkdownEditor.vue` | `modelValue: string`<br>`draftId: string\|number`<br>`readonly?: boolean` | `@update:modelValue`<br>`@save-local`<br>`@publish-request` | 第三栏就地草稿编辑器（Vditor IR） |
| **`KbAttachmentPanel`**| `@kb/ui/attachment/KbAttachmentPanel.vue` | `attachments: AttachmentItem[]`<br>`docId: string\|number`<br>`canUpload?: boolean` | `@upload-success`<br>`@delete`<br>`@download` | 附件秒传、去重与 3 秒杀毒流水线 |
| **`KbDiffViewer`** | `@kb/ui/diff/KbDiffViewer.vue` | `baseContent: string`<br>`targetContent: string`<br>`baseVersion: number`<br>`targetVersion: number`<br>`mode?: side-by-side\|inline` | `@confirm-overwrite`<br>`@cancel` | 409 并发冲突、审批审阅、快照追溯 |
| **`KbCommentThread`** | `@kb/ui/comment/KbCommentThread.vue` | `documentId: string\|number`<br>`comments: CommentItem[]` | `@create-comment`<br>`@reply`<br>`@delete-comment` | 正文底部楼中楼两级评论卡片树 |

#### 6.4.3 前端 Monorepo 视图页面映射清单（`apps/web/src/views/`）

| 路由地址 (Route Path) | 视图组件文件 (SFC) | 对应规范章节 | 核心业务布局形态 |
| :--- | :--- | :--- | :--- |
| `/login` | `src/views/auth/LoginView.vue` | 第 1 章 & 第 3 章 | 居中悬浮卡片式表单（深浅色自适应） |
| `/home` | `src/views/portal/PortalView.vue` | 第 4.1 节 | 单栏居中卡片化门户（⌘K 搜索 + 系统菜单卡片 + 动态流） |
| `/workspace` | `src/views/workspace/WorkspaceView.vue` | 第 4.2 节 & 第 4.3 节 | **核心四栏一体化工作台**（第一栏 64px + 第二栏 240px + 第三栏就地阅览与编辑 + 第四栏 360px AI） |
| `/approval` | `src/views/approval/ApprovalCenterView.vue` | 第 4.4 节 & 第 5.2 节 | 两栏极简审批流转视图（行内展开 Diff 比对 + 反自审置灰） |
| `/trash` | `src/views/trash/TrashView.vue` | 第 4.5 节 & 第 5.4 节 | 统一平铺回收站（30 天倒计时 + 纯图标区分同级资产） |
| `/admin/users` | `src/views/admin/UserManagementView.vue` | 第 4.6.1 节 | 系统管理员专属：用户卡片列表与全局三级角色授权 |
| `/admin/settings`| `src/views/admin/SystemSettingsView.vue` | 第 4.6.2 节 | 系统管理员专属：公共库治理、杀毒引擎监控与审计日志 |

---

### 6.5 全文档定稿交付物总结与版本演进路线

企业知识库系统 UI/UX 设计与交互规范自此形成**完备闭环交付体**：

1. **《企业知识库系统 UI/UX 设计与交互规范》（全 6 章评审定稿版）**：
   * 作为本系统全生命周期视觉呈现、交互状态流转与前端工程落地的最高规范依据；
2. **自动化设计工程工具链**：
   * `packages/tokens`：维护系统 Seed Tokens；Ant Design Vue 主题接入严格使用官方 `ConfigProvider theme`、预设算法及 `theme.useToken()`；
   * 应用 CSS 变量仅作为当前官方 token 的消费映射，不维护独立色阶，也不伪称为 Ant Design Vue 自动生成的 CSS 变量；
3. **版本演进路线规划**：
   * **v3.3（当前 MVP 定稿版本）**：覆盖卡片化体系、四栏工作台、统一回收站、反自审与 CAS 409 差异冲突处理；
   * **v3.4（未来扩展阶段）**：规划多人协同实时光标、Markdown 协同画板，以及 AI 知识库上下文问答与图谱联动。



