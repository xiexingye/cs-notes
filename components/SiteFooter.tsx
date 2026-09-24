import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="shell flex flex-col gap-2 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.author.name} · {site.name}（{site.englishName}）
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* 邮箱和 GitHub 没填就不显示，避免出现死链 */}
          {site.author.email ? (
            <a href={`mailto:${site.author.email}`} className="hover:text-accent">
              Email
            </a>
          ) : null}
          {site.author.github ? (
            <a
              href={site.author.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          ) : null}
          <a href="/rss.xml" className="hover:text-accent">
            RSS
          </a>
          <a href="/sitemap.xml" className="hover:text-accent">
            Sitemap
          </a>
        </p>
      </div>
    </footer>
  );
}
