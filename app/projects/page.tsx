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
        <h1 className="display-heading mt-4 max-w-3xl text-[2.8rem] sm:text-[4.5rem]">
          Systems, kernels, and experiments.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Each project starts with a bottleneck and ends with measurements, validation, and a clearer next question.</p>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.href}
              className="project-card"
            >
              <p className="project-index">0{index + 1}</p>
              <h2 className="mt-8 font-serif text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                {project.title}
              </h2>
              <p className="mt-3 text-muted">{project.description}</p>
              <p className="mt-5 font-mono text-xs leading-5 text-accent">{project.result}</p>
              <p className="mt-5 text-[0.95rem] leading-7 text-ink/78">{project.aim}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
              </ul>
              <p className="mt-7">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-ink"
                >
                  View repository ↗
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
