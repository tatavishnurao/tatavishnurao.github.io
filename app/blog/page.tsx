import type { Metadata } from "next";
import { BlogArchive } from "@/components/BlogArchive";
import { Container } from "@/components/Container";
import { getPostsByYear } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Field Notes",
  description: "Engineering notes on inference, GPUs, distributed systems, and agent memory."
};

export default function BlogPage() {
  const postsByYear = getPostsByYear();

  return (
    <Container className="pt-12 sm:pt-16">
      <header className="max-w-[40rem]">
        <p className="eyebrow">Field notes</p>
        <h1 className="display-heading mt-4 text-[2.8rem] sm:text-[4.5rem]">
          Learning in public, with measurements.
        </h1>
        <div className="body-copy mt-6">
          <p>Architecture notes, implementation reports, benchmark audits, and the occasional argument about how AI infrastructure should be measured.</p>
        </div>
      </header>

      <BlogArchive postsByYear={postsByYear} />
    </Container>
  );
}
