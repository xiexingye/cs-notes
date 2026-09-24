import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { site } from '@/lib/site';

/** /sitemap.xml：Next 会把这里返回的数据序列化成标准 sitemap */
// 显式钉成静态：output: 'export' 的纯静态导出要求路由是静态的，否则构建会失败
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [
    { url: site.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${site.url}/tags`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${site.url}/about`, changeFrequency: 'yearly', priority: 0.3 },
    ...posts,
    ...tags,
  ];
}
