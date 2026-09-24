import type { ReactNode } from 'react';

type CalloutType = 'tip' | 'warn' | 'info';

const PALETTE: Record<CalloutType, { border: string; background: string }> = {
  tip: { border: 'var(--color-accent)', background: 'var(--color-accent-soft)' },
  warn: { border: '#d97706', background: 'rgba(217, 119, 6, 0.12)' },
  info: { border: '#2563eb', background: 'rgba(37, 99, 235, 0.12)' },
};

const DEFAULT_TITLE: Record<CalloutType, string> = {
  tip: '提示',
  warn: '注意',
  info: '说明',
};

/**
 * 自定义 MDX 组件示例：在 .mdx 里直接写
 *   <Callout type="warn" title="别踩这个坑">正文…</Callout>
 * 不需要 import，因为已经在 components/mdx/index.tsx 里注册过了。
 */
export function Callout({
  type = 'tip',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const palette = PALETTE[type] ?? PALETTE.tip;

  return (
    <aside
      className="callout"
      style={{ borderLeftColor: palette.border, backgroundColor: palette.background }}
    >
      <span className="callout-title" style={{ color: palette.border }}>
        {title ?? DEFAULT_TITLE[type] ?? DEFAULT_TITLE.tip}
      </span>
      {children}
    </aside>
  );
}
