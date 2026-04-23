import type { BlogPost } from "@/content/blog";
import { renderMarkdown } from "@/lib/markdown";
import { formatLongDate, readingTime } from "@/lib/blog";

type BlogPostLayoutProps = {
  post: BlogPost;
};

export function BlogPostLayout({ post }: BlogPostLayoutProps) {
  return (
    <article className="article mt-10 max-w-[43rem]">
      <header className="border-b border-soft/75 pb-9">
        <p className="font-sans text-[0.84rem] text-muted">
          <time dateTime={post.date}>{formatLongDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {readingTime(post.body)}
        </p>
        <h1 className="mt-5 font-serif text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.045em] text-ink sm:text-5xl sm:leading-[1.03]">
          {post.title}
        </h1>
        <p className="mt-6 text-[1.04rem] leading-[1.78] text-ink/76">
          {post.excerpt}
        </p>
      </header>

      <div className="pt-9">{renderMarkdown(post.body)}</div>
    </article>
  );
}
