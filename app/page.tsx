import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { getAllPosts, formatLongDate, readingTime } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Container className="pt-16 sm:pt-24">
      <section className="max-w-[48rem]">
        <p className="eyebrow">AI infrastructure · Hyderabad, India</p>
        <h1 className="display-heading mt-6 max-w-4xl text-[3rem] leading-[0.96] sm:text-[5.2rem]">
            {site.homeHeading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
        </h1>
        <div className="body-copy mt-9 max-w-[43rem] text-[1.08rem] sm:text-[1.17rem]">
          {site.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="button-primary" href="/projects">Explore projects <span aria-hidden="true">→</span></Link>
          <Link className="button-secondary" href="/blog">Read field notes</Link>
        </div>
      </section>

      <section className="section-rule mt-24 sm:mt-32">
        <div className="section-heading-row">
          <div><p className="eyebrow">Selected systems</p><h2 className="section-title">Built to answer a question.</h2></div>
          <Link className="quiet-link" href="/projects">All projects →</Link>
        </div>
        <div className="mt-10 divide-y divide-soft">
          {projects.slice(0, 3).map((project, index) => (
            <a key={project.href} href={project.href} target="_blank" rel="noreferrer" className="project-row group">
              <span className="project-index">0{index + 1}</span>
              <span className="min-w-0">
                <span className="project-title">{project.title}</span>
                <span className="mt-2 block max-w-2xl text-[0.96rem] leading-7 text-muted">{project.description}</span>
              </span>
              <span className="project-result">{project.result}</span>
              <span className="row-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section-rule mt-24 sm:mt-32">
        <div className="section-heading-row">
          <div><p className="eyebrow">Latest field notes</p><h2 className="section-title">Measurements, mechanisms, mistakes.</h2></div>
          <Link className="quiet-link" href="/blog">Archive →</Link>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-soft bg-soft md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="note-card">
              <p className="note-meta">{formatLongDate(post.date)} · {readingTime(post.body)}</p>
              <h3 className="mt-5 font-serif text-[1.55rem] font-semibold leading-[1.08] tracking-[-0.035em]">
                <Link href={`/blog/${post.slug}`} className="card-link">{post.title}</Link>
              </h3>
              <p className="mt-4 text-[0.94rem] leading-7 text-muted">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-8 inline-block font-sans text-sm font-semibold text-accent">Read note →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="my-24 rounded-2xl border border-soft bg-panel px-6 py-8 sm:my-32 sm:px-9">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">Now</p>
        <p className="mt-4 max-w-3xl font-serif text-[1.45rem] leading-[1.4] tracking-[-0.025em] text-ink">{site.closing}</p>
      </section>
    </Container>
  );
}
