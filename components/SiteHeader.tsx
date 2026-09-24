import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * 页头：纯服务端组件，不带任何客户端 JS。
 * 想做“当前页高亮”的话，需要加 'use client' 并用 usePathname()。
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="shell flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-[0.98rem] font-semibold tracking-tight">
          {site.name}
        </Link>

        <nav aria-label="主导航" className="flex items-center gap-1">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <a href="/rss.xml" className="nav-link" title="RSS 订阅">
            RSS
          </a>
        </nav>
      </div>
    </header>
  );
}
