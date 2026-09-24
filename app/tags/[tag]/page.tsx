import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';

/** 只为构建期已存在的标签生成页面 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

/**
 * 中文/带空格的标签在 URL 里是百分号编码的，
 * 这里解一次码；万一收到畸形编码就退回原值，别让整站 500。
 */
function decodeTag(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const tag = decodeTag((await params).tag);

  return {
    title: `#${tag}`,
    description: `标签「${tag}」下的全部文章`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}` },
  };
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const tag = decodeTag((await params).tag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <>
      <header className="mb-8">
        <p className="text-xs text-muted">
          <Link href="/tags" className="hover:text-accent">
            标签
          </Link>{' '}
          /
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">#{tag}</h1>
        <p className="mt-2 text-sm text-muted">{posts.length} 篇</p>
      </header>

      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
