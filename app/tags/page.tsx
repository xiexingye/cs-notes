import type { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { TagBadge } from '@/components/TagBadge';

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览全部文章',
  alternates: { canonical: '/tags' },
};

export default function TagsPage() {
  const tags = getAllTags();
  const postCount = getAllPosts().length;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">标签</h1>
        <p className="mt-2 text-sm text-muted">
          {tags.length} 个标签，覆盖 {postCount} 篇文章。点进去看同一主题下的所有内容。
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-muted">还没有标签。</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {tags.map(({ tag, count }) => (
            <TagBadge key={tag} tag={tag} count={count} />
          ))}
        </div>
      )}
    </>
  );
}
