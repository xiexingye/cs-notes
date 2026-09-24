/**
 * 站点级配置：全站只在这里改一次，页头、页脚、SEO、RSS 都从这里取。
 */

/**
 * 站点对外地址的解析顺序：
 *   1. 显式环境变量 NEXT_PUBLIC_SITE_URL（Vercel 上建议手动设置）
 *   2. Vercel 构建时注入的部署域名（预览部署每次都不一样）
 *   3. 兜底到正式域名
 * ★ 兜底刻意不写 localhost：canonical / sitemap / RSS 里出现 localhost 对搜索引擎是坏事。
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;

  return 'https://cs-notes.vercel.app';
}

export const site = {
  /** 中文站名：页头、页脚、<title> 模板、分享卡片都用它 */
  name: '计算机学习笔记',

  /** 英文站名：建议用它作为 Vercel 项目名 / 仓库名 / 域名前缀 */
  englishName: 'CS Notes',

  /** <title> 默认值与 og:site_name */
  title: '计算机学习笔记 · CS Notes',

  description:
    '把计算机专业学过的东西拆开、写清楚：课程笔记、算法与数据结构、前后端与部署，以及踩过的坑。',

  url: resolveSiteUrl(),
  locale: 'zh-CN',

  author: {
    name: '谢幸烨',
    bio: '记录计算机学习路上的笔记与思考。',
    // 下面两项留空字符串就不显示（页脚和「关于」页会自动跳过），填上就自动出现
    email: '' as string,
    github: '' as string,
  },

  /** 页头导航 */
  nav: [
    { href: '/', label: '首页' },
    { href: '/tags', label: '标签' },
    { href: '/about', label: '关于' },
  ],

  /** RSS 里保留的最大条目数 */
  rssLimit: 20,
} as const;

export type SiteConfig = typeof site;
