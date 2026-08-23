import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { getAllPosts, formatLongDate, readingTime } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Container className="pt-16 sm:pt-24">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,48rem)_18rem] lg:items-center lg:justify-between lg:gap-10">
        <div>
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
        </div>

        <figure className="mx-auto w-full max-w-[18rem] lg:mx-0 lg:justify-self-end">
          <div className="overflow-hidden rounded-2xl border border-soft bg-panel p-2 shadow-[0_22px_60px_rgba(20,24,20,0.12)]">
            <Image
              src={site.profileImage}
              alt={`Portrait of ${site.name}`}
              width={880}
              height={1320}
              priority
              className="aspect-[2/3] w-full rounded-xl object-cover object-top grayscale-[0.1]"
            />
          </div>
          <blockquote className="mt-5 border-l border-accent/55 pl-4 font-serif text-[1.02rem] font-medium leading-6 tracking-[-0.025em] text-ink/85">
            “{site.quote.text}”
          </blockquote>
          <figcaption className="mt-2 pl-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            — {site.quote.author}
          </figcaption>
        </figure>
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
