import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected AI infrastructure and systems projects by Vishnu Vardhan Rao."
};

export default function ProjectsPage() {
  return (
    <Container className="pt-12 sm:pt-16">
      <section>
        <p className="eyebrow">Selected work</p>
        <h1 className="display-heading mt-4 max-w-3xl text-[2.25rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem]">
          Systems, kernels, and experiments.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted">A small set of pinned repositories, kept here as a quick index.</p>
        <div className="mt-12 divide-y divide-soft border-y border-soft">
          {projects.map((project, index) => (
            <article key={project.href} className="grid gap-4 py-7 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
              <p className="project-index">0{index + 1}</p>
              <div>
                <h2 className="font-serif text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{project.title}</h2>
                <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">{project.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
                  {project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
                </ul>
              </div>
              <p className="sm:pt-1">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-ink"
                >
                  GitHub ↗
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
