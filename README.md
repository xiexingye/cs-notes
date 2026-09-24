# 计算机学习笔记 · CS Notes

> 用 **Next.js 16 + MDX** 搭的纯静态个人博客。文章是仓库里的 `.mdx` 文件，
> 构建时编译成 HTML，整站部署在 Vercel 的 CDN 上——没有数据库、没有后台、没有需要常驻的服务器。

<!-- 这一行是给 GitHub 仓库首页看的：改了站名/域名/作者，记得同步改上面的标题和下面的表格 -->

| 项目 | 值 | 在哪里改 |
| --- | --- | --- |
| 中文站名 | 计算机学习笔记 | `lib/site.ts` → `site.name` |
| 英文站名 | CS Notes | `lib/site.ts` → `site.englishName` |
| 线上域名 | https://cs-notes.vercel.app | `lib/site.ts` → `site.url`（或环境变量 `NEXT_PUBLIC_SITE_URL`） |
| 作者 | 谢幸烨 | `lib/site.ts` → `site.author` |
| 分享封面 | `public/og-cover.svg` | 图上的站名是写死的文字，改名要一起改 |

---

## 快速开始

```bash
npm install          # 首次安装依赖（约 1~3 分钟，205 个包）
npm run dev          # 开发服务器 → http://localhost:3000
npm run build        # 生产构建（同时做 TypeScript 类型检查）
npm run preview      # build + start，看到的就是上线后的效果
npm run typecheck    # 只跑类型检查，不构建
```

> **Windows 提示**：如果 PowerShell 报 `npm.ps1 无法加载 / 禁止运行脚本`，
> 说明执行策略拦住了 npm 的 PowerShell 包装脚本，改用 `npm.cmd run dev` 即可。
> 本项目 `.vscode/tasks.json` 里的命令已经全部用 `npm.cmd`，走 VS Code 任务不受影响。

**用 VS Code 启动**：打开本文件夹 → 按 `Ctrl+Shift+B`（默认任务 = 启动开发服务器）
→ 终端出现 `Local: http://localhost:3000` 后按住 Ctrl 点它。详见 `READ.txt` 第六节。

---

## 技术栈

| 层 | 选型 | 版本 | 为什么是它 |
| --- | --- | --- | --- |
| 框架 | Next.js（App Router） | 16.3.6 | 文件路由 + 服务端组件；读文件、编译 MDX 这类 Node 侧操作可以直接写在页面组件里 |
| UI | React | 19.3.0 | Next 的运行时，也是 MDX 编译产物的执行环境 |
| 语言 | TypeScript | 5.x | `lib/posts.ts` 里的 `PostMeta` / `Post` / `Heading` 是内容模型的唯一事实来源；`next build` 顺带做类型检查 |
| 内容格式 | MDX（next-mdx-remote） | 6.0.0 | 让文章当**数据**放在 `content/` 里，而不是像 `@next/mdx` 那样塞进 `app/` 参与路由 |
| frontmatter | gray-matter | 4.0.3 | 把 `.mdx` 拆成元数据 + 正文，稳定无依赖 |
| Markdown 扩展 | remark-gfm | 4.0.1 | 表格、任务列表、删除线、自动链接 |
| 标题锚点 | rehype-slug + github-slugger | 6.0.0 / 2.0.0 | 目录（TOC）和正文标题**用同一个库算 id**，锚点必然对得上 |
| 代码高亮 | rehype-highlight | 7.0.2 | 比 Shiki 轻；配色自己写在 `globals.css`，浅色深色都能适配 |
| 样式 | Tailwind CSS | 4.3.3 | v4 是 CSS-first 配置，主题写在 `@theme` 里，不再需要 `tailwind.config.js` |
| 部署 | Vercel | — | 与 Git 集成，push 即部署；构建在云端完成，本地什么都不用跑 |

---

## 目录结构

```
content/posts/            ← 文章源文件，一个 .mdx 一篇；文件名就是 URL 里的 slug
lib/
  site.ts                 ← 站点配置（站名 / 作者 / 域名 / 导航）——只改这一个文件
  posts.ts                ← 文章数据层：读文件、解析 frontmatter、排序、标签聚合、
                            阅读时长估算、目录抽取（整个站的核心）
components/
  SiteHeader.tsx          ← 吸顶页头（纯服务端组件，无客户端 JS）
  SiteFooter.tsx          ← 页脚（邮箱/GitHub 留空则自动隐藏，避免死链）
  PostCard.tsx            ← 列表里的文章卡片
  TagBadge.tsx            ← 标签徽章（负责 encodeURIComponent 中文标签）
  TableOfContents.tsx     ← 文章目录
  Callout.tsx             ← 自定义提示框，MDX 里可以直接写 <Callout>
  mdx/index.tsx           ← MDX 组件映射：a / img / Callout 怎么渲染
app/
  layout.tsx              ← 全站 metadata、页头页脚、引入全局样式
  page.tsx                ← 首页：文章列表，按年份分组
  globals.css             ← 设计令牌 + 基础样式 + .prose 正文排版 + 高亮配色
  blog/[slug]/page.tsx    ← 文章详情页（构建期静态生成 + 目录 + 上下篇导航）
  tags/page.tsx           ← 标签云
  tags/[tag]/page.tsx     ← 单个标签下的文章
  about/page.tsx          ← 关于页
  rss.xml/route.ts        ← RSS 2.0 订阅源
  sitemap.ts / robots.ts  ← /sitemap.xml 与 /robots.txt
  not-found.tsx           ← 404 页
public/og-cover.svg       ← 默认社交分享封面（1200×630）
.vscode/                  ← VS Code 任务 / 调试配置 / 推荐扩展
READ.txt                  ← 完整搭建说明（技术选型理由、部署细节、踩坑清单、实测记录）
```

