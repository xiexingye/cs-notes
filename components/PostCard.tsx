import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { TagBadge } from '@/components/TagBadge';

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <time dateTime={post.date}>{post.displayDate}</time>
        <span aria-hidden="true">·</span>
        <span>
          {post.minutes} 分钟 · {post.chars} 字
        </span>
        {post.draft ? <span className="tag">草稿</span> : null}
      </div>

      <h3 className="mt-2 text-lg font-semibold leading-snug">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h3>

      {post.summary ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
