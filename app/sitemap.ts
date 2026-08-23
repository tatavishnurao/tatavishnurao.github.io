import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/blog", "/projects"];
  return [
    ...routes.map((route) => ({ url: `${site.url}${route}`, lastModified: new Date() })),
    ...blogPosts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: new Date(`${post.date}T00:00:00Z`) }))
  ];
}
