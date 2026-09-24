import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  // metadataBase 让所有相对路径（canonical、og:image）自动补全成绝对地址
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.author.name, url: site.author.github }],
  creator: site.author.name,
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${site.url}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="shell flex-1 py-10 sm:py-14">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