---

## 一篇文章从 .mdx 变成网页

```
content/posts/xxx.mdx
   │  ① 构建时：lib/posts.ts 用 node:fs 读文件，gray-matter 拆出 frontmatter 与正文
   ▼
PostMeta + 正文字符串
   │  ② 页面调用 <MDXRemote source={正文} />，在服务端把 MDX 编译成 React 组件树
   ▼
remark/rehype 插件流水线
   │  remark-gfm（表格 / 任务列表）
   │  → rehype-slug（给标题加 id）→ rehype-autolink-headings（悬停回链）
   │  → rehype-highlight（代码高亮）
   ▼
React 渲染成 HTML 字符串
   │  ③ next build 把结果写进 .next/，成为静态资源
   ▼
CDN 返回静态 HTML（不经过 Node、不读磁盘、不查数据库）
```

路径在构建期就已全部确定：`generateStaticParams()` 列出所有 slug，
`dynamicParams = false` 让没预渲染的路径直接 404，不按需渲染。

---

## 写一篇新文章

在 `content/posts/` 新建 `my-post.mdx`（**文件名就是 URL**：`/blog/my-post`）：

```yaml
---
title: '文章标题'
date: '2026-09-24'
summary: '一句话摘要，会出现在首页卡片、SEO description 和 RSS 里'
tags: ['标签A', '标签B']
cover: '/og-cover.svg'   # 可选
draft: false             # true 时只在开发环境可见，构建时会被过滤
---
```

正文里可以用的东西：

- GFM 表格、任务列表 `- [ ]`、删除线、行内代码
- 围栏代码块，标注语言（`ts` / `bash` / `yaml` 等）就会自动高亮
- `<Callout type="tip|warn|info" title="...">…</Callout>`（已注册，不用 import）
- **不要写一级标题** `#`，页面标题由 frontmatter 提供；标题从 `##` 开始
- 正文里的裸 `<` 和 `{` 会被当成 JSX 语法，写比较运算符请放进 `行内代码` 或用全角字符

---

## 部署

| 方式 | 做什么 | 本地要不要跑东西 |
| --- | --- | --- |
| **A. GitHub + Vercel**（推荐） | 推到 GitHub → Vercel 导入仓库 → 云端自动构建 | 完全不用，push 即上线 |
| B. Vercel CLI | `npx vercel --prod` | 只负责提交源码，构建仍在云端 |
| C. 静态导出 + 拖拽托管 | `set STATIC_EXPORT=1 && npm run build`，把 `out/` 拖到 Netlify Drop | 导出时需要构建一次，之后不需要 |

方式 A 补充：Vercel 里加环境变量 `NEXT_PUBLIC_SITE_URL = 你的域名` 后要 **Redeploy** 才生效
（该变量在构建期内联）。不设也能跑，代码会退回用 Vercel 注入的 `VERCEL_URL`。

---

## 实测记录

以下都是在 Windows / Node v24.21.0 / npm 11.19.0 上真实跑出来的，不是纸面推演：

| 项目 | 结果 |
| --- | --- |
| `npm install` | 205 个包，exit 0 |
| `npm run typecheck` | 0 错误 |
| `npm run build` | exit 0，18 个页面全部预渲染（3 篇文章 + 6 个标签页 + 静态页） |
| 目录锚点 | 与正文标题 id 逐项比对完全一致（7/7、7/7、8/8） |
| 代码高亮 / Callout / 表格 | 均正确渲染 |
| RSS / sitemap / robots | 3 条 item；12 条 URL（中文标签已百分号编码）；含 Host 与 Sitemap |
| 静态导出 | exit 0，`out/` 85 个文件 / 1.3 MB |
| 体积 | 文章页 JS 原始 562 KB → gzip 173 KB；CSS 16.6 KB |

---

## 已知限制

1. 没有数据库、没有后台、没有评论系统；文章即文件，改动走 Git，改一个字也要重新部署（约 20~40 秒）。
2. 首屏仍会加载 Next 框架运行时（React + 路由），gzip 后约 173 KB——这是 App Router 的起步成本，与"有没有客户端组件"无关。
3. `og:image` 目前指向 SVG，浏览器能显示，但微信/Twitter 等平台多数只认 PNG/JPEG，正式推广建议换成 1200×630 的 PNG。
4. 图片用原生 `<img>`，未启用 `next/image` 的自动压缩与 WebP 转换。
5. 暂无全文搜索（计划用 Pagefind：构建后扫 HTML，纯静态也能搜）。
6. 文章量到几百篇后构建时间会线性增长。

更多细节（每一步的选型对比、替代方案、完整踩坑清单）见 **`READ.txt`**。
