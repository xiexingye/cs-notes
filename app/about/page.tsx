import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${site.name} 与作者 ${site.author.name}`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">关于</h1>
      </header>

      <div className="prose">
        <p>
          这里是 <strong>{site.name}</strong>（{site.englishName}），{site.author.name} 的个人博客。
        </p>
        <p>{site.author.bio}</p>

        <h2>写什么</h2>
        <ul>
          <li>课程笔记：数据结构、操作系统、计算机网络、数据库</li>
          <li>算法与编程：刷题记录、竞赛总结、代码实现</li>
          <li>工程实践：前端 / 后端 / 部署，以及踩过的坑</li>
        </ul>

        <h2>这个站怎么搭的</h2>
        <p>
          纯静态方案：文章是仓库里的 <code>.mdx</code> 文件，构建时编译成 HTML，
          整站部署到 Vercel 的 CDN 上，没有数据库、没有后台、没有需要常驻的服务器。
          细节都写在项目根目录的 <code>READ.txt</code> 里。
        </p>

        <h2>联系</h2>
        <ul>
          {site.author.email ? (
            <li>
              Email：<a href={`mailto:${site.author.email}`}>{site.author.email}</a>
            </li>
          ) : null}
          {site.author.github ? (
            <li>
              GitHub：<a href={site.author.github}>{site.author.github}</a>
            </li>
          ) : null}
          <li>
            RSS：<Link href="/rss.xml">/rss.xml</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
