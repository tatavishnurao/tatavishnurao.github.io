import type { Metadata } from "next";
import { BlogArchive } from "@/components/BlogArchive";
import { Container } from "@/components/Container";
import { getPostsByYear } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "Personal blog by Tata Vishnu Rao."
};

export default function BlogPage() {
  const postsByYear = getPostsByYear();

  return (
    <Container className="pt-12 sm:pt-16">
      <header className="max-w-[40rem]">
        <p className="eyebrow">Personal Blog</p>
        <h1 className="display-heading mt-4 text-[2.25rem] sm:text-[2.8rem]">
          Notes, essays, and working thoughts
        </h1>
        <div className="body-copy mt-6">
          <p>A future home for notes, essays, and technical reflections.</p>
        </div>
      </header>

      <BlogArchive postsByYear={postsByYear} />
    </Container>
  );
}
