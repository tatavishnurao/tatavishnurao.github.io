import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { projects } from "@/content/projects";

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
          {projects.map((project) => (
            <article
              key={project.href}
              className="rounded-[1.4rem] border border-soft/80 bg-white/45 px-6 py-6 shadow-[0_18px_44px_rgba(36,33,29,0.06)]"
            >
              <h2 className="font-serif text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                {project.title}
              </h2>
              <p className="mt-3">{project.description}</p>
              <p className="mt-3">
                <strong>Aim:</strong> {project.aim}
              </p>
              <p className="mt-4">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-ink"
                >
                  View repository
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
