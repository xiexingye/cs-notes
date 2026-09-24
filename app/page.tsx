import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { site } from '@/lib/site';

/**
 * 首页 = 文章列表。
 * 这里没有用任何动态 API（cookies / headers / searchParams），
 * 所以 Next 会在 next build 时把它整页预渲染成静态 HTML。
 */
export default function HomePage() {
  const posts = getAllPosts();

  // 按年份分组，看起来更像“归档”
  const byYear = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.displayDate.slice(0, 4);
    const bucket = byYear.get(year) ?? [];
    bucket.push(post);
    byYear.set(year, bucket);
  }

  return (
    <>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{site.name}</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">{site.description}</p>
        <p className="mt-4 text-sm text-muted">
          共 {posts.length} 篇 · 作者 {site.author.name} ·{' '}
          <Link href="/rss.xml" className="text-accent hover:underline">
            订阅 RSS
          </Link>
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-muted">
          还没有文章。在 <code>content/posts/</code> 里新建一个 .mdx 文件就会出现在这里。
        </p>
      ) : (
        <div className="space-y-10">
          {[...byYear.entries()].map(([year, items]) => (
            <section key={year}>
              <h2 className="mb-4 text-sm font-semibold tracking-[0.2em] text-muted">{year}</h2>
              <div className="grid gap-4">
                {items.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
