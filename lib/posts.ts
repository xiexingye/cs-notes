/**
 * 文章数据层：直接读 content/posts 下的 .mdx 文件。
 *
 * 整个博客没有数据库：Markdown 文件就是数据源，
 * 构建时（next build）这些函数在 Node 环境里跑一遍，把结果固化进静态 HTML。
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

export type Heading = {
  depth: 2 | 3;
  text: string;
  /** 与 rehype-slug 生成的 id 完全一致，用于目录锚点跳转 */
  id: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO 日期，用于排序 */
  date: string;
  /** 展示用日期，形如 2026-01-05 */
  displayDate: string;
  summary: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  /** 预估阅读时长（分钟） */
  minutes: number;
  /** 正文字数（中文按字、英文按词） */
  chars: number;
  headings: Heading[];
};

export type Post = PostMeta & { content: string };

export type TagCount = { tag: string; count: number };

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/** 生产构建时过滤掉 draft: true 的文章；本地开发始终可见 */
const INCLUDE_DRAFTS = process.env.NODE_ENV !== 'production';

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => /\.mdx?$/.test(file));
}

function toDate(input: unknown): Date {
  if (input instanceof Date && !Number.isNaN(input.getTime())) return input;
  const parsed = new Date(String(input ?? ''));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

/** 去掉标题里的行内 Markdown 语法，得到纯文本（slug 必须基于纯文本才和 rehype-slug 一致） */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+#+\s*$/, '')
    .trim();
}

/**
 * 从 MDX 源码里抽取 h2/h3 生成目录。
 * 用 github-slugger（rehype-slug 内部用的同一个库）算 id，
 * 保证目录锚点和正文标题 id 一模一样。
 */
export function extractHeadings(mdx: string): Heading[] {
  const withoutCode = mdx
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');

  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const pattern = /^(#{1,3})[ \t]+(.+?)[ \t]*$/gm;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(withoutCode)) !== null) {
    const depth = match[1].length;
    // 一级标题由 frontmatter 的 title 承担，正文里不写 h1
    if (depth === 1) continue;
    const text = stripInlineMarkdown(match[2]);
    headings.push({ depth: depth as 2 | 3, text, id: slugger.slug(text) });
  }
  return headings;
}

/** 阅读时长估算：中文按 350 字/分钟，英文按 200 词/分钟 */
export function estimateReading(text: string): { chars: number; minutes: number } {
  const plain = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|=-]/g, ' ');

  const cjk = (plain.match(/[\u3400-\u9fff\uf900-\ufaff\u3000-\u303f]/g) ?? []).length;
  const latin = (plain.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').match(/[A-Za-z0-9']+/g) ?? []).length;
  const minutes = Math.max(1, Math.round(cjk / 350 + latin / 200));

  return { chars: cjk + latin, minutes };
}

/* ------------------------------------------------------------------ */
/* 读取与解析                                                          */
/* ------------------------------------------------------------------ */

function parsePost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);

  const date = toDate(data.date);
  const { chars, minutes } = estimateReading(content);

  return {
    slug,
    title: String(data.title ?? slug),
    date: date.toISOString(),
    displayDate: date.toISOString().slice(0, 10),
    summary: String(data.summary ?? data.description ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map((tag: unknown) => String(tag)) : [],
    cover: data.cover ? String(data.cover) : undefined,
    draft: data.draft === true,
    minutes,
    chars,
    headings: extractHeadings(content),
    content,
  };
}

/* ------------------------------------------------------------------ */
/* 对外 API                                                            */
/* ------------------------------------------------------------------ */

/** 全部文章（新 → 旧），不含正文，列表页用它 */
export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map(parsePost)
    .filter((post) => INCLUDE_DRAFTS || !post.draft)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title, 'zh') : a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

/** 供 generateStaticParams 使用 */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/** 单篇文章（含正文），找不到或不该出现时返回 null */
export function getPostBySlug(slug: string): Post | null {
  const fileName = listPostFiles().find((file) => file.replace(/\.mdx?$/, '') === slug);
  if (!fileName) return null;

  const post = parsePost(fileName);
  if (post.draft && !INCLUDE_DRAFTS) return null;
  return post;
}

/** 标签云：按文章数倒序 */
export function getAllTags(): TagCount[] {
  const counter = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count === a.count ? a.tag.localeCompare(b.tag, 'zh') : b.count - a.count));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const wanted = tag.toLowerCase();
  return getAllPosts().filter((post) => post.tags.some((item) => item.toLowerCase() === wanted));
}

/** 上一篇 / 下一篇（prev 指更新的一篇） */
export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
