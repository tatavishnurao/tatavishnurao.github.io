import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects by Tata Vishnu Rao."
};

export default function ProjectsPage() {
  return (
    <Container className="pt-12 sm:pt-16">
      <section className="max-w-[40rem]">
        <p className="eyebrow">Selected work</p>
        <h1 className="display-heading mt-4 text-[2.25rem] sm:text-[2.8rem]">
          Projects
        </h1>
        <div className="body-copy mt-6">
          <p>Selected projects will be added here soon.</p>
        </div>
      </section>
    </Container>
  );
}
