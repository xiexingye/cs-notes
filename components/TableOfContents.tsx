import type { Heading } from '@/lib/posts';

/**
 * 文章目录。
 * headings 是构建期从 MDX 源码里抽出来的，id 用 github-slugger 算，
 * 和 rehype-slug 给正文标题加上的 id 完全一致，所以锚点必然能跳到。
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="文章目录"
      className="my-8 rounded-[14px] border border-line bg-surface px-4 py-3.5 text-sm"
    >
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted">目录</p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.depth === 3 ? '0.9rem' : 0 }}
            className={heading.depth === 3 ? 'text-[0.83rem]' : ''}
          >
            <a href={`#${heading.id}`} className="text-muted transition-colors hover:text-accent">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
