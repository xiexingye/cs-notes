import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** /robots.txt */
// 显式钉成静态：output: 'export' 的纯静态导出要求路由是静态的，否则构建会失败
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
