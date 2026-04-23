import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";

type BlogArchiveProps = {
  postsByYear: Array<{
    year: string;
    posts: BlogPostSummary[];
  }>;
};

export function BlogArchive({ postsByYear }: BlogArchiveProps) {
  if (postsByYear.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-soft/80 bg-white/40 px-6 py-7">
        <p className="font-sans text-[0.92rem] leading-7 text-muted">
          No blog posts have been published yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-14 space-y-12">
      {postsByYear.map(({ year, posts }) => (
        <div key={year} className="grid gap-5 sm:grid-cols-[88px_minmax(0,1fr)]">
          <h2 className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted/90">
            {year}
          </h2>
          <div className="divide-y divide-soft/75">
            {posts.map((post) => (
              <article key={post.slug} className="py-6 first:pt-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-serif text-[1.38rem] font-semibold leading-8 tracking-[-0.025em]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-ink underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-soft focus:text-accent focus:decoration-soft focus:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <time
                    dateTime={post.date}
                    className="font-sans text-[0.84rem] text-muted"
                  >
                    {post.displayDate}
                  </time>
                </div>
                <p className="mt-2 max-w-3xl text-[0.98rem] leading-[1.75] text-ink/76">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
