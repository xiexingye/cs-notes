import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { getAllPostSlugs, getAdjacentPosts, getPostBySlug } from '@/lib/posts';
import { mdxComponents } from '@/components/mdx';
import { TableOfContents } from '@/components/TableOfContents';
import { TagBadge } from '@/components/TagBadge';

/** 只允许构建期已生成的 slug，其余一律 404（避免运行时按需渲染陌生的路径） */
export const dynamicParams = false;

/** 构建期把每篇文章的静态路径交给 Next，next build 会把它们全部预渲染成 HTML */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/** 每篇文章独立的 <title> / description / og 信息 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: '文章不存在' };

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

/** 标题旁的回链锚点（鼠标悬停才显示，由 globals.css 里的 .heading-anchor 控制） */
const autolinkOptions = {
  behavior: 'append' as const,
  properties: { className: ['heading-anchor'], ariaHidden: true, tabIndex: -1 },
  content: { type: 'text' as const, value: '#' },
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Next 15 起，params 是 Promise，必须 await
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article>
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-muted">
          <time dateTime={post.date}>{post.displayDate}</time>
          <span aria-hidden="true">·</span>
          <span>
            {post.minutes} 分钟阅读 · {post.chars} 字
          </span>
          {post.draft ? <span className="tag">草稿</span> : null}
        </div>

        <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
          {post.title}
        </h1>

        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </header>

      <TableOfContents headings={post.headings} />

      <div className="prose">
        {/*
          这里就是 MDX 的全部魔法：把 .mdx 源码字符串交给 MDXRemote，
          它在服务端编译成 React 组件树，再跟着页面一起被静态化。
          remark 负责 Markdown 语法（GFM 表格 / 任务列表），rehype 负责 HTML 阶段（标题 id、代码高亮）。
        */}
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, autolinkOptions],
                [rehypeHighlight, { detect: true, ignoreMissing: true }],
              ],
            },
          }}
        />
      </div>

      <nav
        aria-label="上下篇导航"
        className="mt-14 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2"
      >
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="card">
            <span className="text-xs text-muted">← 更新的一篇</span>
            <span className="mt-1 block font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}`} className="card sm:text-right">
            <span className="text-xs text-muted">更早的一篇 →</span>
            <span className="mt-1 block font-medium">{next.title}</span>
          </Link>
        ) : null}
      </nav>

      <p className="mt-8 text-xs text-muted">
        <Link href="/" className="hover:text-accent">
          ← 返回首页
        </Link>
      </p>
    </article>
  );
}
