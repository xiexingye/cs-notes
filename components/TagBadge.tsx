import Link from 'next/link';

/**
 * 标签徽章。
 * 标签可能含中文或空格，所以 href 一定要 encodeURIComponent，
 * 否则生成的路由和 [tag] 目录名会对不上。
 */
export function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link href={`/tags/${encodeURIComponent(tag)}`} className="tag">
      <span>#{tag}</span>
      {typeof count === 'number' ? <span className="opacity-70">{count}</span> : null}
    </Link>
  );
}
