import type { Metadata } from "next";
import Image from "next/image";
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
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted">A small set of pinned repositories, shown as the systems behind the work.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article key={project.href} className="project-showcase">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="project-index">0{index + 1}</p>
                  <h2 className="mt-2 font-serif text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] text-ink">{project.title}</h2>
                </div>
                <span className={project.live ? "status status-live" : "status status-draft"}>
                  <span className="status-dot" aria-hidden="true" />
                  {project.live ? "Live" : "In development"}
                </span>
              </div>
              <div className="project-diagram mt-5">
                <Image src={project.image} alt={`${project.title} system design`} width={960} height={420} />
              </div>
              <p className="mt-5 text-[0.95rem] leading-7 text-muted">{project.description}</p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
                  {project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
                </ul>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-ink"
                >
                  GitHub ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
