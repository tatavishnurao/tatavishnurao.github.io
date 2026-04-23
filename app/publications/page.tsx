import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PublicationList } from "@/components/PublicationList";
import { publications } from "@/content/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications and working papers by Tata Vishnu Rao."
};

export default function PublicationsPage() {
  return (
    <Container className="pt-12 sm:pt-16">
      <header className="max-w-[40rem]">
        <p className="eyebrow">Research</p>
        <h1 className="display-heading mt-4 text-[2.25rem] sm:text-[2.8rem]">
          Publications and working papers
        </h1>
        <div className="body-copy mt-6">
          <p>A future home for papers, posters, reports, and manuscripts.</p>
        </div>
      </header>

      <PublicationList publications={publications} />
    </Container>
  );
}
