import { blogPosts, type BlogPost } from "@/content/blog";

export type BlogPostSummary = Pick<
  BlogPost,
  "slug" | "title" | "date" | "excerpt"
> & {
  displayDate: string;
};

export function getAllPosts() {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByYear() {
  const grouped = getAllPosts().reduce<Record<string, BlogPostSummary[]>>(
    (accumulator, post) => {
      const year = new Date(`${post.date}T00:00:00`).getFullYear().toString();

      accumulator[year] = accumulator[year] ?? [];
      accumulator[year].push({
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        displayDate: formatArchiveDate(post.date)
      });

      return accumulator;
    },
    {}
  );

  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, posts]) => ({ year, posts }));
}

export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

function formatArchiveDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
