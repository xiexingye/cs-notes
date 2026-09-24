/**
 * 默认部署方式是 Vercel：构建在云端完成，本地不需要跑任何东西。
 *
 * 如果想把整站导出成纯静态文件（能直接拖到 Netlify Drop / Cloudflare Pages /
 * GitHub Pages，之后完全不需要服务器），加上静态导出开关再构建即可：
 *
 *   PowerShell:  $env:STATIC_EXPORT=1; npm.cmd run build
 *   cmd:         set STATIC_EXPORT=1 && npm run build
 *   产物：out/ 目录（入口 out/index.html）
 *
 * 注意：导出后的产物没有 Node 服务，所以 npm start / npm run preview 不能用；
 *      想恢复成常规模式，重新跑一次不带该变量的 npm run build 即可。
 */
const isStaticExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发期双渲染，能提前暴露副作用问题
  reactStrictMode: true,

  // 不暴露 X-Powered-By: Next.js
  poweredByHeader: false,

  // 文章页全部在构建期生成静态 HTML，Vercel 上直接走 CDN，无需 Node 常驻
  ...(isStaticExport
    ? {
        output: 'export',
        // 静态托管上 /tags/ 这种目录形式比 /tags 更稳（不需要服务端重写规则）
        trailingSlash: true,
        // 静态导出没有服务端，图片优化必须关掉
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
