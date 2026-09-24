import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold tracking-tight text-muted">404</p>
      <h1 className="mt-4 text-xl font-semibold">这个页面不存在</h1>
      <p className="mt-2 text-sm text-muted">
        可能是链接过期了，或者文章 slug 拼错了。
      </p>
      <div className="mt-8 flex justify-center gap-3 text-sm">
        <Link href="/" className="tag">
          回首页
        </Link>
        <Link href="/tags" className="tag">
          看标签
        </Link>
      </div>
    </div>
  );
}
