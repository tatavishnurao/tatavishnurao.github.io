import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <Container className="pt-16 sm:pt-24">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,48rem)_18rem] lg:items-center lg:justify-between lg:gap-10">
        <div>
          <p className="eyebrow">AI infrastructure · Hyderabad, India</p>
          <h1 className="display-heading mt-6 max-w-4xl text-[2.25rem] leading-[1] sm:text-[3.7rem] lg:text-[4.35rem]">
            {site.homeHeading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="body-copy mt-8 max-w-[43rem] text-[1rem] sm:text-[1.08rem]">
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
          <section className="mt-8 border-t border-soft pt-5" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">Skills</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.skills.map((skill) => <li key={skill} className="skill-pill">{skill}</li>)}
            </ul>
          </section>
        </figure>
      </section>

      <section className="section-rule mt-20 sm:mt-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Two pinned repositories. One simple index.</p>
          <Link className="quiet-link" href="/projects">View pinned projects →</Link>
        </div>
      </section>
    </Container>
  );
}
