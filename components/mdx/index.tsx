import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { Callout } from '@/components/Callout';

/**
 * MDX 里 HTML/组件怎么渲染，全部在这里决定。
 * <MDXRemote components={mdxComponents} /> 传进去即可。
 */

/** 站内链接走 next/link（客户端跳转），站外链接新窗口打开 */
function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel="noreferrer noopener" target="_blank" {...rest}>
      {children}
    </a>
  );
}

/**
 * 图片故意用原生 <img> 而不是 next/image：
 * next/image 优化远程图片需要配 images.remotePatterns，对个人博客是额外的部署负担。
 * 想开优化的话，把这里换成 next/image 并在 next.config.mjs 里声明域名即可。
 */
function MdxImage({ src = '', alt = '', ...rest }: ComponentPropsWithoutRef<'img'>) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  Callout,
};
